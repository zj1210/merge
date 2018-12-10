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
    this.isHall = true;//要么在大厅，要么在关卡。
    //二维tile数据
    this.tilesData = new Array();
    //二维things数据
    this.thinsgData = new Array(); 
    //一维 飞龙数据
    this.dragonsData = new Array();
    this.init();
}

DataMgr.prototype.init = function() {
    //这里将来要做的是 读取用户的数据，初始化每个块。
    //目前直接使用预定义的。
    console.log('数据初始化运行');

    
}