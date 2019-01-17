const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class MapChooseFrame extends cc.Component {
    iconListMax = 20
    iconListCount = 0
    //iconList = new Array()
    index = 0
    onLoad(){
        //console.log("onLoad")
        window.Notification.on("dragonMove",function(data){

        })
    }
    localInit(data){
        //console.log("localInit"+data.name+data.id)
        this.index = data.index
        this.now_idx = 0
        this.iconList = new Array()
        this.content = this.node.getChildByName("ScrollView").getChildByName("view").getChildByName("content")
        this.group = this.content.getChildByName("group")
        this.dragon = this.content.getChildByName("dragon")
        //this.iconListCount = this.iconListMax
    }
    start() {
        //console.log("start")
        var self = this
        // this.node.getChildByName("btn").on('click',function(event, customeData){
        //     //console.log("!!!"+event.target.name)
        //     //cc.uiMgr.Push("orangeFrame",{name :"李四",id:7788})
        // }, this);
        //this.dragon.runAction(cc.moveTo(1, cc.v2(0,0)))
        
        // var inst = this.group.getChildByName("bg")
        // for (var j = 0; j < 3; j++) {
        //     //inst.children[j].children[0].active = true
        //     //console.log("!!"+this.iconList.length)
        //     this.iconList.push(inst.children[j])
        //     this.loadicon(this.iconList.length,j)
        // }
        // for (var i = 1; i < 7; i++) {
        //     var inst = cc.instantiate(this.group.getChildByName("bg"))
        //     this.group.addChild(inst);
        //     for (var j = 0; j < 3; j++) {
        //         inst.children[j].children[0].active = true
        //         this.iconList.push(inst.children[j])
        //         this.loadicon(this.iconList.length,j)
        //     }
        //     inst.position = cc.v2(i*2000,0)
        // }
        // this.content.width = (this.iconList.length/3*2000)+200
        window.Notification.on("UIMgr_loadPrefab",function(_data){
            if (self.index > 0 && _data.name == "CheckpointIcon" && _data.data.idx == self.index+1 && cc.isValid(self.node)){
                //console.log(self.iconList.length)
                var obj = self.iconList[self.index].children[1]
                self.chooseicon(self.index,obj)
            }
        })
        this.node.getChildByName("left").on('click',function(event, customeData){
            // if (self.index > 0){
            //     self.index = self.index - 1
            //     self.content.runAction(cc.moveTo(0.5, cc.v2(-self.par.children[self.index].x,0)))
            // }
        })
        this.node.getChildByName("right").on('click',function(event, customeData){
            // console.log(">>>"+self.index)
            // if (self.index < self.iconListMax-1){
            //     self.index = self.index + 1
            //     self.content.runAction(cc.moveTo(0.5, cc.v2(-self.par.children[self.index].x,0)))
            // }
        })
    }
    chooseicon(idx,obj){
        this.now_idx = idx
        var bg_x = this.iconList[idx].parent.x
        var x = this.iconList[idx].x + obj.x + bg_x
        var y = this.iconList[idx].y + obj.y
        this.dragon.runAction(cc.moveTo(0.5, cc.v2(x-60,y+60)))
        this.content.runAction(cc.moveTo(0.5, cc.v2(-x,0)))
    }
    loadicon(i,j){
        var self = this
        var parent = this.iconList[i-1]
        cc.uiMgr.loadPrefab("CheckpointIcon",{fun:function(idx,obj){
            //console.log("你点击了第"+idx+"关")
            if (idx-1 != self.now_idx){
                self.chooseicon(idx-1,obj)
            }else{
                cc.uiMgr.loadPrefab("MapChooseTipsFrame",{idx:idx},{add:false,parentObj:self.node})
            }
        },idx:i,desc:"第"+i+"关",iconIdx:j},{add:false,parentObj:parent})
    }
    update(){
       if (this.iconListCount < this.iconListMax){
            this.iconListCount = this.iconListCount + 1
            var idx = 2
            var x = 711
            if (this.iconListCount%3 == 1){
                idx = 0
                x = 787
                
            }else if (this.iconListCount%3 == 2){
                idx = 1
                x = 562
            }
            
            var inst = cc.instantiate(this.group.getChildByName("bg").children[idx])
            this.group.addChild(inst);
            if (this.iconList.length == 0){
                inst.position = cc.v2(426,this.group.getChildByName("bg").children[idx].y)
            }else{
                inst.children[0].active = true
                //console.log(this.iconList[this.iconList.length-1].position.x)
                inst.position = cc.v2(x+this.iconList[this.iconList.length-1].position.x,this.group.getChildByName("bg").children[idx].y)
            }
            this.iconList.push(inst)
            this.loadicon(this.iconList.length,0)
            if (this.iconListCount == this.iconListMax){
                this.content.width = (x+this.iconList[this.iconList.length-1].position.x)
            }
       }
    }
}