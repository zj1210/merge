//！！！这个脚本挂在了Thing prefab下的 selectedNode上 一定要注意！！！
cc.Class({
    extends: cc.Component,

    properties: {


        dragon_1_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        dragon_2_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        dragon_3_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        dragon_4_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        // defaults, set visually when attaching this script to the Canvas
        underpan: {
            default: null,
            type: cc.Node
        }
    },

    settingSpriteFrame(type, level) {
        //其实是龙，这样命名不太好
        this.thing_spr = this.getComponent(cc.Sprite);
        if (type == 3) {
            if (level == 1) {
                this.thing_spr.spriteFrame = this.dragon_1_spr;
            } else if (level == 2) {
                this.thing_spr.spriteFrame = this.dragon_2_spr;
            } else if (level == 3) {
                this.thing_spr.spriteFrame = this.dragon_3_spr;
            } else if (level == 4) {
                this.thing_spr.spriteFrame = this.dragon_4_spr;
            }
        } else {
            debugger;
        }
    },

    // use this for initialization
    onLoad: function () {
        this.underpan.active = false;

        //标记是否处理 按钮点击事件
        this.selectClickFlag = true;
        //搜索到的附近 同类型参与合并的龙
        this.dragonArray = null;

        //检测半径 
        this.detectionRadius = 160; //两只龙检测范围相交 即 dist<2*detectionRadius;

        this.curCanUnionedDragons = null;
        this.lastCanUnionedDragons = null;

        //是否在采集状态
        this.collectionState = false;
        
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
            self.underpan.active = true;

        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if (self._beginPos) {
                // console.log('touch move by flower');
                self.closeSelectClick();
                event.stopPropagation();

                //点击跟随 触摸点
                //物体的世界坐标 = touchPos+ _offset;
                var touchpos = event.getLocation(); //触摸点的摄像机坐标系下的坐标
                //是否需要移动摄像机 若需要，物体的世界坐标也会变化
                var camerapos = cc.pAdd(touchpos, self._offset); //物体的摄像机坐标系
                var worldpos = self.game.camera.getComponent(cc.Camera).getCameraToWorldPoint(camerapos);
                //需要将世界坐标转为 节点坐标 这里是thingsNode下的坐标
                var nodepos = self.node.parent.convertToNodeSpaceAR(worldpos);
                self.node.position = nodepos;

                self.game.changeCameraPosition(touchpos, self.node);

                //以此龙的坐标为原点，半径为范围查找相交的龙，返回的是一个集合
                self.curCanUnionedDragons = self.game.findCanUnionDragons(self.node);

                //当前集合内的龙 和上次 集合内的龙完全一样
                if (self.curAndLastUnionedDragonsIsSame()) {
                    //完全一样 就什么也不做目前，因为没必要加动画了。
                    //console.log('之前和现在的龙集合一样')
                } else {
                    //不一样，需要先停止之前的提示动画，若有的话
                    if (self.lastCanUnionedDragons && self.lastCanUnionedDragons.length > 2) {
                        self.dragonsGoStatic();
                    }
                    if (self.curCanUnionedDragons.length > 2) {
                        self.dragonUnionTips();
                    }
                    self.lastCanUnionedDragons = self.curCanUnionedDragons;
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
        // console.log('touch end by flower');
        let self = this;
        self.unBrowseThisThing();
        self.openSelectClick();
        event.stopPropagation();
        self.game.stopCamera();
        self._beginPos = null;
        self._offset = null;

        //是否可以合并
        if (self.curCanUnionedDragons.length > 2) {
            //合并算法
            self.game.union_Dragons_Algorithm(self.curCanUnionedDragons);
        }
        //不能合并的情况下 要判断松手位置是有能采集的花，若有开始采集
        else {
            //有体力
            if(self.strength>0) {
                //龙的位置下最近的tile里有花 且级别够
                // var touchpos = event.getLocation();
                // var camerapos = cc.pAdd(touchpos, self._offset); //物体的摄像机坐标系
                // var worldpos = self.game.camera.getComponent(cc.Camera).getCameraToWorldPoint(camerapos);
                //用underPan来判断视觉上好点
                var worldpos = self.underpan.parent.convertToWorldSpaceAR(self.underpan.position);
                //传入龙的世界坐标，若有花，且级别够，则采集
                self.game.collectionFlower(self,worldpos);
               
            }
        }

        self.underpan.active = false;

        //cc.dataMgr.debugTileInfo();
    },

    selectClick: function () {
        if (this.selectClickFlag) {
            //console.log('选择thing 按钮 被点击');
        }

        //console.log('thingType:  ' + this.thingType + '  ' + 'thingLevel:  ' + this.thingLevel);
    },

    closeSelectClick: function () {
        this.selectClickFlag = false;
    },

    openSelectClick: function () {
        this.selectClickFlag = true;
    },

    playCollection:function() {
        console.log('龙开始采集了。。。');
        this.collectionState =false;
    },

    //thingType 0=没有，1=精华，2=花，3=龙蛋
    //thingLevel 0初始，1升一级，以此类推，注意：蒲公英是花级别为0，如果是龙蛋，级别必须为0，龙不在地表上
    setTypeAndLevel_forNewDragon: function (thingType, thingLevel) {
        this.thingType = thingType;
        this.thingLevel = thingLevel;
        //debugger;
        this.strength = cc.dataMgr.getDragonStrength(thingLevel);
        this.settingSpriteFrame(this.thingType, this.thingLevel);

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
        console.log('浏览该物体: ' + 'thing type: ' + this.thingType + ' thing level: ' + this.thingLevel + '  dragon　strength: ' + this.strength);
    },

    unBrowseThisThing: function () {
        //console.log('不再浏览该物体！');
    },

    //判断当前范围内的可合并龙集合 和上次的龙集合元素是否完全相同
    curAndLastUnionedDragonsIsSame: function () {
        this.curCanUnionedDragons;
        this.lastCanUnionedDragons;
        if (this.lastCanUnionedDragons && this.lastCanUnionedDragons.length == this.curCanUnionedDragons.length) {
            for (var i = 0; i < this.curCanUnionedDragons.length; i++) {
                var thisDragon = this.curCanUnionedDragons[i];
                var bFlag = false;
                for (var j = 0; j < this.lastCanUnionedDragons.length; j++) {
                    var otherDragon = this.lastCanUnionedDragons[j];
                    if (thisDragon == otherDragon) {
                        bFlag = true;
                        break;
                    }
                }
                if (!bFlag) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    },

    dragonUnionTips: function () {
        for (var i = 0; i < this.curCanUnionedDragons.length; i++) {
            if (this.node != this.curCanUnionedDragons[i]) {
                this.curCanUnionedDragons[i].getComponent('Dragon').goUnionTips(this.node.position);
            }

        }
    },

    dragonsGoStatic: function () {
        if (this.lastCanUnionedDragons) {
            for (var i = 0; i < this.lastCanUnionedDragons.length; i++) {
                if (this.node != this.lastCanUnionedDragons[i]) {
                    this.lastCanUnionedDragons[i].getComponent('Dragon').goBack();
                }
            }
        }
    },

    //DragonsNode层的坐标空间下 才能保证 动画的准确性   
    goUnionTips: function (targetPos) {
        this.underpan.active = true;
        this.originPosition = this.node.position;
        //龙 从当前位置 往 targetPos位置来回移动
        var dir = cc.v2(cc.pSub(targetPos, this.node.position)).normalize();
        var moveCome = cc.moveBy(0.4, dir.mul(20));
        var moveGo = cc.moveBy(0.4, dir.mul(-20));
        var moveComeAndgo = cc.sequence(moveCome, moveGo);
        var moveLoop = cc.repeat(moveComeAndgo, 40);
        this.node.runAction(moveLoop);
    },
    //移回原本的位置 往originPosition移动 
    goBack: function () {
        this.underpan.active = false;
        
        var moveBack = cc.moveTo(0.2, this.originPosition);
        this.node.stopAllActions();
        this.node.runAction(moveBack);
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