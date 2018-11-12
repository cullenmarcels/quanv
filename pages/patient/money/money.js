const app = getApp(),
    port = app.requirejs("core")
Page({
    data: {
        show: false
    },

    onLoad: function (options) {
        this.setData({
            openid: app.getCache("userinfo").openid
        })
        this.port()
    },

    port() {
        const that = this
        port.get("member/moneybag/pat_moneybag", {
            param: { openid: that.data.openid }
        }, function (res) {
        console.log(res)
            that.setData({
                list: res.list,
                totalmoney: res.totalmoney,
                show: true
            })
        })
    },

    // bankCard: function () {
    //     wx.navigateTo({
    //         url: '/pages/doctor/bankCard/bankCard',
    //     })
    // },

    moneyList() {
        wx.navigateTo({
            url: '/pages/patient/moneyList/moneyList',
        })
    }
})