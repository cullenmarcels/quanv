const app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        show: false
    },

    onLoad: function (options) {
        const that = this
        port.get("newshop/get_goods_list", {}, function (res) {
            that.setData({
                goods: res.goods,
                show: true
            })
        })
    },

})