
cc.Class({
    extends: cc.Component,

    properties: {


        fog: {
            default: null,
            type: cc.Node
        },
        box:{
            default: null,
            type:cc.Node
        },

        box_0_spr: {
            default: null,
            type: cc.SpriteFrame
        },

        box_1_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        box_2_spr: {
            default: null,
            type: cc.SpriteFrame
        },

        reLockLabel:{
            default:null,
            type:cc.Label
        }
        // defaults, set visually when attaching this script to the Canvas

    },

    boxClick:function() {
        console.log('宝箱被点击了！');
    },

    fogClick:function() {
        console.log('fog被点击了！');

        var heartCount = cc.dataMgr.getHeartCount();
        if(heartCount>this.fogAmount) {
            //心够，将来可能是弹窗
            //解锁雾 可以在动画回调里设置
            cc.dataMgr.addHeartCount(-this.fogAmount);
            cc.find("Canvas/uiLayer").getComponent('UI').refreshUI();
            this.fogState = 1;
            this.settingState(1);
        } else {
            console.log("心不够啊！");
        }
    },

    settingFog:function(fogState,fogAmount) {
       
        this.fogAmount = fogAmount;
        this.settingState(fogState);
    },

    settingState:function(fogState) {
        this.fogState = fogState;
        if(this.fogState == 0) {
            this.reLockLabel.string = this.fogAmount + "精华解锁";
            this.box.active = false;
        } else if(this.fogState == 1) {
            this.reLockLabel.node.active = false;
            this.fog.active =false;
            this.box.active = true;
        } else {
            console.log("未知 fogState " +fogState);
            debugger;
        }
    }
   
});