const {
    ccclass,
    property
} = cc._decorator;Tools

@ccclass
export default class Tools extends cc.Component {
    //格式化字符串
    //a = "这是*一*个*测试"
    //b = "7,8,9"
    //return "这是7一8个9测试"
    stringFormat(a,b){
        var a1 = a.split("*")
        var b1 = b.split(",")
        var c = ""
        for(var i = 0;i < a1.length;i++){
            c = c + a1[i]
            if (b1[i]){
                c = c + b1[i]
            }
        }
        return c
    }
}