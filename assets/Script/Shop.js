
cc.Class({
    extends: cc.Component,

    properties: {



        // defaults, set visually when attaching this script to the Canvas
        // zzz:{
        //     default:null,
        //     type:cc.Node
        // },

        treasureChestLabel: {
            default: null,
            type: cc.Label
        },

        dragonEggLabel: {
            default: null,
            type: cc.Label
        },

        shopTipsLabel:{
            default:null,
            type:cc.Label
        }

    },

    onLoad: function () {

        this.shopTipsLabel.node.active = false;
      
        for(var i = 0; i<cc.dataMgr.shopDatas.length; i++) {
            if(cc.dataMgr.shopDatas[i].name == "treasureChest") {
                this.treasureChestLabel.string = cc.dataMgr.shopDatas[i].price;
            } else if(cc.dataMgr.shopDatas[i].name == "dragonEgg") {
                this.dragonEggLabel.string = cc.dataMgr.shopDatas[i].price;
            }
        }
    },

    /**
     * 商城逻辑
     */
    //1获得 用户当前金币数
    //2 比较是否大于 此物品价格，若大于，
    //3 搜寻是否有空格，若有 购买成功，放入搜寻的空格中
    //4 若小于， 提示：金币不足
    //5 金币够，没空格  提示：没有空格放置物品！
    /**
     * 不管任何购买，首先要判断的逻辑是 金币是否足够？
     * 若足够，棋盘上是否有空格？
     * 只有过了这两个判断，才可购买
     */
    treasureChestClick: function () {
        console.log("treasureChest Click!");
        var curCoinCount = cc.dataMgr.getCoinCount();
        var goodsPrice = parseInt(this.treasureChestLabel.string);
        if(curCoinCount >= goodsPrice) {
            var tile = this.getTile();
            if(tile) {
        
                this.purchaseSuccessLogic(goodsPrice,tile,"treasureChest");
            } else {
                this.shopTipsFadeIn("没有位置放置物品，购买失败!");
            }
        } else {
            //金币不够
            this.shopTipsFadeIn("金币不足!");
        }
    },

    getTile:function() {
        var gameJS = cc.find("Canvas").getComponent('Game');
        var resultTiles = gameJS.getNearestTileByN_pos(cc.v2(0,0), 1);
        if (resultTiles != null) {
            return resultTiles[0];
        } else {
            return null;
        }
    },

    //1 扣钱
    //2 生成与放置
    //3 提示购买成功
    //参数： 扣除多少钱，放入哪个tile，tile中放入什么东西
    purchaseSuccessLogic:function(amountDeducted,tile,thingName) {
        cc.dataMgr.addCoinCount(-amountDeducted);

        var gameJS = cc.find("Canvas").getComponent('Game');
        gameJS.generateAndPutThing(tile,thingName);
        //刷新ui
        var uiJS =cc.find("Canvas/uiLayer").getComponent('UI');
        uiJS.refreshUI();
        this.shopTipsFadeIn("购买成功,已放入领地!");
    },

    shopTipsFadeIn:function(strContent) {
        console.log(strContent);
    },

    dragonEggClick: function () {
        console.log("dragonEgg Click!");
    },

    closeClick: function () {
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