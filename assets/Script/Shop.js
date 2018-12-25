
cc.Class({
    extends: cc.Component,

    properties: {


       
        // defaults, set visually when attaching this script to the Canvas
        // zzz:{
        //     default:null,
        //     type:cc.Node
        // },

        treasureChestLabel:{
            default:null,
            type:cc.Label
        },

        dragonEggLabel:{
            default:null,
            type:cc.Label
        },

    },

    onLoad: function () {

        //cc.dataMgr.
        
    },

    /**
     * 不管任何购买，首先要判断的逻辑是 钻石或者金币是否足够？
     * 若足够，棋盘上是否有空格？
     * 只有过了这两个判断，才可购买
     */
    treasureChestClick:function() {
        console.log("treasureChest Click!");
    },

    dragonEggClick:function() {
        console.log("dragonEgg Click!");
    },

    closeClick:function() {
        console.log("close click!");
        this.node.active = false;
    }

    // nestInOver:function() {
    //     console.log("nestInOver");
    //     this.zzz.active = true;
    //     this.node.getComponent(cc.Animation).play('nestzzz');
    // },

    // noDragonAni:function() {
    //     this.zzz.active = false;
    //     this.node.getComponent(cc.Animation).stop('nestzzz');
    // }
    

   
});