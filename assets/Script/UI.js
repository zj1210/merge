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

    addHeartAndAni:function(worldpos,level) {
        console.log(worldpos);
        console.log(level);
        debugger;
    },

    // called every frame
    update: function (dt) {

    },
});
