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
            displayName: "没有，精华，花，龙蛋",
            tooltip: "0=没有，1=精华，2=花，3=龙蛋",
        },

        thingLevel: {
            default: 0,
            displayName: "物品的级别",
            tooltip: "0初始，1升一级，以此类推，注意：蒲公英是花级别为0，如果是龙蛋，级别必须为0，龙不在地表上",
        },

        dontWant: {
            default: 0,
            displayName: "不想要这个块",
            tooltip: "0默认要这个块，除非特殊需求，这个块不要了，置为1，预留接口",
        },

        
        landSpriteFrame0: {
            default:null,
            type:cc.SpriteFrame,
            tooltip: "深绿地表",
        },

        landSpriteFrame1: {
            default:null,
            type:cc.SpriteFrame,
            tooltip: "浅绿地表",
        },

    },

    // use this for initialization
    onLoad: function () {
        console.log("tile onload");
        //若在关卡就 直接用预置数据，若在大厅 并且大厅没有数据 还是使用预制数据
        if (!cc.dataMgr.isHall || !cc.dataMgr.hasTileData) {
            //根据数据 放置物品，虽然他们不在一个层级，但是位置可以复用，因为父节点位置一样
            //测试用

            if (this.thingType != 0) {


            } else {
                //塞入null，维持 物品数据的完整性，方便遍历。

            }
        } else {
            //使用本地数据
        }

        this.generateLand();
        // this.generateThings();
        // this.generateImageByTypeAndLevel(thingType, thingLevel);

    },

    //根据上面的数据结构生成物品，放入物品层，物品层也是一个二维数组数据结构
    //雾，没有物品，数组中的元素都为null。
    //不用考虑龙，龙在龙层，而龙蛋在tile 和物品层都要有
    start: function () {

    },

    generateLand:function() {
        if(this.skinType == 0) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.landSpriteFrame0;
        } else if(this.skinType == 1) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.landSpriteFrame1;
        } else {
            debugger;
        }
    },

    // called every frame
    update: function (dt) {

    },
});