const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class MapChooseFrame extends cc.Component {
    iconListMax = 5
    iconListCount = 0
    //iconList = new Array()
    index = 0
    onLoad(){
        //console.log("onLoad")
        window.Notification.on("dragonMove",function(data){

        })
    }
    localInit(data){
        console.log("localInit"+data.name+data.id)
        this.index = data.index
        this.iconList = new Array()
        this.content = this.node.getChildByName("ScrollView").getChildByName("view").getChildByName("content")
        this.group = this.content.getChildByName("group")
        this.dragon = this.content.getChildByName("dragon")
        this.iconListCount = this.iconListMax
    }
    start() {
        console.log("start")
        var self = this
        // this.node.getChildByName("btn").on('click',function(event, customeData){
        //     //console.log("!!!"+event.target.name)
        //     //cc.uiMgr.Push("orangeFrame",{name :"李四",id:7788})
        // }, this);
        //this.dragon.runAction(cc.moveTo(1, cc.v2(0,0)))
        
        var inst = this.group.getChildByName("bg")
        for (var j = 0; j < 3; j++) {
            //inst.children[j].children[0].active = true
            console.log("!!"+this.iconList.length)
            this.iconList.push(inst.children[j])
            this.loadicon(this.iconList.length,j)
        }
        for (var i = 1; i < 7; i++) {
            var inst = cc.instantiate(this.group.getChildByName("bg"))
            this.group.addChild(inst);
            for (var j = 0; j < 3; j++) {
                inst.children[j].children[0].active = true
                this.iconList.push(inst.children[j])
                this.loadicon(this.iconList.length,j)
            }
            inst.position = cc.v2(i*2000,0)
        }
        this.content.width = (this.iconList.length/3*2000)+200
        window.Notification.on("UIMgr_push",function(_data){
            if (self.index > 0 && _data.name == "CheckpointIcon" && _data.data.idx == self.index+1 && cc.isValid(self.node)){
                console.log(self.iconList.length)
                var bg_x = self.iconList[self.index].parent.x
                var obj = self.iconList[self.index].children[1]
                var x = self.iconList[self.index].x + bg_x + obj.x
                var y = self.iconList[self.index].y + obj.y
                self.content.runAction(cc.moveTo(0.5, cc.v2(-x,0)))
                self.dragon.runAction(cc.moveTo(0.5, cc.v2(x,y)))
            }
        })
        this.node.getChildByName("left").on('click',function(event, customeData){
            if (self.index > 0){
                self.index = self.index - 1
                self.content.runAction(cc.moveTo(0.5, cc.v2(-self.par.children[self.index].x,0)))
            }
        })
        this.node.getChildByName("right").on('click',function(event, customeData){
            console.log(">>>"+self.index)
            if (self.index < self.iconListMax-1){
                self.index = self.index + 1
                self.content.runAction(cc.moveTo(0.5, cc.v2(-self.par.children[self.index].x,0)))
            }
        })
    }
    loadicon(i,j){
        var self = this
        var parent = this.iconList[i-1]
        cc.uiMgr.loadPrefab("CheckpointIcon",{fun:function(idx,obj){
            console.log("你点击了第"+idx+"关")
            //this.node.getChildByName("dragon").runAction(cc.sequence(cc.moveTo(1, cc.v2(aimMove, this.node.y)), cc.callFunc(this.callEat, this)));
            //var v2 = self.convetOtherNodeSpace()
            //self.dragon.runAction(cc.sequence(cc.moveTo(1, cc.v2(obj.position.x, obj.position.y))));
            //self.iconList[idx].addChild(self.dragon)
            //self.dragon.parent = self.iconList[idx-1]
            //self.dragon.position = cc.v2(0,0)
            var bg_x = self.iconList[idx-1].parent.x
            var x = self.iconList[idx-1].x + obj.x + bg_x
            var y = self.iconList[idx-1].y + obj.y
            self.dragon.runAction(cc.moveTo(0.5, cc.v2(x,y)))
        },idx:i,desc:"第"+i+"关",image:"dj_flower02",iconIdx:j},{add:false,parentObj:parent})
    }
    update(){
       
    }
}