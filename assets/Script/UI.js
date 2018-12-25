cc.Class({
    extends: cc.Component,

    properties: {
        coinLabel: {
            default: null,
            type: cc.Label
        },
        heartLabel: {
            default: null,
            type: cc.Label
        },
        diamondLabel: {
            default: null,
            type: cc.Label
        },

        collectionThingPrefab: {
            default: null,
            type: cc.Prefab,
        },


        dragonPrefab: {
            default: null,
            type: cc.Prefab,
        },

        nameLevelLabel: {
            default: null,
            type: cc.Label
        },

        nameLevelLabel: {
            default: null,
            type: cc.Label
        },

        descLabel: {
            default: null,
            type: cc.Label
        },

        unDescNode: {
            default: null,
            type: cc.Node
        },
        descNode: {
            default: null,
            type: cc.Node
        },

        dragonNestNode: {
            default: null,
            type: cc.Node
        },

        //图鉴按钮 node 用于控制是否显示 在是否点击物品的情况下
        tujianBtnNode: {
            default: null,
            type: cc.Node
        },

        tujianLayer: {
            default: null,
            type: cc.Node
        },

        tujianFlower: {
            default: null,
            type: cc.Node
        },

        tujianHeart: {
            default: null,
            type: cc.Node
        },

        tujianDragon: {
            default: null,
            type: cc.Node
        },

        dragonCountLabel:{
            default:null,
            type:cc.Label
        },

        countDownLabel:{
            default:null,
            type:cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas

    },

    // use this for initialization
    onLoad: function () {

        this.refreshUI();
        let self = this;
        this.descNode.active = true;
        this.unDescNode.active = false;

    },

    refreshUI: function () {
        this.coinLabel.string = cc.dataMgr.getCoinCount();
        this.heartLabel.string = cc.dataMgr.getHeartCount();
        this.diamondLabel.string = cc.dataMgr.getDiamondCount();
    },

    start: function () {
        this.game = cc.find("Canvas").getComponent('Game');
        if(cc.dataMgr.dragonNestDatas.length>0) {
            this.dragonNestNode.getComponent('nest').nestInOver();
        }
        this.schedule(this.refreshDragonNestInfo, 1);
    },

    refreshDragonNestInfo:function() {
        //console.log("-----每秒 刷新龙巢");
        var len = cc.dataMgr.dragonNestDatas.length;
        this.dragonCountLabel.string = len;

        if(len <1) {
            this.countDownLabel.node.active = false;
            this.dragonCountLabel.node.active =false;
            this.dragonNestNode.getComponent('nest').noDragonAni();
        } else {
            this.countDownLabel.node.active = true;
            this.dragonCountLabel.node.active = true;
            var totleSecond = cc.dataMgr.getCurrentDragonCountDown();
            if(totleSecond<1) {
                console.log("龙出巢逻辑！！todo");
                this.dragonMoveOutNest();
            }

            this.setTimeToLabel(totleSecond, this.countDownLabel);
        }
    },

    dragonMoveOutNest:function() {
        var outDragonData = cc.dataMgr.dequeueDragonNest();
        console.log(outDragonData);

     

        var dragonNode = cc.instantiate(this.dragonPrefab);
        dragonNode.getComponent('Dragon').setTypeAndLevel_forNewDragon(3, outDragonData.level);
        var dragonsNode = cc.find("Canvas/gameLayer/dragonsNode");
        dragonsNode.addChild(dragonNode);
        var camerapos = this.dragonNestNode.parent.convertToWorldSpaceAR(this.dragonNestNode.position);
        //debugger;
        var worldpos = cc.v2(camerapos.x + this.game.camera.position.x, camerapos.y + this.game.camera.position.y);
        var nodepos = dragonsNode.convertToNodeSpaceAR(worldpos);
        dragonNode.position = nodepos;
       
        dragonNode.scale = 0.0;




        var targetPos = cc.v2(360,640);
        var targetWorldpos = cc.v2(targetPos.x + this.game.camera.position.x, targetPos.y + this.game.camera.position.y);
        var targetNodepos = dragonsNode.convertToNodeSpaceAR(targetWorldpos);
        var action = cc.moveTo(2.0, targetNodepos);
        var action2 = cc.scaleTo(2.0, 1);
        var together = cc.spawn(action, action2);
        var seq = cc.sequence(together, cc.callFunc(this.dragonMoveOutNestOver, this, dragonNode));
        dragonNode.runAction(seq);

    },

    dragonMoveOutNestOver:function(dragonNode) {
       
        // dragonNode.removeFromParent(false);
        // var dragonsNode = cc.find("Canvas/gameLayer/dragonsNode");
        // var pos =  dragonsNode.convertToNodeSpaceAR(dragonNode.position);
        // dragonsNode.addChild(dragonNode);
        // dragonNode.position = pos;
    },

    setTimeToLabel: function (dx, label) {
        if(dx<0) { //负的
            label.string = "";
            return;
        }
        //dx-->29分54秒
        let m = parseInt(dx / 60);
        let s = parseInt(dx - (60 * m));

        // label.string = m + "分" + s + "秒";
        label.string = m + ":" + s;
    },

    //图鉴按钮被点击
    tujianClick: function () {
        console.log("图鉴按钮点击了！");
        this.tujianLayer.active = true;
        if (this.thingType == 1) {
            this.tujianHeart.active = true;

            this.tujianDragon.active = false;
            this.tujianFlower.active = false;
        } else if (this.thingType == 2) {
            this.tujianFlower.active = true;

            this.tujianDragon.active = false;
            this.tujianHeart.active = false;
        } else if (this.thingType == 3) {
            this.tujianDragon.active = true;

            this.tujianHeart.active = false;
            this.tujianFlower.active = false;
        } else {
            debugger;
        }
    },

    tujianCloseClick: function () {
        this.tujianLayer.active = false;
    },

    addHeartAndAni: function (camerapos, level) {

        var nodepos = this.node.convertToNodeSpaceAR(camerapos);
        var collectionThingNode = cc.instantiate(this.collectionThingPrefab);
        this.node.addChild(collectionThingNode);
        collectionThingNode.position = nodepos;
        collectionThingNode.getComponent('thingImageAndAni').settingSpriteFrame(1, level);

        var targetPos = cc.pAdd(this.heartLabel.node.parent.position, cc.v2(70, 0));
        var action = cc.moveTo(1.0, targetPos);
        var action2 = cc.fadeOut(1.0);
        var together = cc.spawn(action, action2);
        var seq = cc.sequence(together, cc.callFunc(this.moveToLabelOver, this, collectionThingNode));
        collectionThingNode.runAction(seq);

        var heartStrength = cc.dataMgr.getHeartCountByLevel(level);
        cc.dataMgr.addHeartCount(heartStrength);
    },

    addDragonToNest: function (camerapos, level) {
        var nodepos = this.node.convertToNodeSpaceAR(camerapos);

        var dragonNode = cc.instantiate(this.dragonPrefab);
        dragonNode.scaleX = -1;
        this.node.addChild(dragonNode);
        dragonNode.position = nodepos;
        dragonNode.getComponent('Dragon').setTypeAndLevel_forNewDragon(3, level);
     
        var targetPos = this.dragonNestNode.position;
        var action = cc.moveTo(2.0, targetPos);
        var action2 = cc.scaleTo(2.0, -0.5,0.5);
        var together = cc.spawn(action, action2);
        var seq = cc.sequence(together, cc.callFunc(this.moveToDragonNestOver, this, dragonNode));
        dragonNode.runAction(seq);

        cc.dataMgr.pushDragonToNest(Date.now(), level);
    },

    moveToDragonNestOver: function (dragonNode) {
        this.dragonNestNode.getComponent(cc.Animation).play('nestin');
        dragonNode.destroy();
    },


    moveToLabelOver: function (collectionThingNode) {
        this.refreshUI();
    },


    //strength 用于显示龙 剩余的体力
    addDescForClick: function (thingType, thingLevel, strength) {
        //根据这个值 来处理 图鉴按钮被点击
        this.thingType = thingType;
        var descDatas = cc.dataMgr.getDescByTypeAndLevel(thingType, thingLevel);

        this.tujianBtnNode.active = true;
        //debugger;
        this.nameLevelLabel.string = descDatas.name + "-" + descDatas.levelDesc;
        if (thingType == 3 && thingLevel > 0) {
            this.descLabel.string = descDatas.desc + "  " + "剩余体力：" + strength;
        } else {
            this.descLabel.string = descDatas.desc;
        }

    },



    clearDescForUnClick: function () {
        this.nameLevelLabel.string = "未选中任何东西";
        this.descLabel.string = "";

        this.tujianBtnNode.active = false;
    },

    unDescClick: function () {
        console.log("unDescClick");
        this.descNode.active = true;
        this.unDescNode.active = false;
    },

    descClick: function () {
        console.log("descClick");
        this.descNode.active = false;
        this.unDescNode.active = true;
    },

    // called every frame
    update: function (dt) {

    },
});
