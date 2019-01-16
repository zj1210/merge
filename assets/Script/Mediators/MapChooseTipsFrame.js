const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class MapChooseTipsFrame extends cc.Component {
    onLoad(){
        //console.log("onLoad")
    }
    localInit(data){
        //console.log("localInit"+data.name+data.id)
        this.data = data
    }
    start() {
        var self = this
        this.node.getChildByName("title").getComponent(cc.Label).string = "第"+this.data.idx+"关"
        this.node.getChildByName("openBtn").on('click',function(event, customeData){
            window.Notification.emit("go_Checkpoint",{idx:self.data.idx});
            cc.uiMgr.pop();
        })
        this.node.getChildByName("closeBtn").on('click',function(event, customeData){
            self.node.destroy()
        })
    }
}