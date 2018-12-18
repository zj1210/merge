/**
 * map数据结构定义，用灵活的数据结构目前我还很难想到，至少需要3天。
 * 项目周期非常的短，准备使用简单粗暴的数据结构，能想到的就是在界面里
 * 的map下放入一个矩形区域的地图块，这个块中若是有空隙就很难办，将来
 * 如果有这个需求，打算将那些不要的快的active置为false，那么数据结构
 * 也要相应的调整，在读取地图的时候将所有数据读取到，根据块的active来
 * 做相应的处理。 块以行排列，一行一行的形式
 */





function DataMgr() {
    //是否有地图数据，没有就从界面读取，有就从用户数据读取
    this.hasTileData = false;
    this.isHall = true; //要么在大厅，要么在关卡。
    this.screenW = cc.director.getVisibleSize().width;
    this.screenH = cc.director.getVisibleSize().height;
    this.edgeMoveCamera = 70;
    //为了解决所有thingsNode上的z序问题
    //思路：根据tile的加载顺序 给上面的thing zOrder 设置为全局的这个 每次递增
    //可以解决问题
    this.globalZOrder = 0;
    //一下三个数组 是进 关卡，或者大厅 根据关卡摆放生成的数据结构，只有大厅的数据会退出游戏时，永久存储。关卡只记录进度
    //二维tile数据
    this.tilesData = [];
    //二维things数据
    this.thingsData = [];
    //一维 飞龙数据
    this.dragonsData = [];

    this.hallTileWidth = 11;
    this.hallTileHeight = 13;

    this.checkpointWidth = 0;
    this.checkpintHeight = 0;
    //为了简单打算写死，不能处理生成的龙超过9个以上 这种情况数学上没证明，
    //但是概率应该是极低的3个相同还会归并
    this.dragonsOffset = [
        {
            xOffset: 0,
            yOffset: 0,
        },
        {
            xOffset: 0,
            yOffset: 100,
        },

        {
            xOffset: -100,
            yOffset: 0,
        },

        {
            xOffset: 0,
            yOffset: -100,
        },

        {
            xOffset: 100,
            yOffset: 0,
        },

        {
            xOffset: -100,
            yOffset: 100,
        },

        {
            xOffset: 100,
            yOffset: 100,
        },

        {
            xOffset: 100,
            yOffset: -100,
        },
        {
            xOffset: -100,
            yOffset: 100,
        },
        {
            xOffset: -100,
            yOffset: -100,
        }
    ];
    //采集数据 花级别 最低龙级别 采集的结果 采集所需时间
    this.collectionDatas = [
        {
            "flowerLevel": 2,
            "minDragonLevel": 1,
            "heartLevel": 0,
            "needTime": 5
        },

        {
            "flowerLevel": 3,
            "minDragonLevel": 2,
            "heartLevel": 1,
            "needTime": 5
        },

        {
            "flowerLevel": 4,
            "minDragonLevel": 3,
            "heartLevel": 2,
            "needTime": 5
        },

        {
            "flowerLevel": 5,
            "minDragonLevel": 4,
            "heartLevel": 3,
            "needTime": 5
        }
    ];
    //每级龙的初始体力值
    this.dragonStrengthDatas = [
        {
            "dragonLevel": 1,
            "dragonStrength": 5
        },
        {
            "dragonLevel": 2,
            "dragonStrength": 5
        },
        {
            "dragonLevel": 3,
            "dragonStrength": 5
        },
        {
            "dragonLevel": 4,
            "dragonStrength": 5
        },
        {
            "dragonLevel": 5,
            "dragonStrength": 5
        }
    ];
    //每级心的力量
    this.heartPowerDatas = [
        {
            "heartLevel": 0,
            "heartStrength": 1
        },
        {
            "heartLevel": 1,
            "heartStrength": 4
        },
        {
            "heartLevel": 2,
            "heartStrength": 13
        },
        {
            "heartLevel": 3,
            "heartStrength": 40
        },
        {
            "heartLevel": 4,
            "heartStrength": 121
        }
    ];
    this.init();
}

DataMgr.prototype.init = function () {
    //用于购买宝箱 金币
    var coinCount = cc.sys.localStorage.getItem("coinCount");
    if (!coinCount) {
        cc.sys.localStorage.setItem("coinCount", 0);
    }
    //用于邀请好友的奖励？需求不定，钻石
    var diamondCount = cc.sys.localStorage.getItem("diamondCount");
    if (!diamondCount) {
        cc.sys.localStorage.setItem("diamondCount", 0);
    }

    //用于解锁雾 收集的心的数量 会把各级心换算对应的一级心个数
    var heartCount = cc.sys.localStorage.getItem("heartCount");
    if (!heartCount) {
        cc.sys.localStorage.setItem("heartCount", 0);
    }

    //这里将来要做的是 读取用户的数据，初始化每个块。
    //目前直接使用预定义的。
    //console.log('数据初始化运行');
}

DataMgr.prototype.getHeartCount = function() {
    var heartCount = cc.sys.localStorage.getItem("heartCount");
    
    return parseInt(heartCount);
}

DataMgr.prototype.addHeartCount = function(count) {
    var result = this.getHeartCount() + count;
    cc.sys.localStorage.setItem("heartCount", result);
}

DataMgr.prototype.getCoinCount = function() {
    var coinCount = cc.sys.localStorage.getItem("coinCount");
    return parseInt(coinCount); 
}

DataMgr.prototype.addCoinCount = function(count) {
    var result = this.getCoinCount() + count;
    cc.sys.localStorage.setItem("coinCount", result);
}

DataMgr.prototype.getDiamondCount = function() {
    var diamondCount = cc.sys.localStorage.getItem("diamondCount");
    return parseInt(diamondCount); 
}

DataMgr.prototype.addDiamondCount = function(count) {
    var result = this.getDiamondCount() + count;
    cc.sys.localStorage.setItem("diamondCount", result);
}

DataMgr.prototype.getHeartCountByLevel = function(heartLevel) {
    for (var i = 0; i < this.heartPowerDatas.length; i++) {
        if (this.heartPowerDatas[i].heartLevel == heartLevel) {
            return parseInt(this.heartPowerDatas[i].heartStrength);
        }
    }
    debugger;
}

DataMgr.prototype.getCurrentWidthAndHeight = function () {
    if (this.isHall) {
        return {
            w: this.hallTileWidth,
            h: this.hallTileHeight
        };
    } else {
        return {
            w: this.checkpointWidth,
            h: this.checkpintHeight
        };
    }
}

//checkpointID 大厅是0 关卡的从1开始类推 mapNode的tile必须按照从左到右，从上到下的顺序摆放
DataMgr.prototype.initTile = function (checkpointID, tiles) {
    //console.log(tiles);
    for (var i = 0; i < this.hallTileHeight; i++) {
        this.tilesData[i] = [];
    }
    for (var i = 0; i < this.hallTileHeight; i++) {
        for (var j = 0; j < this.hallTileWidth; j++) {
            this.tilesData[i][j] = tiles[i * this.hallTileWidth + j];
            this.tilesData[i][j].getComponent('Tile').setIndex(j, i);
        }
    }
    // console.log(this.tilesData);
}


DataMgr.prototype.getDragonStrength = function (dragonLevel) {
    for (var i = 0; i < this.dragonStrengthDatas.length; i++) {
        if (this.dragonStrengthDatas[i].dragonLevel == dragonLevel) {
            return this.dragonStrengthDatas[i].dragonStrength;
        }
    }
    //不可能执行到这里
    debugger;
}

//根据花的级别 从dataMgr中找到最小的龙级别
DataMgr.prototype.getCollectionMinDragonLevel = function (flowerLevel) {
    // this.collectionDatas = [
    //     {
    //         "flowerLevel": 1,
    //         "minDragonLevel": 1,
    //         "heartLevel": 0,
    //         "needTime": 5
    //     },

    for (var i = 0; i < this.collectionDatas.length; i++) {
        if (this.collectionDatas[i].flowerLevel == flowerLevel) {
            return this.collectionDatas[i].minDragonLevel;
        }
    }

    //给的花级别 表中没有，目前说明：花的级别很低，不支持采集
    return null;

}

DataMgr.prototype.getCollectionHeartLevel = function (flowerLevel) {
    for (var i = 0; i < this.collectionDatas.length; i++) {
        if (this.collectionDatas[i].flowerLevel == flowerLevel) {
            return this.collectionDatas[i].heartLevel;
        }
    }

    //传入的可收集的花 竟然没有找到返回的精华类别？
    debugger;
}

//打印tile的数据 debug用
DataMgr.prototype.debugTileInfo = function () {
    for (var i = 0; i < this.hallTileHeight; i++) {
        for (var j = 0; j < this.hallTileWidth; j++) {


            console.log(this.tilesData[i][j].getComponent('Tile').thingType + "  " + this.tilesData[i][j].getComponent('Tile').thingLevel);
        }
    }
}
