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

        nameLevelLabel:{
            default:null,
            type:cc.Label
        },

        nameLevelLabel:{
            default:null,
            type:cc.Label
        },

        descLabel:{
            default:null,
            type:cc.Label
        }
        // defaults, set visually when attaching this script to the Canvas

    },

    // use this for initialization
    onLoad: function () {

        this.refreshUI();
        let self = this;
        
    },

    refreshUI: function () {
        this.coinLabel.string = cc.dataMgr.getCoinCount();
        this.heartLabel.string = cc.dataMgr.getHeartCount();
        this.diamondLabel.string = cc.dataMgr.getDiamondCount();
    },

    start: function () {

    },

    addHeartAndAni:function(camerapos,level) {
        // console.log(camerapos);
        // console.log(level);
        var nodepos = this.node.convertToNodeSpaceAR(camerapos);
        var collectionThingNode = cc.instantiate(this.collectionThingPrefab);
        this.node.addChild(collectionThingNode);
        collectionThingNode.position = nodepos;
        collectionThingNode.getComponent('thingImageAndAni').settingSpriteFrame(1,level);
       
        var targetPos = cc.pAdd(this.heartLabel.node.parent.position , cc.v2(70,0));
        var action = cc.moveTo(1.0,targetPos);
        var action2 = cc.fadeOut(1.0);
        var together = cc.spawn(action,action2);
        var seq = cc.sequence(together,cc.callFunc(this.moveToLabelOver,this,collectionThingNode));
        collectionThingNode.runAction(seq);

        var heartStrength = cc.dataMgr.getHeartCountByLevel(level);
        cc.dataMgr.addHeartCount(heartStrength);
        //debugger;
    },

    moveToLabelOver:function(collectionThingNode) {
        //console.log(collectionThingNode);
        this.refreshUI();
    },


    //strength 用于显示龙 剩余的体力
    addDescForClick:function(thingType,thingLevel,strength) {
        var descDatas = cc.dataMgr.getDescByTypeAndLevel(thingType,thingLevel);
        //debugger;
        this.nameLevelLabel.string = descDatas.name + "-" + descDatas.levelDesc;
        if(thingType == 3 && thingLevel>0) {
            this.descLabel.string = descDatas.desc + "  " + "剩余体力：" + strength;
        } else {
            this.descLabel.string = descDatas.desc;
        }
        
    },

    clearDescForUnClick:function() {
        this.nameLevelLabel.string = "未选中任何东西";
        this.descLabel.string = "";
    },

    // called every frame
    update: function (dt) {

    },
});
