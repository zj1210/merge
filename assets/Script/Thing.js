//！！！这个脚本挂在了Thing prefab下的 selectedNode上 一定要注意！！！
cc.Class({
    extends: cc.Component,

    properties: {


        thingNode: {
            default: null,
            type: cc.Node
        }
        // defaults, set visually when attaching this script to the Canvas

    },

    // use this for initialization
    onLoad: function () {
        this.selectedSprite = this.node.getComponent(cc.Sprite);
        this.originSpriteFrame = this.selectedSprite.spriteFrame;
        this.selectedSprite.spriteFrame = null;

        //临时的，为了性能。记录 包含触摸点的块
        this.lastNearestTile = null;
        this.currentNearestTile = null;
        this.thingsArray = null;
    },

    //如果物品确定要放入某个tile关联之中，一定要用 setPositionAndOriginPosition来设置位置 而不是position属性
    setPositionAndOriginPosition: function (position, tile) {
        this.node.parent.position = position;
        this.originPosition = position;
        //存一下 它所在的tile，为了之后修改tile的数据
        this.relationTileJS = tile.getComponent('Tile');

        this.currentNearestTile = tile;
    },

    start: function () {
        //game 脚本
        this.game = cc.find("Canvas").getComponent('Game');
        if (!this.game) {
            debugger;
        }
        let self = this;
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            //console.log('touch begin by flower');
            event.stopPropagation();

            let touchPos = event.getLocation();

            //console.log(touchPos);
            self._beginPos = touchPos;
            //物体的世界坐标 触摸点也是世界坐标，做差值得到偏移值
            var worldPosition = self.node.parent.convertToWorldSpaceAR(self.node.position);
            self._offset = cc.pSub(worldPosition, touchPos);
            //必然有物体，因为这个节点就是物体
            //显示tips
            self.selectedSprite.spriteFrame = self.originSpriteFrame;
            self.relationTileJS.thing = null;
            self.relationTileJS.tempThing = self.node.parent;
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if (self._beginPos) {
                //console.log('touch move by flower');
                event.stopPropagation();
                //核心逻辑
                //1 点击跟随 触摸点
                //物体的世界坐标 = touchPos+ _offset;
                var touchpos = event.getLocation(); //触摸点的世界坐标 其实是 摄像机坐标系下的坐标
                
                //console.log(touchpos);
                self.game.changeCameraPosition(touchpos);

                var worldpos = cc.pAdd(touchpos, self._offset); //物体的世界坐标
                //console.log(touchpos);
                //需要将世界坐标转为 节点坐标 这里是thingsNode下的坐标
                var nodepos = self.node.parent.parent.convertToNodeSpaceAR(worldpos);
                self.node.parent.position = nodepos;
                // console.log(worldPosition);
                //2 判断离哪个块近，暂时将那个块的物品平移，将那个块的 当前物品置为此物品 
                //根据触摸点，找到包含触摸点的块
                self.currentNearestTile = self.game.getContainPointTile(worldpos);

                //为性能考虑，当前最近的tile与之前存的不一样，才进行高复杂度的算法 且触摸的位置有块
                if (self.currentNearestTile != self.lastNearestTile && self.currentNearestTile) {
                    if (self.lastNearestTile) { //之前有最近点，需要将那个things从骚动的移动改为静止
                        if (self.thingsArray) {
                            self.thingsGoStatic();
                            //还需要将平移的物体移回；稍后
                        }
                    }
                    self.lastNearestTile = self.currentNearestTile;
                    //临时放入 内部 需要维护一个临时的，把自己内部的先平移
                    let tileJS = self.currentNearestTile.getComponent('Tile');
                    tileJS.putInThingTemporarily(self.node.parent);
                    //3 查找连通物品
                    self.thingsArray = self.game.findConnentedThing(self.currentNearestTile);

                    //4 将连通物品的selected active 置为true 并且播放往此物品平移的 动画
                    if (self.thingsArray && self.thingsArray.length > 2) {
                        self.thingsUnionTips();
                    }

                }
            }
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            // console.log('touch end by flower');
            event.stopPropagation();
            self._beginPos = null;
            self._offset = null;

            //此tile是否可以放入 确实是在块上(不为null) 
            if (self.currentNearestTile && self.currentNearestTile.getComponent('Tile').isCanPut()) {

                //是否可以合并
                if (self.thingsArray && self.thingsArray.length > 2) {
                    //合并算法
                    self.game.unionAlgorithm(self.thingsArray,self.currentNearestTile);
                } else {
                    //只是正常移动
                    //需要判断是否有物体
                    //有物体，先保存物体指针，把新物体放入，再找格子，放入物体
                    if (self.currentNearestTile.getComponent('Tile').thing) {
                        var temp = self.currentNearestTile.getComponent('Tile').thing;
                        var tempJs = temp.getChildByName('selectedNode').getComponent('Thing');
                        var thingLevel = self.currentNearestTile.getComponent('Tile').thingLevel;
                        var thingType = self.currentNearestTile.getComponent('Tile').thingType;
                        self.putInTile(self.currentNearestTile);

                        var tiles = self.game.getNearestTileByN(self.currentNearestTile, 1);
                        tempJs.changeInTile(tiles[0], thingLevel, thingType);
                    } else { //没有物体 直接放入
                        self.putInTile(self.currentNearestTile);
                    }
                }

            }
            //不可放入 移回原来位置
            else {
                self.goBack();
            }


            self.selectedSprite.spriteFrame = null;


            //玩家松手判定
            //1，将things,放入 
            //console.log(self.currentNearestTile);


            //根据数量 查表 根据合成数量 返回合成奖励后的数量
            // 根据数量来生成 新花 龙，精华 三的整数倍 余数 还是生成原来的 返回的是 物品集合
            //将物品放入格子算法 最大的物品，第一个，放入当前格子（当前还是要记录的）
            //其余物品如何放置？ 根据其余物品数量，找到相应数量的格子（距离最近的，遍历所有格子，找到前n个最近的），一一播放动画，回调插入

            self.lastNearestTile = null;
            self.thingsArray = null;

            //cc.dataMgr.debugTileInfo();
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) { }, this.node);
    },


    selectClick: function () {

    },

    //thingType 0=没有，1=精华，2=花，3=龙蛋
    //thingLevel 0初始，1升一级，以此类推，注意：蒲公英是花级别为0，如果是龙蛋，级别必须为0，龙不在地表上
    setTypeAndLevel_forNewThing: function (thingType, thingLevel) {
        this.thingType = thingType;
        this.thingLevel = thingLevel;
        var tt = this.thingNode.getComponent('thingImageAndAni');
        this.thingNode.getComponent('thingImageAndAni').settingSpriteFrame(this.thingType,this.thingLevel);
       
        // //debugger;
        // if (thingType == 1) {
        //     switch (thingLevel) {
        //         case 1:
        //             console.log("执行到了，要改变物体的图片");
        //             break;

        //         default:
        //             break;
        //     }
        // }
    },

    

    thingsUnionTips: function () {
        for (var i = 0; i < this.thingsArray.length; i++) {
            if (this.node.parent != this.thingsArray[i]) {
                this.thingsArray[i].getChildByName('selectedNode').getComponent('Thing').goUnionTips(this.node.parent.position);
            }

        }
    },

    thingsGoStatic: function () {
        if (this.thingsArray) {
            for (var i = 0; i < this.thingsArray.length; i++) {
                if (this.node.parent != this.thingsArray[i]) {
                    this.thingsArray[i].getChildByName('selectedNode').getComponent('Thing').goBack();
                }
            }
        }
    },

    //thingsNode层的坐标空间下 才能保证 动画的准确性   
    goUnionTips: function (targetPos) {
        var pNode = this.node.parent;
        this.selectedSprite.spriteFrame = this.originSpriteFrame;
        //pNode 从originPosition 往 targetPos位置来回移动
        var dir = cc.v2(cc.pSub(targetPos, this.originPosition)).normalize();
        // var move1 = cc.moveBy(0.15, dir.mul(20));
        // var moveGo = cc.moveBy(0.4, dir.mul(-40));
        // var moveCome = cc.moveBy(0.4, dir.mul(40));
        // var moveComeAndgo = cc.sequence(moveGo, moveCome);
        // var moveLoop = cc.repeat(moveComeAndgo, 40);
        // var finalAction = cc.sequence(move1, moveLoop);
        var moveCome = cc.moveBy(0.4, dir.mul(20));
        var moveGo = cc.moveBy(0.4, dir.mul(-20));
        var moveComeAndgo = cc.sequence(moveCome, moveGo);
        var moveLoop = cc.repeat(moveComeAndgo, 40);
        pNode.runAction(moveLoop);
    },
    //移回原本的位置 往originPosition移动 
    goBack: function () {
        this.selectedSprite.spriteFrame = null;
        var pNode = this.node.parent;
        var moveBack = cc.moveTo(0.2, this.originPosition);
        pNode.stopAllActions();
        pNode.runAction(moveBack);
    },

    //放入tile 需要把现在所在tile置空，目标tile置为现在的数据
    putInTile: function (targetTile) {
        var pNode = this.node.parent;
        //把之前的tile的thing 置为null
        this.relationTileJS.thing = null;
        var tempThingLevel = this.relationTileJS.thingLevel;
        var tempThingType = this.relationTileJS.thingType;
        this.relationTileJS.thingLevel = 0;
        this.relationTileJS.thingType = 0;
        var tileJS = targetTile.getComponent('Tile');
        //新tilejs
        this.relationTileJS = tileJS;
        tileJS.thing = pNode;
        this.relationTileJS.thingLevel = tempThingLevel;
        this.relationTileJS.thingType = tempThingType;
        this.originPosition = targetTile.position;
        var moveGo = cc.moveTo(0.2, targetTile.position);
        pNode.runAction(moveGo);
        // console.log('====看下 所有tile数据')
        // for (var i = 0; i < 4; i++) {
        //     for (var j = 0; j < 2; j++) {
        //         console.log(cc.dataMgr.tilesData[i][j].getComponent('Tile'));
        //     }
        // }
    },

    //此thing的tile被人占了，需要给他放入别的tile中
    changeInTile: function (targetTile, thingLevel, thingType) {
        var pNode = this.node.parent;
        var tileJS = targetTile.getComponent('Tile');
        this.relationTileJS = tileJS;
        tileJS.thing = pNode;
        this.relationTileJS.thingLevel = thingLevel;
        this.relationTileJS.thingType = thingType;
        this.originPosition = targetTile.position;
        var moveGo = cc.moveTo(0.2, targetTile.position);
        pNode.runAction(moveGo);
    },
    /**
     * 
      
    },

    //如果物品确定要放入某个tile关联之中，一定要用 setPositionAndOriginPosition来设置位置 而不是position属性
    setPositionAndOriginPosition: function (position, tile) {
        this.node.parent.position = position;
        this.originPosition = position;
        //存一下 它所在的tile，为了之后修改tile的数据
        this.relationTileJS = tile.getComponent('Tile');

        this.currentNearestTile = tile;} 
     */



    update: function (dt) {

    },
});