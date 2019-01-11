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

        //标记是否处理 按钮点击事件
        this.selectClickFlag = true;

        //临时的，为了性能。记录 包含触摸点的块
        this.lastNearestTile = null;
        this.currentNearestTile = null;
        this.thingsArray = null;

        //用于标记是否执行touchend
        this.isClick = false;

        //新需求，双击花，让龙来采集
        //思路：首先双击的要是花，其实花的级别要够
        //然后将龙moveTo到花上，调用龙的采集函数即可
        //哪条龙，距离最近的龙
        //实现双击的思路：记录一个上次touchEnd的时间戳lastTouchTime;
        //这次touchEnd的时间戳 curTouchTime;
        //若 curTouchTime - lastTouchTime <阀值 算作双击 可调用上面的逻辑
        //https://forum.cocos.com/t/cocos-creator/45464 参考
        this.lastTouchTime = null;

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
        this.ui = cc.find("Canvas/uiLayer").getComponent('UI');


        if (!this.game) {
            debugger;
        }
        let self = this;
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            // console.log('touch begin by flower');

            self.ratio = self.game.camera.getComponent(cc.Camera).zoomRatio;
            cc.audioMgr.playEffect("btn_click");
            self.browseThisThing();
            event.stopPropagation();

            //摄像机下的触摸点 需要转换为 世界坐标
            let touchPos = event.getLocation();

            var worldTouchPos = self.game.camera.getComponent(cc.Camera).getCameraToWorldPoint(touchPos);
            //console.log(touchPos);
            self._beginPos = worldTouchPos;
            //物体的世界坐标 触摸点也是世界坐标，做差值得到偏移值
            var worldPosition = self.node.parent.convertToWorldSpaceAR(self.node.position);
            self._offset = cc.pSub(worldPosition, worldTouchPos);
            //必然有物体，因为这个节点就是物体
            //显示tips
            self.selectedSprite.spriteFrame = self.originSpriteFrame;
            self.relationTileJS.thing = null;
            self.relationTileJS.tempThing = self.node.parent;

            //点击这一刻的时间 毫秒
            self.touchBeginTime = Date.now();
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if (self._beginPos) {
                // console.log('touch move by flower');

                event.stopPropagation();
                var touchpos = event.getLocation(); //触摸点的世界坐标 其实是 摄像机坐标系下的坐标

                //是否需要移动摄像机 若需要，物体的世界坐标也会变化
                var tempX = self._offset.x * self.ratio;
                var tempY = self._offset.y * self.ratio;
                var tempV = cc.v2(tempX, tempY);
                var camerapos = cc.pAdd(touchpos, tempV); //物体的摄像机坐标系
                var worldpos = self.game.camera.getComponent(cc.Camera).getCameraToWorldPoint(camerapos);

                //需要将世界坐标转为 节点坐标 这里是thingsNode下的坐标
                var nodepos = self.node.parent.parent.convertToNodeSpaceAR(worldpos);
                self.node.parent.position = nodepos;

                self.game.changeCameraPosition(touchpos, self.node.parent);

                //2 判断离哪个块近，暂时将那个块的物品平移，将那个块的 当前物品置为此物品 
                //根据触摸点，找到包含触摸点的块
                //console.log(worldpos);
                self.currentNearestTile = self.game.getContainPointTile_FogIsNull(worldpos);

                //debugger;
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
                   
                    var maxLevel = cc.dataMgr.getMaxLevelByType(self.thingType);
                    if(self.thingLevel<maxLevel) {
                        self.thingsArray = self.game.findConnentedThing(self.currentNearestTile);
                    } else {
                        self.thingsArray = null;
                    }
                    

                    //4 将连通物品的selected active 置为true 并且播放往此物品平移的 动画
                    if (self.thingsArray && self.thingsArray.length > 2) {
                        self.thingsUnionTips();
                    }

                }
                //当前thing对应的块为null 且和上一次的对应的块不一样 将连通提示关闭
                else if (!self.currentNearestTile && self.lastNearestTile != self.currentNearestTile) {
                    if (self.thingsArray) {
                        self.thingsGoStatic();
                        //还需要将平移的物体移回；稍后
                    }
                    self.lastNearestTile = self.currentNearestTile;
                }
            }
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.touchEnd(event);
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            //console.log('touch cancel');
            self.touchEnd(event);
        }, this.node);
    },

    touchEnd: function (event) {
        console.log('touch end by flower');
        let self = this;
        event.stopPropagation();
        self.unBrowseThisThing();


        //self.openSelectClick();

        if (this.isClick == false) {
            //此tile是否可以放入 确实是在块上(不为null) 
            if (self.currentNearestTile && self.currentNearestTile.getComponent('Tile').isCanPut()) {

                //是否可以合并
                if (self.thingsArray && self.thingsArray.length > 2) {
                    //合并算法
                    self.game.unionAlgorithm(self.thingsArray, self.currentNearestTile);
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
                        //若有格子 才处理
                        if (tiles) {
                            tempJs.changeInTile(tiles[0], thingLevel, thingType);
                        }
                        //没有格子就不可交换
                        else {
                            //debugger;
                            self.relationTileJS.thing = this.node.parent;
                            self.relationTileJS.tempThing = null;
                            self.goBack();
                        }

                    } else { //没有物体 直接放入
                        self.putInTile(self.currentNearestTile);
                    }
                }

            }
            //不可放入 移回原来位置
            else {
                self.relationTileJS.thing = this.node.parent;
                self.relationTileJS.tempThing = null;
                self.goBack();
            }
        } else {
            this.isClick = false;
            //现在是以时间来进行区分 点击 可 平移 所以move事件可能已经调用，
            //也就意味着：可能搜寻到了联通物，那些thing已经开始骚动 需要将那些thing的骚动关闭
            if (self.thingsArray) {
                self.thingsGoStatic();
            }
        }


        self.game.stopCamera();
        self._beginPos = null;
        self._offset = null;
        self.selectedSprite.spriteFrame = null;
        self.lastNearestTile = null;
        self.thingsArray = null;
        //cc.dataMgr.debugTileInfo();
    },

    selectClick: function () {

        //松手这一刻的毫秒
        var endTouchTime = Date.now();
        var dt = endTouchTime - this.touchBeginTime;
        console.log("点击松开 时间差--->    " + dt);
        if (dt < 150) {
            console.log('选择thing 按钮 被点击');
            //如果是心的话，存为心型货币
            if (this.thingType == 1) {

                var m = this.game.camera.getComponent(cc.Camera).getNodeToCameraTransform(this.node.parent.getChildByName('thing'));
                var camerapos = cc.v2();
                camerapos = cc.pointApplyAffineTransform(this.node.parent.getChildByName('thing').position, m);
                var level = this.thingLevel;

                var heartTipsNode = this.game.node.getChildByName("gameLayer").getChildByName("effectsNode").getChildByName("heartTipsNode");
                heartTipsNode.position = cc.v2(this.node.parent.position.x,this.node.parent.position.y+50);
                var tipsLabel = heartTipsNode.getChildByName("tipsLabel");
                tipsLabel.getComponent(cc.Label).string = "+" + cc.dataMgr.getHeartCountByLevel(level) + "精华"
                tipsLabel.getComponent(cc.Animation).play("heartCountTips");
                this.ui.addHeartAndAni(camerapos, level);
                this.relationTileJS.thing = null;
                this.relationTileJS.thingType = 0;
                this.relationTileJS.thingLevel = 0;

                this.node.parent.destroy();
                this.isClick = true;

                window.Notification.emit("COL_HEART");

            } else if (this.thingType == 2 && this.thingLevel > 1) {
                console.log("花被点击，龙来采集");
                this.relationTileJS.thing = this.node.parent;
                this.relationTileJS.tempThing = null;
                this.goBack();
                this.isClick = true;
                var draggon = this.game.findCanCollectionDraggon();
                if (draggon) {
                    var draggonJS = draggon.getComponent('Dragon');
                    draggonJS.moveAndCollectioning(this.relationTileJS.node);
                }
              
            }


            // if (this.selectClickFlag) {


            //         //this.node.destroy();
            //     }

        }

        //console.log('thingType:  ' + this.thingType + '  ' + 'thingLevel:  ' + this.thingLevel);
    },

    // closeSelectClick: function () {
    //     this.selectClickFlag = false;
    // },

    // openSelectClick: function () {
    //     this.selectClickFlag = true;
    // },

    //thingType 0=没有，1=精华，2=花，3=龙蛋
    //thingLevel 0初始，1升一级，以此类推，注意：蒲公英是花级别为0，如果是龙蛋，级别必须为0，龙不在地表上
    setTypeAndLevel_forNewThing: function (thingType, thingLevel) {
        this.thingType = thingType;
        this.thingLevel = thingLevel;
        var tt = this.thingNode.getComponent('thingImageAndAni');
        this.thingNode.getComponent('thingImageAndAni').settingSpriteFrame(this.thingType, this.thingLevel);

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


    browseThisThing: function () {
        console.log('浏览该物体: ' + 'thing type: ' + this.thingType + ' thing level: ' + this.thingLevel);
        this.ui.addDescForClick(this.thingType, this.thingLevel);
    },

    unBrowseThisThing: function () {
        //console.log('不再浏览该物体！');

        //this.ui.clearDescForUnClick();
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
        this.node.parent.setLocalZOrder(tileJS.thingZOrder);
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
    //生成新thing时 也会调用
    changeInTile: function (targetTile, thingLevel, thingType) {
        var pNode = this.node.parent;
        var tileJS = targetTile.getComponent('Tile');
        this.relationTileJS = tileJS;
        tileJS.thing = pNode;
        this.relationTileJS.thingLevel = thingLevel;
        this.relationTileJS.thingType = thingType;
        this.originPosition = targetTile.position;
        this.node.parent.setLocalZOrder(tileJS.thingZOrder);
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