const app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        show:false
    },

    onLoad: function (options) {
        const that = this
        port.post("member/doctors/get_liability", {}, function (res) {
            console.log(res)
            wx.setNavigationBarTitle({
                title: res.result.title
            })
            that.setData({
                nodes: res.result.detail,
                show: true
            })
        })
    },
})