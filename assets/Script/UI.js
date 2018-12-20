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
        }
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
        this.node.addChild(dragonNode);
        dragonNode.position = nodepos;
        dragonNode.getComponent('Dragon').setTypeAndLevel_forNewDragon(3, level);
        dragonNode.remove
        var targetPos = this.dragonNestNode.position;
        var action = cc.moveTo(2.0, targetPos);
        var action2 = cc.scaleTo(2.0, 0.5);
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
        var descDatas = cc.dataMgr.getDescByTypeAndLevel(thingType, thingLevel);
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
