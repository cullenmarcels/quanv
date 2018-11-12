const app = getApp(),
    port = app.requirejs("core")
Page({


    data: {
    
    },

    onLoad: function (options) {
        this.setData({
          url: app.globalData.api +'&c=entry&m=rr_vv3&do=mobile&r=diypage&id=23'
        })
    },

})