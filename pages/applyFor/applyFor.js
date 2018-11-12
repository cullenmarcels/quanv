const app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
    
    },

    onLoad: function (options) {
        this.setData({
            openid: app.getCache("userinfo").openid
        })
    },

    
    hint2(){
        wx.navigateTo({
            url: '/pages/essayList/essayList',
        })
    },


    setapplyFor(){
        wx.redirectTo({
            url: '/pages/setapplyFor/setapplyFor',
        })
    }
})