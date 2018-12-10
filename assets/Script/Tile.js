cc.Class({
    extends: cc.Component,
    //195 45 的间隔排列的块
    properties: {

        tileType: {
            default: 0,
            displayName: "是绿地还是雾",
            tooltip: "0标记着是绿地块，1标记着是雾",
        },

        skinType: {
            default: 0,
            displayName: "地皮是深绿还是浅绿",
            tooltip: "0标记着是深绿，1标记着是浅绿",
        },

        thingType: {
            default: 0,
            displayName: "没有，精华，花，龙",
            tooltip: "0=没有，1=精华，2=花，3=龙",
        },

        thingLevel: {
            default: 0,
            displayName: "物品的级别",
            tooltip: "0初始，1升一级，以此类推，注意：蒲公英是花级别为0",
        },

    },

    // use this for initialization
    onLoad: function () {

    },

    start: function () {

    },

    // called every frame
    update: function (dt) {

    },
});
