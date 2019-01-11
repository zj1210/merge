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

        wing_1_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        wing_2_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        wing_3_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        wing_4_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        // defaults, set visually when attaching this script to the Canvas
        underpan: {
            default: null,
            type: cc.Node
        },
        collectionThing: {
            default: null,
            type: cc.Node
        },

        dragonSpr: {
            default: null,
            type: cc.Sprite
        },


        wing1: {
            default: null,
            type: cc.Sprite
        },
        wing2: {
            default: null,
            type: cc.Sprite
        },

        tipsNode: {
            default: null,
            type: cc.Node
        },

        progressNode: {
            default: null,
            type: cc.Node
        },

        eyeSprite: {
            default: null,
            type: cc.Sprite
        },

        eye01_spr: {
            default: null,
            type: cc.SpriteFrame
        },

        eye02_spr: {
            default: null,
            type: cc.SpriteFrame
        },

        eye03_spr: {
            default: null,
            type: cc.SpriteFrame
        },

        eye04_spr: {
            default: null,
            type: cc.SpriteFrame
        },
    },

    settingSpriteFrame(type, level) {
        //历史原因 在prefab顶层加入了一个看不见的图片 保证触摸和显示大小匹配
        //this.dragon_Touch_Spr = this.getComponent(cc.Sprite);
        //debugger;
        if (type == 3) {
            if (level == 1) {
                this.dragonSpr.spriteFrame = this.dragon_1_spr;
                this.wing1.spriteFrame = this.wing_1_spr;
                this.wing2.spriteFrame = this.wing_1_spr;
                this.eyeSprite.spriteFrame = this.eye01_spr;

            } else if (level == 2) {
                this.dragonSpr.spriteFrame = this.dragon_2_spr;
                this.wing1.spriteFrame = this.wing_2_spr;
                this.wing2.spriteFrame = this.wing_2_spr;
                this.wing1.node.position = cc.v2(-19, 15);
                this.wing2.node.position = cc.v2(-4.5, 16);
                this.eyeSprite.spriteFrame = this.eye02_spr;
                this.eyeSprite.node.position = cc.v2(-36.5, 66.3);

                this.collectionThing.position = cc.v2(0, 80);
                this.progressNode.position = cc.v2(0, 190);
                this.tipsNode.position = cc.v2(0, 190);

            } else if (level == 3) {
                this.dragonSpr.spriteFrame = this.dragon_3_spr;
                this.wing1.spriteFrame = this.wing_3_spr;
                this.wing2.spriteFrame = this.wing_3_spr;
                this.wing1.node.position = cc.v2(-40, 83);
                this.wing2.node.position = cc.v2(-12, 85);
                this.eyeSprite.spriteFrame = this.eye03_spr;
                this.eyeSprite.node.position = cc.v2(-73.3, 140.4);

                this.collectionThing.position = cc.v2(0, 130);
                this.progressNode.position = cc.v2(0, 260);
                this.tipsNode.position = cc.v2(0, 130);

            } else if (level == 4) {
                this.dragonSpr.spriteFrame = this.dragon_4_spr;
                this.wing1.spriteFrame = this.wing_4_spr;
                this.wing2.spriteFrame = this.wing_4_spr;
                this.wing1.node.position = cc.v2(-102, 83);
                this.wing2.node.position = cc.v2(-60, 85);
                this.eyeSprite.spriteFrame = this.eye04_spr;
                this.eyeSprite.node.position = cc.v2(-99.5, 182.4);

                this.collectionThing.position = cc.v2(0, 130);
                this.progressNode.position = cc.v2(0, 300);
                this.tipsNode.position = cc.v2(0, 130);

            }
            // this.node.width = this.dragonSpr.spriteFrame._rect.width;
            // this.node.height = this.dragonSpr.spriteFrame._rect.height;

            this.node.setContentSize(this.dragonSpr.node.getContentSize());
        } else {
            debugger;
        }
    },

    // use this for initialization
    onLoad: function () {
        this.underpan.active = false;
        this.collectionThing.active = false;

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
        //是否在往花身上移动的状态
        this.movingToFlowerState = false;

        //龙的状态： 0 默认寻路 1 被点击   2  采集  3 合并提示态
        //每次的状态更新 都要调用 此脚本的状态改变函数
        // this.lastDragonState = -1;
        // this.currentDragonState = 0;
        // this.dragonActionByState();

    },

    //麻烦先废弃
    // dragonActionByState: function () {
    //     if (this.currentDragonState != this.lastDragonState) {
    //         this.lastDragonState = this.currentDragonState;
    //         switch (this.currentDragonState) {
    //             case 0:

    //                 break;
    //             case 1:

    //                 break;
    //             case 2:

    //                 break;
    //             case 3:

    //                 break;

    //             default:
    //                 console.log("什么态也不是？不可能");
    //                 debugger;
    //                 break;
    //         }
    //     }
    //},

    start: function () {
        // console.log("dragon start");
        //game 脚本
        this.game = cc.find("Canvas").getComponent('Game');
        this.ui = cc.find("Canvas/uiLayer").getComponent('UI');
        this.node.getChildByName("progressNode").active = false;



        var dragonNode = this.node.getChildByName('dragonNode');
        if (!this.game) {
            debugger;
        }
        let self = this;

        var lastTouchX = 0.0;
        var curTouchX = 0.0;
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.ratio = self.game.camera.getComponent(cc.Camera).zoomRatio;
            //console.log('touch begin by flower');
            self.browseThisThing();
            event.stopPropagation();
            cc.audioMgr.playEffect("btn_click");
            //如果有生成物，需要放置生成物
            if (self.collectionThing.active) {
                self.collectionThingClick();
            }

            if (self.movingToFlowerState) {
                self.node.stopActionByTag(self.node.moveActionTag);
                self.movingToFlowerState = false;
            }

            //摄像机下的触摸点 需要转换为 世界坐标
            let touchPos = event.getLocation();
            lastTouchX = touchPos.x;
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


        var dnAction1 = cc.scaleTo(0.2, -1, 1);
        var dnAction2 = cc.scaleTo(0.2, 1, 1);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if (self._beginPos) {
                // console.log('touch move by flower');
                self.closeSelectClick();
                event.stopPropagation();

                if (self.collectionState == true) {
                    self.collectionInterrupt();
                }



                //点击跟随 触摸点
                //物体的世界坐标 = touchPos+ _offset;
                var touchpos = event.getLocation(); //触摸点的摄像机坐标系下的坐标


                curTouchX = touchpos.x;


                if (curTouchX > lastTouchX) {

                    dragonNode.runAction(dnAction1);

                } else {

                    dragonNode.runAction(dnAction2);
                }

                lastTouchX = curTouchX;


                //是否需要移动摄像机 若需要，物体的世界坐标也会变化
                var tempX = self._offset.x * self.ratio;
                var tempY = self._offset.y * self.ratio;
                var tempV = cc.v2(tempX, tempY);
                var camerapos = cc.pAdd(touchpos, tempV); //物体的摄像机坐标系
                //var camerapos = cc.pAdd(touchpos, self._offset); //物体的摄像机坐标系
                var worldpos = self.game.camera.getComponent(cc.Camera).getCameraToWorldPoint(camerapos);
                //需要将世界坐标转为 节点坐标 这里是thingsNode下的坐标
                var nodepos = self.node.parent.convertToNodeSpaceAR(worldpos);
                self.node.position = nodepos;

                self.game.changeCameraPosition(touchpos, self.node);

                

                var maxLevel = cc.dataMgr.getMaxLevelByType(self.thingType);
                if(self.thingLevel<maxLevel) {
                   //以此龙的坐标为原点，半径为范围查找相交的龙，返回的是一个集合
                self.curCanUnionedDragons = self.game.findCanUnionDragons(self.node);
                } else {
                    self.curCanUnionedDragons = [];
                }

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
        if (self.curCanUnionedDragons && self.curCanUnionedDragons.length > 2) {
            //合并算法
            self.game.union_Dragons_Algorithm(self.curCanUnionedDragons);
        }
        //不能合并的情况下 要判断松手位置是有能采集的花，若有开始采集,还要判断当前他是否有生成物，若有先放置
        else {
            //若有生成物 先放置
            if (self.collectionThing.active) {
                self.collectionThingClick();
            }

            //有体力
            if (self.strength >= 0) {
                //龙的位置下最近的tile里有花 且级别够
                // var touchpos = event.getLocation();
                // var camerapos = cc.pAdd(touchpos, self._offset); //物体的摄像机坐标系
                // var worldpos = self.game.camera.getComponent(cc.Camera).getCameraToWorldPoint(camerapos);
                //用underPan来判断视觉上好点
                var worldpos = self.underpan.parent.convertToWorldSpaceAR(self.underpan.position);
                //传入龙的世界坐标，若有花，且级别够，则采集
                self.game.collectionFlower(self, worldpos);

            }
        }

        self.underpan.active = false;

        //cc.dataMgr.debugTileInfo();
    },

    selectClick: function () {
        if (this.selectClickFlag) {
            console.log('选择dragon 按钮 被点击');
        }

        //console.log('thingType:  ' + this.thingType + '  ' + 'thingLevel:  ' + this.thingLevel);
    },

    closeSelectClick: function () {
        this.selectClickFlag = false;
    },

    openSelectClick: function () {
        this.selectClickFlag = true;
    },

    playCollection: function (flowerLevel) {
        if (this.strength <= 0) {
            this.changeLabel("太累了!");
            this.scheduleOnce(this.goToDragonNest, 1.0);
            this.node.targetOff(this.node);
            return;
        }

        console.log('龙开始采集了。。。');
        this.collectionState = true;
        this.node.getChildByName("progressNode").active = true;
        this.node.getChildByName('dragonNode').getComponent(cc.Animation).play("dragonCollection");
        this.unschedule(this.collectionOver);
        var needTime = cc.dataMgr.getNeedTimeByFlowerLevel(flowerLevel);

        this.currentFlowerLevel = flowerLevel;
        this.scheduleOnce(this.collectionOver, needTime);


        this.node.getChildByName("progressNode").runAction(this.myProgressTo_act(needTime, 1.0, 0.0));
        // var heartLevel = cc.dataMgr.getCollectionHeartLevel(flowerLevel);

        // this.generateHeartAndPlace(heartLevel);


    },

    //移动到花，然后采集的逻辑，用于点击花 龙去采集
    moveAndCollectioning: function (tileNode) {

        if (this.collectionThing.active) {
            this.collectionThingClick();
        }
        this.movingToFlowerState = true;
        var pos = tileNode.position;
        var worldpos = tileNode.parent.convertToWorldSpaceAR(pos);
        pos.y += 150;
        var dragonNode = this.node.getChildByName('dragonNode');
        if (this.node.x > pos.x) {
            dragonNode.scaleX = 1;
        } else {
            dragonNode.scaleX = -1;
        }
        var seq = cc.sequence(cc.moveTo(1.0, pos), cc.callFunc(this.gotoFlowerOver, this, worldpos));
        seq.tag = 233;
        this.node.moveActionTag = seq.tag;
        this.node.runAction(seq);
    },

    gotoFlowerOver: function (no, worldpos) {
        this.movingToFlowerState = false;
        this.game.collectionFlower(this, worldpos);
    },

    changeLabel: function (value) {

        //this.tipsLabel.string = value;
        var tipsLabel = this.tipsNode.getChildByName("tipsLabel").getComponent(cc.Label);
        tipsLabel.string = value;

        tipsLabel.node.getComponent(cc.Animation).play('tipsLabel');

    },

    collectionInterrupt: function () {
        this.unschedule(this.collectionOver);
        this.node.getChildByName('dragonNode').getComponent(cc.Animation).play("dragonDefault");
        this.node.getChildByName("progressNode").active = false;
        this.collectionState = false;
        this.currentFlowerLevel = null;
    },

    collectionOver: function () {

        var heartLevel = cc.dataMgr.getCollectionHeartLevel(this.currentFlowerLevel);
        this.generateHeartAndPlace(heartLevel);
        this.collectionInterrupt();

        this.strength--;

        window.Notification.emit("COL_SUCCESS");

    },

    //将龙移入龙巢
    goToDragonNest: function () {


        //var worldpos = this.node.parent.convertToWorldSpaceAR(this.node.position);
        //console.log(worldpos);
        // self.game.camera.getComponent(cc.Camera).getCameraToWorldPoint(touchPos);

        //var camerapos = cc.v2(worldpos.x - this.game.camera.position.x, worldpos.y - this.game.camera.position.y);

        var m = this.game.camera.getComponent(cc.Camera).getNodeToCameraTransform(this.node.getChildByName('dragonNode'));

        var camerapos = cc.v2();
        camerapos = cc.pointApplyAffineTransform(this.node.getChildByName('dragonNode').position, m);

        var level = this.thingLevel;

        this.ui.addDragonToNest(camerapos, level);

        this.node.destroy();

    },


    myProgressTo_act(timeT, aimProgress, baseProgress) {
        let action = cc.delayTime(timeT);
        action.aimProgress = aimProgress;
        action.baseProgress = baseProgress;
        action.update = function (dt) {
            let node = action.getTarget();
            if (node && node.getComponent(cc.ProgressBar)) {
                node.getComponent(cc.ProgressBar).progress = baseProgress + dt * (this.aimProgress - this.baseProgress);
            }
        };
        return action;
    },



    generateHeartAndPlace: function (heartLevel) {
        //精华的类型是1 
        this.collectionThing.active = true;
        this.collectionThing.getComponent('thingImageAndAni').settingSpriteFrame(1, heartLevel);

        //我把数据放在了这里。。。结构有点差，图方便
        this.collectionThing.thingType = 1;
        this.collectionThing.thingLevel = heartLevel;
    },

    collectionThingClick: function () {
        console.log('生成物被点击！');
        //var pos = this.node.parent.convertToNodeSpaceAR(this.node.position);

        var pos = this.node.position;
        //这引擎真垃圾，传参文档是劝退的，弄成成员变量了！！
        this.resultTiles = this.game.getNearestTileByN_pos(pos, 1);
        //console.log("是不是上面卡？");
        if (this.resultTiles != null) {
            //有空格 移入棋盘
            //debugger;
            //console.log(this.resultTiles[0]);
            //this.collectionThingOriginPos  = this.collectionThing.position;
            //在thingsNode层创建一个 图片 让他移动到tile的位置 然后删除它，创建prefab的thing 放入
            //之所以这样，是因为龙身上的图片移动过程中 移动龙会造成bug，因为那是他的子节点，现在分开了
            var moveThing = cc.instantiate(this.collectionThing);
            // debugger;
            var thingsNode = this.node.parent.parent.getChildByName('thingsNode');
            thingsNode.addChild(moveThing);
            var movethingWorldPos = this.collectionThing.parent.convertToWorldSpaceAR(this.collectionThing.position);
            var moveThingNodePos = thingsNode.convertToNodeSpaceAR(movethingWorldPos);
            moveThing.position = moveThingNodePos;

            this.collectionThing.active = false;
            var worldpos = this.resultTiles[0].parent.convertToWorldSpaceAR(this.resultTiles[0].position);
            var nodepos = thingsNode.convertToNodeSpaceAR(worldpos);
            var moveTo = cc.moveTo(0.5, nodepos);



            var newThing = this.game.generateThing(this.collectionThing.thingType, this.collectionThing.thingLevel);
            var thingJs = newThing.getChildByName('selectedNode').getComponent("Thing");
            var thingsNode = this.node.parent.parent.getChildByName('thingsNode');
            thingsNode.addChild(newThing);


            newThing.position = nodepos;
            thingJs.changeInTile(this.resultTiles[0], this.collectionThing.thingLevel, this.collectionThing.thingType);

            newThing.active = false;

            var seq = cc.sequence(moveTo, cc.callFunc(this.thingMoveToOver, this, { "moveThing": moveThing, "newThing": newThing }));
            moveThing.setLocalZOrder(9999);
            moveThing.runAction(seq);

        }
        //没有空格 直接转换为货币，飞入UI部分
        else {
            //debugger;
            console.log("没有空格：直接转换为货币，飞入UI部分");
            // var worldpos = this.collectionThing.parent.convertToWorldSpaceAR(this.collectionThing.position);
            // var camerapos = cc.v2(worldpos.x - this.game.camera.position.x, worldpos.y - this.game.camera.position.y);


            var m = this.game.camera.getComponent(cc.Camera).getNodeToCameraTransform(this.collectionThing);

            var camerapos = cc.v2();
            camerapos = cc.pointApplyAffineTransform(this.collectionThing.position, m);

            this.collectionThing.active = false;
            this.ui.addHeartAndAni(camerapos, this.collectionThing.thingLevel);
        }
    },

    thingMoveToOver: function (data,things) {
        //debugger;
        console.log("生成物-->移动到目标位置！");


        things.newThing.active = true;

        things.moveThing.destroy();


    },

    //thingType 0=没有，1=精华，2=花，3=龙蛋
    //thingLevel 0初始，1升一级，以此类推，注意：蒲公英是花级别为0，如果是龙蛋，级别必须为0，龙不在地表上
    setTypeAndLevel_forNewDragon: function (thingType, thingLevel) {
        this.thingType = thingType;
        this.thingLevel = thingLevel;
        //debugger;
        this.strength = cc.dataMgr.getDragonStrength(thingLevel);
        this.settingSpriteFrame(this.thingType, this.thingLevel);


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

        this.ui.addDescForClick(this.thingType, this.thingLevel, this.strength);
    },

    unBrowseThisThing: function () {
        //console.log('不再浏览该物体！');
        //this.ui.clearDescForUnClick();
    },

    //判断当前范围内的可合并龙集合 和上次的龙集合元素是否完全相同
    curAndLastUnionedDragonsIsSame: function () {
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