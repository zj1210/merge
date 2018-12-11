cc.Class({
    extends: cc.Component,

    properties: {
      

        thingNode:{
            default:null,
            type:cc.Node
        }
        // defaults, set visually when attaching this script to the Canvas

    },

    // use this for initialization
    onLoad: function () {
        this.selectedSprite = this.node.getComponent(cc.Sprite);
        this.originSpriteFrame = this.selectedSprite.spriteFrame;
        this.selectedSprite.spriteFrame = null;
       
        
    },

    start: function () {
        let self = this;
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log('touch begin by flower');
            event.stopPropagation();
           
            let touchPos = event.getLocation();
            
            //console.log(touchPos);
            self._beginPos = touchPos;
             //物体的世界坐标 触摸点也是世界坐标，做差值得到偏移值
             var worldPosition = self.node.parent.convertToWorldSpaceAR(self.node.position);
             self._offset = cc.pSub(worldPosition,touchPos);
            //必然有物体，因为这个节点就是物体
            //显示tips
            self.selectedSprite.spriteFrame = self.originSpriteFrame;

        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if (self._beginPos) {
                console.log('touch move by flower');
                event.stopPropagation();
                //核心逻辑
                //1 点击跟随 触摸点
                //物体的世界坐标 = touchPos+ _offset;
                var worldpos = cc.pAdd(event.getLocation() , self._offset);
                //需要将世界坐标转为 节点坐标
                var nodepos = self.node.parent.parent.convertToNodeSpaceAR(worldpos);
                // console.log(self.node.position);
                // console.log("节点坐标");
                // console.log(nodepos);
                self.node.parent.position = nodepos;
                // console.log(worldPosition);
                //2 判断离哪个块近，暂时将那个块的物品平移，将那个块的 当前物品置为此物品 若物品位置改变 flag = true 没有跟上次有改变 flag = false
                //3 查找连通物品
                //4 将连通物品的selected active 置为true 并且播放往此物品平移的 动画 如果此物品位置没有再改变就不再调用这个动画 flag = false
                //5
            }

        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            event.stopPropagation();
            self._beginPos = null;
            self._offset = null;
            
            self.selectedSprite.spriteFrame = null;
            //玩家松手判定
            //查找连通表 若表不为空，数量大于2
            //根据数量 查表 根据合成数量 返回合成奖励后的数量
            // 根据数量来生成 新花 龙，精华 三的整数倍 余数 还是生成原来的 返回的是 物品集合
            //将物品放入格子算法 最大的物品，第一个，放入当前格子（当前还是要记录的）
            //其余物品如何放置？ 根据其余物品数量，找到相应数量的格子（距离最近的，遍历所有格子，找到前n个最近的），一一播放动画，回调插入
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {}, this.node);
    },


    selectClick:function() {

    },

    //thingType 0=没有，1=精华，2=花，3=龙蛋
    //thingLevel 0初始，1升一级，以此类推，注意：蒲公英是花级别为0，如果是龙蛋，级别必须为0，龙不在地表上
    setSpriteFrame:function(thingType,thingLevel) {
        //debugger;
        if (thingType == 1) {
            switch (thingLevel) {
                case 1:
                    console.log("执行到了，要改变物体的图片");
                    break;

                default:
                    break;
            }
        }
    },

    // called every frame
    update: function (dt) {

    },
});