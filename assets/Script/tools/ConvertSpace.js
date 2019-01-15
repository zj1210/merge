// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
		//this.convetOtherNodeSpace(button1,button2);
    },
	/**
	 *  * 把一个节点的本地坐标转到另一个节点的本地坐标下
	 * @param {*} node 目标
	 * @param {*} targetNode 当前要移动的目标
	 */
	convetOtherNodeSpace:function (node, targetNode) {
		if (!node || !targetNode) {
			return null;
		}
		//先转成世界坐标
		var worldPoint = this.localConvertWorldPoint(node);
		//console.log("worldPoint: "+worldPoint);
		var tempPoint = this.worldConvertLocalPoint(targetNode, worldPoint);
		targetNode.setPosition(tempPoint.x+targetNode.position.x,tempPoint.y+targetNode.position.y);
	},


	 localConvertWorldPoint:function(node) {
		if (node) {
			//console.log(node.convertToWorldSpace(cc.v2(0, 0)));
			//console.log("^^^^^^^^^^^^^^"+node.getPosition());
			return node.convertToWorldSpace(cc.v2(0, 0));
		}
		return null;
	},
	worldConvertLocalPoint:function(node,worldPoint) {
		if (node) {
			return node.convertToNodeSpace(worldPoint);
		}
		return null;
	},
    // update (dt) {},
});
