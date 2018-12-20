cc.Class({
    extends: cc.Component,
    //195 45 的间隔排列的块
    properties: {

        tileType: {
            default: 0,
            displayName: "是绿地还是雾",
            tooltip: "0标记着是绿地块，1标记着是雾",
        },

        fogAmount:{
            default:100,
            displayName:"雾需要多少精华解锁",
            tooltip: "只有地皮是雾这个值才有意义，默认值是100",
        },

        fogState:{
            default:0,
            displayName:"雾的游戏状态",
            tooltip: "0代表是雾，1代表雾已经解锁了，是宝箱",
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
            tooltip: "0初始，1升一级，以此类推，注意：蒲公英是花级别为0，(注：是地面上的蒲公英，这个值程序内来使用)如果是龙蛋，级别必须为0，龙不在地表上",
        },

        dontWant: {
            default: 0,
            displayName: "不想要这个块",
            tooltip: "0默认要这个块，除非特殊需求，这个块不要了，置为1，预留接口",
        },


        landSpriteFrame0: {
            default: null,
            type: cc.SpriteFrame,
            tooltip: "深绿地表",
        },

        landSpriteFrame1: {
            default: null,
            type: cc.SpriteFrame,
            tooltip: "浅绿地表",
        },

        thingPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: "thing的Prefab",
        },

        fogPrefab:{
            default:null,
            type:cc.Prefab,
            tooltip: "fog的Prefab",
        },

        flowerSpriteFrame1: {
            default: null,
            type: cc.SpriteFrame,
            tooltip: "1级花",
        },

        // thingsNode:{
        //     default:null,
        //     type:cc.Node,
        //     tooltip:"thing的容器，与地图层并列",
        // }

    },

    // use this for initialization
    onLoad: function () {
        this.thing = null;
        this.tempThing = null;
        this.fog = null;
        this.thingZOrder = cc.dataMgr.globalZOrder++;
        // console.log("tile onload" + this.node.name);
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
        if(this.tileType == 1) {
            if(this.thingType != 0 || this.thingLevel != 0) {
                console.log("error:有雾，却设置了物品类别或者物品等级！");
                debugger;
            }
        }
        if(this.tileType == 1) {
            this.generateFog();
        }
        else if (this.thingType > 0) {
            this.generateThings();
        }

        // this.generateImageByTypeAndLevel(thingType, thingLevel);

    },

    generateFog: function () {
        this.fog = cc.instantiate(this.fogPrefab);
        this.fog.setLocalZOrder(this.thingZOrder);
        this.thingsNode = cc.find("Canvas/gameLayer/thingsNode");
        this.fog.position = this.node.position;
        this.thingsNode.addChild(this.fog);
        this.fog.getComponent('Fog').settingFog(this.fogState,this.fogAmount);
    },

    //需要 物品类型thingType 以及物品等级 thingLevel
    generateThings: function () {
        this.thing = cc.instantiate(this.thingPrefab);
        this.thing.setLocalZOrder(this.thingZOrder);
        this.tempThing = null; //临时物品，手指拖动上去，但没有松手，和棋盘上所有非临时的进行遍历
        this.thingsNode = cc.find("Canvas/gameLayer/thingsNode");
       
        this.thingsNode.addChild(this.thing);
        // this.thing.position = this.node.position;
        let thingJs = this.thing.getChildByName('selectedNode').getComponent("Thing");
        thingJs.setPositionAndOriginPosition(this.node.position, this.node);
        thingJs.setTypeAndLevel_forNewThing(this.thingType, this.thingLevel);
        // //主要是为了性能，内部不要以这个为准，为了判断自己的临时tile 和当前的临时tile是否一样，不一样才
        // thingJs.setTileTemporarily(this.node);
    },

    //根据上面的数据结构生成物品，放入物品层，物品层也是一个二维数组数据结构
    //雾，没有物品，数组中的元素都为null。
    //不用考虑龙，龙在龙层，而龙蛋在tile 和物品层都要有
    start: function () {

    },

    generateLand: function () {
        if (this.skinType == 0) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.landSpriteFrame0;
        } else if (this.skinType == 1) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.landSpriteFrame1;
        } else {
            debugger;
        }
    },

    //tile 上是不是没东西
    isEmptyTile:function() {
        //是绿地 且 没有thing
        if(this.tileType == 0 && this.thing == null) {
            return true;
        }
        return false;
    },

    //放入临时物体，将自己的物体平移
    putInThingTemporarily(thing) {
        this.tempThing = thing;
        //todo
        if (this.thing) {
            //平移
        }
    },

    setIndex(widthCount, heightCount) {
        this.index = {
            x: widthCount,
            y: heightCount
        };
    },

    //是否可以放入 thing
    isCanPut: function () {
        //判断tile是否可见 是否是雾
        //是块，非雾 就可放入 
        if (this.dontWant == 0 && this.tileType == 0) {
            return true
        }

        return false;
    },

    // called every frame
    update: function (dt) {

    },
});