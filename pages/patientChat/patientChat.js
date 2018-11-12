const app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        // openid: '',  //患者小程序openid
        // gzopenid: ''  //医生公众号openid
     
    },

    onLoad: function (options) {
        this.setData({
            yemian: options.type || 0,
          url: app.globalData.chatapi + '?i=3&c=entry&toopenid='+ options.gzh_openid + '&diaglogid=' + options.diaglogid + '&do=chat&m=v_customerservice&fromopenid=' + app.getCache("userinfo").openid + '#wechat_redirect'
        })
    },
    onUnload(){
        if (this.data.yemian==1){
            wx.navigateBack({
                delta: 3
            })
        }
    }
})