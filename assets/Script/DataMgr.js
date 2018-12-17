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
            "flowerLevel": 1,
            "minDragonLevel": 1,
            "heartLevel": 0,
            "needTime": 5
        },

        {
            "flowerLevel": 2,
            "minDragonLevel": 2,
            "heartLevel": 1,
            "needTime": 5
        },

        {
            "flowerLevel": 3,
            "minDragonLevel": 3,
            "heartLevel": 2,
            "needTime": 5
        },

        {
            "flowerLevel": 4,
            "minDragonLevel": 4,
            "heartLevel": 3,
            "needTime": 5
        },

        {
            "flowerLevel": 5,
            "minDragonLevel": 5,
            "heartLevel": 4,
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
    ]
    this.init();
}

DataMgr.prototype.init = function () {

    //这里将来要做的是 读取用户的数据，初始化每个块。
    //目前直接使用预定义的。
    //console.log('数据初始化运行');

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

//打印tile的数据 debug用
DataMgr.prototype.debugTileInfo = function () {
    for (var i = 0; i < this.hallTileHeight; i++) {
        for (var j = 0; j < this.hallTileWidth; j++) {


            console.log(this.tilesData[i][j].getComponent('Tile').thingType + "  " + this.tilesData[i][j].getComponent('Tile').thingLevel);
        }
    }
}