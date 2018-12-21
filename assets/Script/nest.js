
cc.Class({
    extends: cc.Component,

    properties: {


       
        // defaults, set visually when attaching this script to the Canvas
        zzz:{
            default:null,
            type:cc.Node
        },

        dragonCountLabel:{
            default:null,
            type:cc.Label
        }
    },

    onLoad: function () {

        //cc.dataMgr.

    },

    nestInOver:function() {
        console.log("nestInOver");
        this.zzz.active = true;
        this.node.getComponent(cc.Animation).play('nestzzz');
    },

   
});