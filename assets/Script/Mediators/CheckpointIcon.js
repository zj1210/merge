const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class MapChooseFrame extends cc.Component {
    _data = null
    onLoad(){
        //this.point_pos = [cc.v2(-66,77),cc.v2(11,77),cc.v2(40,204)]
        this.point_icon_pos = [cc.v2(0,38),cc.v2(17,106),cc.v2(-4,58),cc.v2(-25,128),cc.v2(-25,128)]
        //this.point_icon_name = []
        
    }
    localInit(data){
        this._data = data
        //this.node.name = ""+data.idx
        if (data.idx == 21){
            return
        }
        var conf = cc.Config["checkpoint"][data.idx]
        var node_pos = conf.node_pos.split(",")
        this.node.position = cc.v2(Number(node_pos[0]),Number(node_pos[1]))//this.point_pos[data.idx]
        this.node.getChildByName("btn").getChildByName("desc").getComponent(cc.Label).string = data.desc
 
        this.changeBj(conf,this.node.getChildByName("icon"))

    }
    start() {
        var self = this
        this.node.getChildByName("btn").on('click',function(event, customeData){
            if (self._data && self._data.fun){
                self._data.fun(self._data.idx,self.node)
            }
         }, this);
    }
    update(){}
    changeBj(conf,obj){
        //console.log(conf)
        var name = conf.icon_name
        var url = "ui/"+name
       // var _obj = obj;
        cc.loader.loadRes(url,cc.SpriteFrame,function(err,spriteFrame){
            //obj.isPlay.spriteFrame = spriteFrame;
            //console.log(obj.name)
            obj.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            var icon_pos = conf.icon_pos.split(",")
            obj.position = cc.v2(Number(icon_pos[0]),Number(icon_pos[1]))
       });
   }
}