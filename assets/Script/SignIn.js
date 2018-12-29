
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

        //7个红框
        redFrames: {
            default: [],
            type: cc.Node
        },
        //7个对勾
        checkMarks: {
            default: [],
            type: cc.Node
        },

    },

    onLoad: function () {
        this.data = cc.dataMgr.signInRewardData;
        //根据数据，将7个物品的图片换了
        for (var i = 0; i < this.data.length; i++) {
            var resultSpriteFrame = this.getSpriteFrameByData(this.data[i].reward, this.data[i].level);
            this.sprites[i].spriteFrame = resultSpriteFrame;
        }
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
        var p = cc.dataMgr.getSignInProgress();
        for (var i = 0; i < this.data.length; i++) {
            if (i < p) {
                this.redFrames[i].active = true;
                this.checkMarks[i].active = true;
            } else if (i == p) {
                this.redFrames[i].active = true;
                this.checkMarks[i].active = false;
            } else {
                this.redFrames[i].active = false;
                this.checkMarks[i].active = false;
            }
        }
        var date = new Date();
        var curDate = date.getFullYear() + "" + date.getMonth() + date.getDate();
        var lastDate = cc.dataMgr.getLastSignInDate();
        if (curDate != lastDate) {
            this.signLabelBtn.getComponent(cc.Button).interactable = true;
            this.signLabelBtn.getComponent(cc.Label).string = "点此签到";
        } else {
            this.signLabelBtn.getComponent(cc.Button).interactable = false;
            this.signLabelBtn.getComponent(cc.Label).string = "今日已签";
        }
    },

    // onDisable:function() {
    //     console.log("onDisable by signIn")
    // },

    signInClick: function () {
        cc.audioMgr.playEffect("btn_click");
        cc.dataMgr.addSignInProgress();
        var date = new Date();
        var curDate = date.getFullYear() + "" + date.getMonth() + date.getDate();
        cc.dataMgr.setLastSignInDate(curDate);
        //给奖励 : todo
        
        //改按钮
        this.signLabelBtn.getComponent(cc.Button).interactable = false;
        this.signLabelBtn.getComponent(cc.Label).string = "今日已签";
    },

    closeClick: function () {
        console.log("close click!");
        cc.audioMgr.playEffect("UI");
        this.node.active = false;
    }



});