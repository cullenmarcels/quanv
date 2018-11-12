var app = getApp(),
    port = app.requirejs("core")

Page({

    data: {
        frontImages: [],
        frontImgs: [],
        show: false
    },

    onLoad: function (options) {
        this.setData({
            openid: app.getCache("userinfo").openid
        })
        this.examine()
    },

    examine: function () {
        const that = this
        port.get("member/doctors/get_data", {
            param: { openid: that.data.openid }
        }, function (res) {
            if (res.error == 0) {
            let frontImgs
                if(res.list.practice){
                    frontImgs = res.list.practice
                }else{
                    frontImgs = []
                }
                that.setData({
                    newfrontImgs: res.list.practice,
                    frontImgs: frontImgs,
                    show: true
                })
            }
        })
    },

    upload: function (t) {
        var that = this,
            i = port.data(t),
            s = i.type,
            r = that.data.frontImages,
            n = that.data.frontImgs,
            o = i.index;

        "image" == s ? port.upload(function (t) {
            r.push(t.filename),
                n.push(t.url),
                that.setData({
                    frontImages: r,
                    frontImgs: n
                })
        }) : "image-remove" == s ? (r.splice(o, 1), n.splice(o, 1), that.setData({
            frontImages: r,
            frontImgs: n
        })) : "image-preview" == s && wx.previewImage({
            current: n[o],
            urls: n
        })
    },

    submit:function(){
        const that = this
        let arr
        !this.data.frontImgs[0]?(
            wx.showToast({
                title: '请上传执业医生证',
                icon: 'none'
            })
        ):(
            arr = {practice: this.data.frontImgs[0], type: 2, openid: this.data.openid },
            console.log(arr),
            port.get("member/doctors/update", {
                param: arr
            }, function (res) {
                    console.log(res)
                res.status == 1 ? (
                    wx.showToast({
                        title: '上传成功',
                        icon: 'success'
                    },
                        that.examine()
                    )
                ) : (
                        wx.showToast({
                            title: '上传失败',
                            icon: 'success'
                        })
                    )
            })
        )
    }
})