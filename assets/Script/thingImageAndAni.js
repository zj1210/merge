


//管理thing的 图片 和动画
cc.Class({
    extends: cc.Component,

    properties: {
        //todo 定义 N多的 图片  和动画
        //


        flower_0_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        flower_1_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        flower_2_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        flower_3_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        flower_4_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        flower_5_spr: {
            default: null,
            type: cc.SpriteFrame
        },

        dragonEgg_0_spr: {
            default: null,
            type: cc.SpriteFrame
        },

        heart_0_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        heart_1_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        heart_2_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        heart_3_spr: {
            default: null,
            type: cc.SpriteFrame
        },
        heart_4_spr: {
            default: null,
            type: cc.SpriteFrame
        },
    },

    // use this for initialization
    onLoad: function () {

        
    },

    start: function () {

    },

    //设置图片
    settingSpriteFrame(type, level) {
        this.thing_spr = this.getComponent(cc.Sprite);
        if (type == 1) {
            if (level == 0) {
                this.thing_spr.spriteFrame = this.heart_0_spr;
            } else if (level == 1) {
                this.thing_spr.spriteFrame = this.heart_1_spr;
            } else if (level == 2) {
                this.thing_spr.spriteFrame = this.heart_2_spr;
            } else if (level == 3) {
                this.thing_spr.spriteFrame = this.heart_3_spr;
            } else if (level == 4) {
                this.thing_spr.spriteFrame = this.heart_4_spr;
            }
        } else if (type == 2) {
            if (level == 0) {
                this.thing_spr.spriteFrame = this.flower_0_spr;
            } else if (level == 1) {
                this.thing_spr.spriteFrame = this.flower_1_spr;
            } else if (level == 2) {
                this.thing_spr.spriteFrame = this.flower_2_spr;
            } else if (level == 3) {
                this.thing_spr.spriteFrame = this.flower_3_spr;
            } else if (level == 4) {
                this.thing_spr.spriteFrame = this.flower_4_spr;
            } else if (level == 5) {
                this.thing_spr.spriteFrame = this.flower_5_spr;
            }
        } else if (type == 3) {
            if (level == 0) {
                this.thing_spr.spriteFrame = this.dragonEgg_0_spr;
            } else {
                debugger;
            }
        }
    },

    // called every frame
    update: function (dt) {

    },
});
