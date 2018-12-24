
cc.Class({
    extends: cc.Component,

    properties: {


       
        // defaults, set visually when attaching this script to the Canvas
        zzz:{
            default:null,
            type:cc.Node
        },

       
    },

    onLoad: function () {

        //cc.dataMgr.

    },

    nestInOver:function() {
        console.log("nestInOver");
        this.zzz.active = true;
        this.node.getComponent(cc.Animation).play('nestzzz');
    },

    noDragonAni:function() {
        this.zzz.active = false;
        this.node.getComponent(cc.Animation).stop('nestzzz');
    }
    

   
});