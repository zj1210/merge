const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class UIMgr extends cc.Component {
    stack = new Array()
    onLoad(){
        
    }
    start() {
       
    }
    update(){}
    onClickBtn(event, customeData) {
        if (event.target) {
            var btnN = event.target.name;
            if (btnN == "closeBtn") {
                //console.log(this.node.name)
            }else if (btnN == "addBtn"){
              
            }
        }
    }
    pop(){
        //console.log(this.stack.length)
        var name = "null"
        if (this.stack.length > 0){
            name = this.stack[this.stack.length-1].name
            this.stack[this.stack.length-1].destroy()
            this.stack.pop()
            if (this.stack.length > 0){
                this.stack[this.stack.length-1].active = true
            }
        }
        window.Notification.emit("UIMgr_pop",{length:this.stack.length,name:name})
    }
    Push(name,data,par){
        var _parentName = "Canvas/UI2d"
        var _parentObj = null
        if(par){
            if(par.parentName){
                _parentName = par.parentName
            }
            if(par.parentObj){
                _parentObj = par.parentObj
            }
        }
        this.loadPrefab(name,data,{add:true,parentName:_parentName,parentObj:_parentObj})
    }
    loadPrefab(name,data,parameter){
        if (!parameter){
            return
        }
        var self = this
        cc.loader.loadRes('prefab/'+name, function (err, prefab) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            cc.log('Result should be a prefab: ' + (prefab instanceof cc.Prefab));
            let nodeCN = cc.instantiate(prefab);
            //var parent = this.node.getComponent("")
            if (parameter.parentName){
                cc.find(parameter.parentName).addChild(nodeCN);
            }
            if (parameter.parentObj){
                parameter.parentObj.addChild(nodeCN)
            }
            
            if (parameter.add){
                if(self.stack.length > 0){
                    self.stack[self.stack.length-1].active= false
                }
                self.stack.push(nodeCN)
            }
            nodeCN.addComponent(name).localInit(data)
            //nodeCN.addComponent("test").localInit({name :"张三",id:9527})
            window.Notification.emit("UIMgr_push",{length:self.stack.length,name:name,data:data})
        });
    }
    
}