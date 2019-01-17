
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

   
    shareClick:function() {
        cc.audioMgr.playEffect("UI");
        cc.dataMgr.shareState = cc.dataMgr.ShareState.DRAGON_OUT;
        cc.dataMgr.share();
    },


  

    closeClick: function () {
        console.log("close click!");
        cc.audioMgr.playEffect("UI");
        this.node.active = false;
    }

  



});