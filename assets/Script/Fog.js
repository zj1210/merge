
cc.Class({
    extends: cc.Component,

    properties: {


        fog: {
            default: null,
            type: cc.Node
        },
        box: {
            default: null,
            type: cc.Node
        },

        box_0_spr: {
            default: null,
            type: cc.SpriteFrame
        },

        box_1_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        box_2_spr: {
            default: null,
            type: cc.SpriteFrame
        },

        reLockLabel: {
            default: null,
            type: cc.Label
        },

        thingPrefab: {
            default: null,
            type: cc.Prefab,
        },

        dragonPrefab: {
            default: null,
            type: cc.Prefab,
        },


        // defaults, set visually when attaching this script to the Canvas

    },

    boxClick: function () {
        console.log('宝箱被点击了！');

        var treasureData = cc.dataMgr.randomTreasure();
        var game = cc.find("Canvas").getComponent('Game');
        switch (treasureData.category) {
            case "coin":
                this.tile.getComponent('Tile').fog = null;
                this.tile.getComponent('Tile').tileType = 0;
                this.node.destroy();
                var worldpos = this.node.parent.convertToWorldSpaceAR(this.node.position);
                var camerapos = cc.v2(worldpos.x - game.camera.position.x, worldpos.y - game.camera.position.y);
                var count = treasureData.count;
                cc.find("Canvas/uiLayer").getComponent('UI').addCoinAndAni(camerapos, count);
                break;

            case "flower":
                this.fog_GenerateThing(2, treasureData.level);
                break;

            case "dragon":
                this.fog_GenerateThing(3, treasureData.level);
                break;

            case "heart":
                this.fog_GenerateThing(1, treasureData.level);

                break;

            default:
                break;
        }

    },

    fog_GenerateThing: function (thingType, thingLevel) {
        this.tile.getComponent('Tile').fog = null;
        this.tile.getComponent('Tile').tileType = 0;
        var newThing = cc.instantiate(this.thingPrefab);
        newThing.position = this.node.position;
        var thingJS = newThing.getChildByName('selectedNode').getComponent('Thing');
        thingJS.setTypeAndLevel_forNewThing(thingType, thingLevel);


        cc.find("Canvas/gameLayer/thingsNode").addChild(newThing);


        thingJS.changeInTile(this.tile, thingLevel, thingType);
        // debugger;
        // cc.dataMgr.debugTileInfo();
        this.node.destroy();
    },


    fogClick: function () {
        console.log('fog被点击了！');

        var heartCount = cc.dataMgr.getHeartCount();
        if (heartCount >= this.fogAmount) {
            //心够，将来可能是弹窗
            //解锁雾 可以在动画回调里设置
            cc.dataMgr.addHeartCount(-this.fogAmount);
            cc.find("Canvas/uiLayer").getComponent('UI').refreshUI();
            this.fogState = 1;
            //必须同步到tile，否则无法持久化数据
            this.tile.getComponent('Tile').fogState = 1;
            this.settingState(1);
        } else {
            console.log("心不够啊！");
        }
    },

    //初始化加载的时候 来调用 不播放动画!!!!!

    settingFog: function (fogState, fogAmount, tile) {

        this.fogAmount = fogAmount;


        this.fogState = fogState;
        if (this.fogState == 0) {
            this.reLockLabel.string = this.fogAmount + "精华解锁";
            this.box.active = false;
        } else if (this.fogState == 1) {
            this.reLockLabel.node.active = false;
            this.fog.active = false;
            this.box.active = true;

        } else {
            console.log("未知 fogState " + fogState);
            debugger;
        }

        this.tile = tile;
    },

    //播放动画，游戏的操作！！！！
    settingState: function (fogState) {
        this.fogState = fogState;
        if (this.fogState == 0) {
            this.reLockLabel.string = this.fogAmount + "精华解锁";
            this.box.active = false;
        } else if (this.fogState == 1) {
            this.reLockLabel.node.active = false;

            this.fog.getComponent(cc.Animation).play('fogOut');
            this.scheduleOnce(this.fogOutOver, 1.1);
        } else {
            console.log("未知 fogState " + fogState);
            debugger;
        }
    },

    fogOutOver: function () {
        this.fog.active = false;
        this.box.active = true;
        //this.box.getComponent(cc.Animation).play('boxIn');
    }

});