var app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        name: '',
        age: '',
        mobile:'',
        content:'',
        items: [
            { name: '1', value: '男' },
            { name: '0', value: '女' },
        ],
        images: [],
        imgs: [],
       
    },

    onLoad: function (options) {      
        const that = this
        if (options.content) {
            let concent = JSON.parse(options.content)
            let items = this.data.items
            for (var i = 0; i < items.length; i++) {
                if (items[i].name == concent.sex) {
                    items[i].checked = true
                } else {
                    items[i].checked = false
                }
            }
            this.setData({
                name: concent.name,
                age: concent.age,
                mobile: concent.mobile,
                title: concent.title,
                items: items,
                content: concent.content,
                imgs: concent.diag_thumbs,
                id: concent.id,
                style: options.style || '',
                openid: app.getCache("userinfo").openid
            })
        } else {
            this.setData({
                id: '',
                style: options.style || '',
                openid: app.getCache("userinfo").openid
            })
        }
    },

    radioChange: function (e) {},

    lookradio(e){
        let look = this.data.look
        for(var i = 0;i<look.length;i++){
            if (look[i].state == e.detail.value){
                look[i].checked = true
            }else{
                look[i].checked = false
            }
        }

        this.setData({
            look: look
        })
    },

    upload: function (t) {
        var a = this,
            i = port.data(t),
            s = i.type,
            r = a.data.images,
            n = a.data.imgs,
            o = i.index;
        "image" == s ? port.upload(function (t) {
            r.push(t.filename)
                n.push(t.url)
                if(r.length>9){
                    r.length = 9
                }
                if (n.length > 9) {
                    n.length = 9
                }

                a.setData({
                    images: r,
                    imgs: n
                })
        }) : "image-remove" == s ? (r.splice(o, 1), n.splice(o, 1), a.setData({
            images: r,
            imgs: n
        })) : "image-preview" == s && wx.previewImage({
            current: n[o],
            urls: n
        })
    },

    formSubmit: function (e) {
        const that = this
        let mPattern = /^1[34578]\d{9}$/
        !e.detail.value.age || !e.detail.value.content || !e.detail.value.mobile || !e.detail.value.name || !e.detail.value.sex?(
            wx.showToast({
                title: '请先完善资料',
                icon: 'loading'
            })
        ):(
         !mPattern.test(e.detail.value.mobile)?(
                wx.showToast({
                    title: '号码格式错误',
                    icon: 'loading'
                })
            ):(
                e.detail.value.diag_thumbs = that.data.imgs,
                e.detail.value.openid = that.data.openid,
                e.detail.value.id = that.data.id,
                port.post("member/patients/edit_diag", {
                    param: e.detail.value
                }, function (res) {
                    if(res.res == 1){
                        wx.showToast({
                            title: '添加成功',
                            icon: 'success'
                        },
                            wx,wx.navigateBack({
                                delta: 1,
                            })
                        )
                    }else{
                        wx.showToast({
                            title: '添加失败',
                            icon: 'loading'
                        })
                    }
                })
            )
        )
    },
})