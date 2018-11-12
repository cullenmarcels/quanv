const app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        show: false
    },

    onLoad: function (options) {
        this.setData({
            doc_openid: options.doc_openid,
            openid: app.getCache("userinfo").openid
        })
    },

    list(){
        const that = this
        port.post("member/consult/get_patconsult", {
            param: { doc_openid: that.data.doc_openid, pat_openid: that.data.openid}
        }, function (res) {
            that.setData({
                consent: res.result,
                show: true
            })
        })
    },

    onShow: function () {
        this.list()
    },

    // 返回首页
    returnHome: function(){
        wx.switchTab({
            url: '/pages/index/index',
        })
    } ,

    alterOrder(e){
        wx.navigateTo({
            url: '/pages/patient/alterOrder/alterOrder?id=' + e.currentTarget.dataset.id + '&money=' + e.currentTarget.dataset.money,
        })
    },

    alterOrder2(){
        wx.switchTab({
            url: '/pages/doctor/myHome/myHome'
        })
    }
})