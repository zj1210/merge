const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class MapChooseFrame extends cc.Component {
    _data = null
    onLoad(){
        this.point_pos = [cc.v2(-66,77),cc.v2(11,77),cc.v2(40,204)]
        this.point_icon_pos = [cc.v2(0,38),cc.v2(17,106),cc.v2(-4,58),cc.v2(-25,128),cc.v2(-25,128)]
    }
    localInit(data){
        this._data = data
        //this.node.name = ""+data.idx
        this.node.position = this.point_pos[data.iconIdx]
        this.node.getChildByName("btn").getChildByName("desc").getComponent(cc.Label).string = data.desc
        //changeBj(data.image,this.node.getChildByName("btn").getChildByName("bg"))
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
    changeBj(name,obj){
        var url = "ui/"+name
        var _this = this;
        cc.loader.loadRes(url,cc.SpriteFrame,function(err,spriteFrame){
            //obj.isPlay.spriteFrame = spriteFrame;
            obj.getComponent(cc.Sprite).spriteFrame = spriteFrame;
       });
       
   }
}