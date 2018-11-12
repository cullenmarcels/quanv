const app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        show: false
    },

    onLoad: function (options) {
        this.setData({
            openid: app.getCache("userinfo").openid,
            orderid: options.orderid
        })
        this.port()
    },

    port(){
        const that = this
        port.get("member/moneybag/doc_moneybag_orderdetail", {
            param: {
                orderid: that.data.orderid,
                openid: that.data.openid
            }
        }, function (res) {
            that.setData({
                list: res.list,
                show: true
            })
        })
    }

  
})