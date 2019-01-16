
cc.Class({
    extends: cc.Component,

    properties: {

        targetLabel: {
            default: null,
            type: cc.Label
        },

        rewardLabel: {
            default: null,
            type: cc.Label
        },

        timeLabel: {
            default: null,
            type: cc.Label
        },


    },

    onLoad: function () {


    },


    start: function () {
        this.game = cc.find("Canvas").getComponent('Game');
        this.ui = cc.find("Canvas/uiLayer").getComponent('UI');
    },


    checkpointClick: function (event, userData) {
        // console.log("checkpointClick Click!");
        // cc.audioMgr.playEffect("btn_click");

        // console.log(userData);

        // cc.audioMgr.playEffect("UI");


        // //1，先播放一个动画，在动画的过程中删除 现存的 游戏地图
        // //2,加载一个新的地图，开始游戏
        // //首先要把主基地数据存起来
        // cc.dataMgr.saveGameData();

        // this.ui.inCheckpointCompatible();
        // //删除主基地
        // //加载关卡内容
        // this.game.clearGame();
        // this.game.loadGame(userData);

        // this.node.active = false;
    },

    onDisable:function() {
        console.log("check point onDisable~~");
    },

    onEnable:function() {
        console.log("check point onEnable~~");

        this.targetLabel.string = "目标:" +cc.dataMgr.getDescByTarget(cc.dataMgr.checkpointDatas[this.curCheckpoint - 1].target);
        this.timeLabel.string = "时间:" + cc.dataMgr.checkpointDatas[this.curCheckpoint - 1].time;
        this.rewardLabel.string = "奖励:" + cc.dataMgr.checkpointDatas[this.curCheckpoint - 1].first_Reward + "金币";
    },


    setCurCheckpoint:function(curCheckpoint) {
        this.curCheckpoint = curCheckpoint;
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