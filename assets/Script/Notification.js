import UIMgr from 'UIMgr';
const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class Notification extends cc.Component {
    onLoad(){
        //console.log("onLoad")
        // 全局通知
        window.Notification = {
            _eventMap: [],

            on: function(type, callback, target) {
                if (this._eventMap[type] === undefined) {
                    this._eventMap[type] = [];
                }
                this._eventMap[type].push({ callback: callback, target: target });
            },

            emit: function(type, parameter) {
                var array = this._eventMap[type];
                if (array === undefined) return;
                
                for (var i = 0; i < array.length; i++) {
                    var element = array[i];
                    if (element) element.callback.call(element.target, parameter);
                }
            },

            off: function(type, callback) {
                var array = this._eventMap[type];
                if (array === undefined) return;

                for (var i = 0; i < array.length; i++) {
                    var element = array[i];
                    if (element && element.callback === callback) {
                        array[i] = undefined;
                        break;
                    }
                }
            },

            offType: function(type) {
                this._eventMap[type] = undefined;
            },
        };
        if (!cc.uiMgr) {
            cc.uiMgr = new UIMgr();
            //cc.ModuleMgr = new ModuleMgr()
        }
    }
    localInit(data){
        //console.log("localInit"+data.name+data.id)
    }
    start() {
        //console.log("start")
        cc.uiMgr.loadPrefab("controller",{},{add:false,parentName:"Canvas/UI2d"})
        cc.uiMgr.loadPrefab("ReturnHall",{},{add:false,parentName:"Canvas/UI2dUp"})
    }
    update(){}
}