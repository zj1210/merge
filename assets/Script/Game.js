







cc.Class({
    extends: cc.Component,

    properties: {
        camera: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {

        if (!cc.dataMgr) {
            cc.dataMgr = new DataMgr();
        }

    },

    start: function () {
        let self = this;
        //只专注于移动摄像机，其它的触摸由各自节点接收并吞没
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log('touch begin by game');
            let touchPos = event.getLocation();
            //console.log(touchPos);
            self._beginPos = touchPos;


        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if (self._beginPos) {
                console.log('touch move by game');
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
    }
});