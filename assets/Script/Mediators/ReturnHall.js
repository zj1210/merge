const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class ReturnHall extends cc.Component {
    onLoad(){
        //console.log("onLoad")
    }
    localInit(data){
        //console.log("localInit"+data.name+data.id)
    }
    start() {
        var self = this
        window.Notification.on("UIMgr_pop",function(data){
            self.node.getChildByName("closeBtn").active = data.length > 0 ? true : false
        })
        window.Notification.on("UIMgr_push",function(data){
            self.node.getChildByName("closeBtn").active = data.length > 0 ? true : false
        })
        //console.log("start -> controller")
        this.node.getChildByName("closeBtn").on('click',function(event, customeData){
            cc.uiMgr.pop()
            //console.log("!!!"+event.target.name)
            //cc.uiMgr.Push("orangeFrame",{name :"李四",id:7788})
        }, this);
    }
    update(){}
}