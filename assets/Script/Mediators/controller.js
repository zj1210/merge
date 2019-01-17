const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class controller extends cc.Component {
    onLoad(){
        //console.log("onLoad")
    }
    localInit(data){
        //console.log("localInit"+data.name+data.id)
    }
    start() {
        var self = this
        window.Notification.on("UIMgr_pop",function(data){
            self.node.getChildByName("bg").active = data.length > 0 ? true : false
        })
        window.Notification.on("UIMgr_push",function(data){
            self.node.getChildByName("bg").active = data.length > 0 ? true : false
        })
        //console.log("start -> controller")
    }
    update(){}
}