const app = getApp(),
    port = app.requirejs("core")
Page({
    data: {
        show: false,
    },

    onLoad: function (options) {
        this.setData({
            openid: app.getCache("userinfo").openid
        })
        this.port()
    },

    port(){
        const that = this
        port.get("member/moneybag/doc_moneybag", {
            param:{ openid: that.data.openid }
        }, function (res) {
            that.setData({
                date: res.date, 
                list: res.list,
                totalmoney: res.totalmoney,
                credit2: res.credit2,
                show: true
            })
        })
    },

    bankCard: function(){
        wx.navigateTo({
            url: '/pages/doctor/bankCard/bankCard',
        })
    },

    moneyList(){
        wx.navigateTo({
            url: '/pages/doctor/moneyList/moneyList',
        })
    },

    totalmoney(){
        wx.navigateTo({
            url: '/pages/doctor/depositList/depositList',
        })
    }
})