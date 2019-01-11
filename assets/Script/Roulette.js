
cc.Class({
    extends: cc.Component,

    properties: {



        // defaults, set visually when attaching this script to the Canvas
        // zzz:{
        //     default:null,
        //     type:cc.Node
        // },

        //包含 签到label 和按钮
        // signLabelBtn: {
        //     default: null,
        //     type: cc.Node
        // },

        sprites: {
            default: [],
            type: cc.Sprite
        },

        heart_Spfs: {
            default: [],
            type: cc.SpriteFrame
        },

        flower_Spfs: {
            default: [],
            type: cc.SpriteFrame
        },

        dragon_Spfs: {
            default: [],
            type: cc.SpriteFrame
        },

        box_Spfs: {
            default: [],
            type: cc.SpriteFrame
        },

        coin_Spfs: {
            default: [],
            type: cc.SpriteFrame
        },

        // //7个红框
        // redFrames: {
        //     default: [],
        //     type: cc.Node
        // },
        // //7个对勾
        // checkMarks: {
        //     default: [],
        //     type: cc.Node
        // },

        rouletteTipsLabel: {
            default: null,
            type: cc.Label
        },

        wheelSp: {
            default: null,
            type: cc.Node
        },

    },

    onLoad: function () {
        this.data = cc.dataMgr.rouletteDatas;
        //根据数据，将7个物品的图片换了 //也可能是6个 具体是将来的转盘界面
        //目前还没有界面
        //必须从1开始 0位置是为了概率算法的计算做的占位符
        for (var i = 1; i < this.data.length; i++) {
            var resultSpriteFrame = this.getSpriteFrameByData(this.data[i].reward, this.data[i].level);
            this.sprites[i-1].spriteFrame = resultSpriteFrame;
        }

        //转盘需要的数值
        //加速 和减速的迭代次数
        this.accelerateTime = 3 * 60; 
        this.slowDownTime = this.accelerateTime;

        //加速和减速的总旋转长度
        //这里的4 其实可以做成随机数，更丰富
        this.accAngle = 4 * 360;
        this.decAngle = this.accAngle;
        this.wheelState = 0; //0静止 1加速旋转，2减速旋转
        //当前时刻的速度，用于每帧改变转盘角度
        this.curSpeed = 0;
       
        this.wheelSp.rotation = 0; //用户每次进来都应该是这个角度
        this.finalAngle = 0;                   //最终旋转的角度

        /**
         * 随到的物品的数据结构
         *  {
            "reward": "flower",
            "level": 3,
            "probability": 0.6,
            "count": 1,
            "index":1
        },

         */
        this.result = null;


        //cc.dataMgr.shareState = cc.dataMgr.ShareState.DANDELION_COUNT;
        

    },

    start() {
        let self = this;
        var cnvs = cc.find("Canvas");
        var node_Tips = cnvs.getChildByName("node_Tips");
        
        window.Notification.on(cc.dataMgr.ShareState.ROULETTE_GO, function (parameter) {
            console.log("分享回调");
            console.log(parameter);
            if(parameter == true) {
                node_Tips.getChildByName("shareSuccessLabel").getComponent(cc.Animation).play("shareSuccess");
                self.goRoulette();
            } else {
                node_Tips.getChildByName("shareFailLabel").getComponent(cc.Animation).play("shareFail");
                console.log("分享失败");
            }
           
        });
    },

    getSpriteFrameByData: function (reward, level) {
        switch (reward) {
            case "flower":
                return this.flower_Spfs[level];

            case "heart":

                return this.heart_Spfs[level];
            case "coin":


                return this.coin_Spfs[level];
            case "draggon":

                return this.dragon_Spfs[level];
            case "treasureChest":

                return this.box_Spfs[level];

            default:
                debugger;
                break;
        }
    },

    onEnable: function () {
        //console.log("onEable by signIn");
        //分3步
        //1，读取 数据表 进行资源替换 //这步可以移入onload中
        //2, 读取当前进度，界面状态设置，哪些有对号，哪些没有
        //3, 设置签到按钮，根据上次签到和当前日期是否一样 来设置
        //this.refreashUI();

      
    },

    shareClick:function() {
        cc.audioMgr.playEffect("UI");
        cc.dataMgr.shareState = cc.dataMgr.ShareState.ROULETTE_GO;
        cc.dataMgr.share();
    },

    goRoulette: function () {
        //状态非0点了也没反应
        if (this.wheelState !== 0) {
            return;
        }
        cc.audioMgr.playEffect("UI");
        //this.AdBtn.interactable = false;

        //将当前的 加速次数 与减速次数 置为0 
        this.accCount = 0;
        this.decCount = 0;

        this.wheelState = 1; //开始旋转 update 会自动判断   



        this.result = cc.dataMgr.randomRoulette();

        this.targetID = this.result.index;
        //console.log("最终结果应为 targetID == ", this.targetID);
        //为了让滚轮可以再次点击滚动，需要改变几个量，注：现在没这些需求
        //加入一个初始的角度 
        let beginAngle = this.wheelSp.rotation;
        //先计算回滚原点的角度 即：-beginAngle 然后加上需要旋转到的角度
        let resultTemp = - beginAngle + 360 - this.targetID * 60;
        this.finalAngle = resultTemp + this.accAngle + this.decAngle;
        
        //a+2a+...+na+(n-1)a+....+a = n^2 * a;
        this.accV = this.finalAngle / (this.accelerateTime * this.accelerateTime);
    },

    giveReward:function() {
        console.log("give reward~~~~");
        console.log(this.result);
        
        var rewardData = this.result;
        var gameJS = cc.find("Canvas").getComponent('Game');
        if (rewardData.reward == "draggon" && rewardData.level > 0) {
            //飞龙
            gameJS.addDragonToGame(3,rewardData.level);
        } else if (rewardData.reward == "coin") {
            //金币
            cc.dataMgr.addCoinCount(rewardData.count);
            cc.find("Canvas/uiLayer").getComponent('UI').refreshUI();
        } else {
            //放入格子的拖动物
            var tile = gameJS.getTile();
            if (tile) {
                gameJS.generateAndPutThing_signIn(tile, rewardData.reward,rewardData.level);
            } else {
               //没有格子，玩家没有领取到
               
            //    this.signInTipsFadeIn("没有位置放置物品，领取失败!");
            //     //不改变数据，玩家可再次点击
            //     return;
            }
        }

        this.rouletteTipsFadeIn("奖品已发放!");
    },


    refreashUI: function () {
        
    },



    closeClick: function () {
        // console.log("close click!");
        cc.audioMgr.playEffect("UI");
        this.node.active = false;
    },



    rouletteTipsFadeIn: function (strContent) {
        //console.log(strContent);
        this.rouletteTipsLabel.string = strContent;
        this.rouletteTipsLabel.node.getComponent(cc.Animation).play("shopTips");
    },



    update: function (dt) {

        if (this.wheelState === 0) {
            return;
        }
        else if (this.wheelState == 1) {
            if (this.accCount < this.accelerateTime) { //如果小于给定持续时间，就更新一次
                this.accCount++;
                this.curSpeed += this.accV;
                this.wheelSp.rotation = this.wheelSp.rotation + this.curSpeed;
            } else { //达到了更新时间
                this.wheelState = 2;//进入减速状态
            }
        }
        else if (this.wheelState == 2) {
            //根据加速计算当前速度，以及当前位置
            if (this.decCount < this.slowDownTime) {
                this.decCount++;
                this.curSpeed -= this.accV;
                this.wheelSp.rotation = this.wheelSp.rotation + this.curSpeed;
            } else {
                this.wheelState = 0;
            
                this.wheelSp.rotation = Math.ceil(this.wheelSp.rotation) % 360;
                
                // console.log("转盘停止，给玩家发放奖励");
                this.giveReward();
            }
        }
    },
});