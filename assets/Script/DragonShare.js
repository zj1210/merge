
cc.Class({
    extends: cc.Component,

    properties: {


    },

    onLoad: function () {

      
    },

   
    treasureChestClick: function () {
        console.log("treasureChest Click!");
        cc.audioMgr.playEffect("btn_click");

        var curCoinCount = cc.dataMgr.getCoinCount();
        var goodsPrice = parseInt(this.treasureChestLabel.string);
        if (curCoinCount >= goodsPrice) {
            var gameJS = cc.find("Canvas").getComponent('Game');
            var tile = gameJS.getTile();
            if (tile) {

                this.purchaseSuccessLogic(goodsPrice, tile, "treasureChest");
            } else {
                this.shopTipsFadeIn("没有格子,购买失败!");
            }
        } else {
            //金币不够
            this.shopTipsFadeIn("金币不足!");
        }
    },

  

    closeClick: function () {
        console.log("close click!");
        cc.audioMgr.playEffect("UI");
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