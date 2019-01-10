
cc.Class({
    extends: cc.Component,

    properties: {


    },

    onLoad: function () {

      
    },

    start:function() {
        let self = this;
        var cnvs = cc.find("Canvas");
        var node_Tips = cnvs.getChildByName("node_Tips");
        
        window.Notification.on(cc.dataMgr.ShareState.DRAGON_OUT, function (parameter) {
            console.log("分享回调");
            console.log(parameter);
            if(parameter == true) {
                node_Tips.getChildByName("shareSuccessLabel").getComponent(cc.Animation).play("shareSuccess");
                
                //让一条龙出巢
                var len = cc.dataMgr.dragonNestDatas.length;
                if(len<1) {

                }
                //有龙
                else {
                    cc.dataMgr.setCurrentDragonWakeUpTime();
                }

                self.node.active = false;

            } else {
                node_Tips.getChildByName("shareFailLabel").getComponent(cc.Animation).play("shareFail");
                console.log("分享失败");
            }
           
        });
    },

    onEnable() {
        console.log("dragon share onEnable!");
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