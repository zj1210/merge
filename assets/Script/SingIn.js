
cc.Class({
    extends: cc.Component,

    properties: {



        // defaults, set visually when attaching this script to the Canvas
        // zzz:{
        //     default:null,
        //     type:cc.Node
        // },

        //包含 签到label 和按钮
        signLabelBtn: {
            default: null,
            type: cc.Node
        },

        
    },

    onLoad: function () {

       
    },

    signInClick:function() {
        cc.audioMgr.playEffect("btn_click");

    },

    closeClick: function () {
        console.log("close click!");
        cc.audioMgr.playEffect("UI");
        this.node.active = false;
    }



});