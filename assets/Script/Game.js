cc.Class({
    extends: cc.Component,

    properties: {
        camera: {
            default: null,
            type: cc.Node
        },

        // tilesHorizontalCount: {
        //     default: 0,
        //     displayName: "当前图的水平格子数",
        //     tooltip: "包括雾，以及空白的格子",
        // },

        // tileVerticalCount: {
        //     default: 0,
        //     displayName: "当前图的垂直格子数",
        //     tooltip: "包括雾，以及空白的格子",
        // },
    },

    // use this for initialization
    onLoad: function () {
        //console.log("game onload!");
        // this.tilesHorizontalCount = 6;
        // this.tileVerticalCount = 3;
        if (!cc.dataMgr) {
            cc.dataMgr = new DataMgr();
        }
        //初始化最好写在start里面，我在别的地方有onload来初始化 Game里面的一些数据 比如tile里的onload

    },

    start: function () {
        /**
         * 初始化块的数据结构,0标记的是大厅数据
         */
        cc.dataMgr.initTile(0, this.node.getChildByName('gameLayer').getChildByName('mapNode').children);

        let self = this;
        //只专注于移动摄像机，其它的触摸由各自节点接收并吞没
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            //console.log('touch begin by game');
            let touchPos = event.getLocation();
            //console.log(touchPos);
            self._beginPos = touchPos;


        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if (self._beginPos) {
                //console.log('touch move by game');
                let movePos = event.getLocation();
                let addX = movePos.x - self._beginPos.x;
                let addY = movePos.y - self._beginPos.y;

                //移动相机

                let addPos = self.getAddPosition_v2(-addX, -addY)
                self.camera.setPosition(cc.v2(self.camera.x + addPos.x, self.camera.y + addPos.y));
                self._beginPos = movePos;


                //和 小猫互动
                // if (cc.dataMgr.userData.onTouchCat) {
                //     //这里是在和小猫互动
                //     let disPos = cc.v2(addX, addY);
                //     if (disPos.mag() > 10) {
                //         self._beginPos = movePos
                //         self.addTouchEffect();
                //     }
                // } else
                //     self.refreshCatPoint();
            }

        }, this.node);
        // this.node.on(cc.Node.EventType.TOUCH_END, function (touch) {
        //     //没有和小猫互动的时候才会 隐藏菜单 和 满足这些条件才隐藏 pop
        //     if (!cc.dataMgr.userData.onTouchCat && cc.dataMgr.userData.leadStep != 10 && cc.dataMgr.userData.leadStep != 100) {
        //         if (!cc.dataMgr.userData.showCatTake && cc.dataMgr.userData.popType != "pop_catTake") {
        //             console.log("-- game touch end --");
        //             cc.dataMgr.userData.popType = null;
        //             self.showPop();
        //             cc.dataMgr.userData.touchCatName = null;
        //         }
        //     }
        // }, this.node);
        // this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (touch) {}, this.node);
    },

    // called every frame
    update: function (dt) {

    },


    //输入相机的 dx，dy，根据限制来加工处理，返回一份要求的dx，dy，防止移动出最大范围
    getAddPosition_v2: function (addX, addY) {
        // if (addX < -this._roomWidth / 2 + cc.dataMgr.canvasW / 2 - this.camera.x)
        //     addX = -this._roomWidth / 2 + cc.dataMgr.canvasW / 2 - this.camera.x;
        // if (addX > this._roomWidth / 2 - cc.dataMgr.canvasW / 2 - this.camera.x)
        //     addX = this._roomWidth / 2 - cc.dataMgr.canvasW / 2 - this.camera.x;
        // if (addY < -this._roomHeight / 2 + cc.dataMgr.canvasH / 2 - this.camera.y)
        //     addY = -this._roomHeight / 2 + cc.dataMgr.canvasH / 2 - this.camera.y;
        // if (addY > this._roomHeight / 2 - cc.dataMgr.canvasH / 2 - this.camera.y)
        //     addY = this._roomHeight / 2 - cc.dataMgr.canvasH / 2 - this.camera.y;
        return cc.v2(addX, addY);
    },

    getContainPointTile: function (worldPos) {

        //var touchPos = this.camera.getComponent(cc.Camera).getCameraToWorldPoint(touchPos);

        var hallTileHeight = cc.dataMgr.hallTileHeight,
            hallTileWidth = cc.dataMgr.hallTileWidth;
        for (var i = 0; i < hallTileHeight; i++) {
            for (var j = 0; j < hallTileWidth; j++) {
                var points = cc.dataMgr.tilesData[i][j].getComponent(cc.PolygonCollider).points;
                var worldpoints = this.getWorldPoints(cc.dataMgr.tilesData[i][j], points);
                // //console.log(worldpoints);
                // var test = cc.dataMgr.tilesData[i][j].parent.convertToWorldSpaceAR(cc.dataMgr.tilesData[i][j].position);
                // console.log(touchPos);
                // console.log(test);
                if (cc.Intersection.pointInPolygon(worldPos, worldpoints)) {
                    // console.log('包含改触摸点的tile');
                    //console.log(cc.dataMgr.tilesData[i][j].getBoundingBoxToWorld());
                    //console.log(cc.dataMgr.tilesData[i][j]);
                    return cc.dataMgr.tilesData[i][j];
                }
            }
        }
        return null;
    },

    getWorldPoints: function (node, points) {
        var worldPoints = [];
        for (var i = 0; i < points.length; i++) {
            worldPoints.push(node.convertToWorldSpaceAR(points[i]));
        }
        return worldPoints;
    },

    //以这个tile的tempthing为中心 查找出所有与其连通且同类型，同级别的thing数组
    findConnentedThing: function (tile) {
        var resultThings = [];

        var tileJS = tile.getComponent('Tile');
        var thisThing = tileJS.tempThing;
        var otherThing = tileJS.thing;

        resultThings.push(thisThing);
        var thisThingJS = thisThing.getChildByName('selectedNode').getComponent('Thing');
        //判断 格子内有没有别的thing，没有就不管了。若有还要判断是否一样
        if (otherThing) {
            //检查给此拖拽物同一个tile的物品的 是否和其相同，若相同加入
            
            var otherThingJS = otherThing.getChildByName('selectedNode').getComponent('Thing');
            if (this.IsThingSameTypeAndLevel(thisThingJS, otherThingJS)) {
                resultThings.push(otherThing);
            }
        }

        //这些原本也可以放入递归之中，但是我的数据结构比较麻烦，第一层先直接调用（第一层主要可能是两个节点）
        if (tileJS.index.x > 0) {
            this.checkConnectRecurse(tileJS.index.x - 1, tileJS.index.y, thisThingJS.thingType, thisThingJS.thingLevel, resultThings);
        }

        if (tileJS.index.x < cc.dataMgr.getCurrentWidthAndHeight().w - 1) {
            this.checkConnectRecurse(tileJS.index.x + 1, tileJS.index.y, thisThingJS.thingType, thisThingJS.thingLevel, resultThings);
        }

        if (tileJS.index.y > 0) {
            this.checkConnectRecurse(tileJS.index.x, tileJS.index.y - 1, thisThingJS.thingType, thisThingJS.thingLevel, resultThings);
        }

        if (tileJS.index.y < cc.dataMgr.getCurrentWidthAndHeight().h - 1) {
            this.checkConnectRecurse(tileJS.index.x, tileJS.index.y + 1, thisThingJS.thingType, thisThingJS.thingLevel, resultThings);
        }
        // console.log("-----查找连通算法结果------");
        // console.log(resultThings);
        return resultThings;
    },

    checkConnectRecurse: function (x, y, type, level, resultThings) {
        //先检测自己是否已经加入，是否是雾，是否有物体，是否很前面的一样  以上都通过，加入
        //是否已经加入
        var t = cc.dataMgr.tilesData[y][x];
        var tJS = t.getComponent('Tile');
        var compareThing = tJS.thing;
        //未知原因 块和脚本没有获得
        if (!t || !tJS) {
            debugger;
            return;
        }
        //是雾
        if (tJS.tileType == 1) {
            return;
        }
        //没有thing
        if (!compareThing) {
            return;
        }

        //已经加入
        if (this.isChecked(compareThing, resultThings)) {

            return;
        }

        //检测是否一样
        if (this.IsThingSameTypeAndLevel_2(compareThing.getChildByName('selectedNode').getComponent('Thing'), type, level)) {
            //一切通过，加入，递归检测它的上下左右
            resultThings.push(compareThing);

            if (tJS.index.x > 0) {
                this.checkConnectRecurse(tJS.index.x - 1, tJS.index.y, type, level, resultThings);
            }

            if (tJS.index.x < cc.dataMgr.getCurrentWidthAndHeight().w - 1) {
                this.checkConnectRecurse(tJS.index.x + 1, tJS.index.y, type, level, resultThings);
            }

            if (tJS.index.y > 0) {
                this.checkConnectRecurse(tJS.index.x, tJS.index.y - 1, type, level, resultThings);
            }

            if (tJS.index.y < cc.dataMgr.getCurrentWidthAndHeight().h - 1) {
                this.checkConnectRecurse(tJS.index.x, tJS.index.y + 1, type, level, resultThings);
            }

        } else { //不一样
            return;
        }
    },


    IsThingSameTypeAndLevel_2(thisThingJS, thingType, thingLevel) {
        if(!thisThingJS) {
            debugger;
        }
        return (thisThingJS.thingType == thingType) && (thisThingJS.thingLevel == thingLevel) ? true : false;
    },
    IsThingSameTypeAndLevel(thisThingJS, otherThingJS) {

        return (thisThingJS.thingType == otherThingJS.thingType) && (thisThingJS.thingLevel == otherThingJS.thingLevel) ? true : false;
    },


    isChecked: function (compareThing, resultThings) {

        for (var i = 0; i < resultThings.length; i++) {
            if (compareThing == resultThings[i]) {
                return true;
            }
        }
        return false;
    },

});