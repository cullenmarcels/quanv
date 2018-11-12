const app = getApp(),
    port = app.requirejs("core"),
    wxParse = app.requirejs("wxParse/wxParse");
Page({

    
    data: {
        show: false,
        advWidth: 0
    },

   
    onLoad: function (options) {
        this.setData({
            options: options
        })
        this.idshow()
    },
    
    idshow(){
        const that = this
        port.get("goods/get_detail", {
            id: that.data.options.id
        }, function (res) {
              
            wxParse.wxParse("wxParseData", "html", res.goods.content, that, "0")

            that.setData({
                show: true,
                goods: res.goods     //详情页数据
            })

        
        })
        // 获取终端系统信息
        wx.getSystemInfo({
            success: function (t) {
                that.setData({
                    advWidth: t.windowWidth
                })
            }
        })
    },

    click(e){
        wx.showModal({
            title: '提示',
            content: '确定' + e.currentTarget.dataset.i + ' ' + this.data.goods.title +' ？',
        })
    }


  

})