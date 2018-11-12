var app = getApp(),
    port = app.requirejs("core")
Page({
    data: {
        
    },

    onLoad: function (options) {
        this.setData({
          url: app.globalData.chatapi + '?i=3&c=entry&toopenid=' + options.fansopenid + '&do=servicechat&m=v_customerservice&fromopenid=' + app.getCache("userinfo").openid + '&diaglogid=' + options.diaglogid+'#wechat_redirect' 
        })
    },

})