var app = getApp(),
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

    port(){
        const that = this
     
        port.get("member/getqrcode/get_data", {
            param: { openid: that.data.openid }
        }, function (res) {
            console.log(res)
            that.setData({
                file_url: res.file_url,
                show: true
            })
        })
    },

    img(e){
        wx.previewImage({
            current: e.currentTarget.dataset.img, 
            urls: [e.currentTarget.dataset.img] 
        })
    }

})