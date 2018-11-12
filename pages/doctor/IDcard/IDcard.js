var app = getApp(),
    port = app.requirejs("core")
    
Page({

    data: {
        tempFilePaths: "",
        frontImages: [],
        frontImgs: [],
        againstImages: [],
        againstImgs: [],
        show: false
    },

    // 正面
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

    // 反面
    againstupload: function (t) {
        var that = this,
            i = port.data(t),
            s = i.type,
            r = that.data.againstImages,
            n = that.data.againstImgs,
            o = i.index;

        "image" == s ? port.upload(function (t) {
            r.push(t.filename),
                n.push(t.url),
                that.setData({
                againstImages: r,
                againstImgs: n
                })
        }) : "image-remove" == s ? (r.splice(o, 1), n.splice(o, 1), that.setData({
                againstImages: r,
                againstImgs: n
        })) : "image-preview" == s && wx.previewImage({
            current: n[o],
            urls: n
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
         this.setData({
             openid: app.getCache("userinfo").openid
         })
         this.examine()
    },

    examine: function(){
        const that = this
        
        port.get("member/doctors/get_data", {
            param: { openid: that.data.openid}
        }, function (res) {
            console.log(res)
            if(res.error == 0){
                let front
                if (res.list.id_card.front){
                    front = [res.list.id_card.front]
                }else{
                    front = []
                }
                let verso
                if (res.list.id_card.verso){
                    verso = [res.list.id_card.verso]
                }else{
                    verso = []
                }
                that.setData({
                    isfront: res.list.id_card.front,
                    isverso: res.list.id_card.verso,
                    frontImgs: front,
                    againstImgs: verso,
                    show: true
                })
            }
        })
    },

    submit: function(){
        const that = this
        let arr 
        !that.data.frontImgs[0] ?(
            wx.showToast({
                title: '请上传正面',
                icon: 'none'
            })
        ):(
            !that.data.againstImgs[0]?(
                wx.showToast({
                    title: '请上传反面',
                    icon: 'none'
                })
            ):(
                        arr = { verso: that.data.againstImgs[0], front: that.data.frontImgs[0], type: 1, openid: that.data.openid},
                port.get("member/doctors/update", {
                    param: arr
                }, function (res) {
                    console.log(res)
                    res.status == 1?(
                        wx.showToast({
                            title: '上传成功',
                            icon: 'success'
                        },
                            that.examine()
                        )
                    ):(
                        wx.showToast({
                            title: '上传失败',
                            icon: 'success'
                        })
                    )
                })
            )
        )
    }
})