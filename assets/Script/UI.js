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

    // called every frame
    update: function (dt) {

    },
});
