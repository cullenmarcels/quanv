var app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        realname: '',
        mobile: '',
        hospital: '',
        job: '',
        array: [],
        index2: 0,
        ID: false,
        certification: false,
        doctorCertificate: false,
        justIDimgs: [],
        justIDimages: [],
        backIDimgs: [],
        backIDimages: [],
        certificationimages: [],
        certificationimgs: [],
        doctorCertificateimages: [],
        doctorCertificateimgs: [],
        show: false,
        avatar: ''
    },

    // 科室选择
    bindPickerChange: function (e) {
        this.setData({
            index2: e.detail.value
        })
    },


    onLoad: function (options) {
        this.setData({
            openid: app.getCache("userinfo").openid
        })
        this.get_data()
        this.get_doc_apply()
    },

    onShow() {
        this.status()
    },

    // 获取提交数据
    get_doc_apply() {
        const that = this
        port.post("member/identity/get_doc_apply", {
            param: {
                openid: that.data.openid
            }
        }, function (res) {
            if (res.list.length != 0) {
                let index2
                that.data.array.forEach(function (item, index) {
                    if (item.id == res.list.parentid) {
                        index2 = index
                    }
                })
                let front, verso
                if (res.list.id_card.front) {
                    front = [res.list.id_card.front]
                } else {
                    front = []
                }
                if (res.list.id_card.verso) {
                    verso = [res.list.id_card.verso]
                } else {
                    verso = []
                }

                that.setData({
                    avatar: res.list.avatar || '',
                    realname: res.list.realname || '',
                    mobile: res.list.mobile || '',
                    hospital: res.list.hospital || '',
                    job: res.list.job || '',
                    index2: index2 || 0,
                    justIDimgs: front,
                    backIDimgs: verso,
                    certificationimgs: res.list.doctor_certificate || [],
                    doctorCertificateimgs: res.list.practice_doctors_certificate || [],
                    reject: res.list.reject || '',
                    show: true
                })
            } else {
                that.setData({
                    show: true
                })
            }
        })
    },


    // 获取科室分类
    get_data() {
        const that = this
        let array = [{ name: '请选择您所在的科室', id: 'a' }]
        port.get("newshop/get_category", {}, function (res) {
            // 循环科室
            res.category.forEach(function (item) {
                array.push(item)
                item.child.forEach(function (childitem) {
                    array.push(childitem)
                })
            })
            that.setData({
                array: array
            })
        })
    },


    // 提交
    formSubmit: function (e) {
        const that = this
        let mPattern = /^1[34578]\d{9}$/
        e.detail.value.doctor_certificate = that.data.certificationimgs
        e.detail.value.practice_doctors_certificate = that.data.doctorCertificateimgs
        e.detail.value.front = that.data.justIDimgs[0]
        e.detail.value.verso = that.data.backIDimgs[0]
        e.detail.value.identity = 1
        e.detail.value.avatar = that.data.avatar
        if (!e.detail.value.avatar){
            wx.showToast({
                title: '请上传头像',
                icon: 'loading'
            })
        }else if (!e.detail.value.realname) {
            wx.showToast({
                title: '请输入真实姓名',
                icon: 'loading'
            })
        } else if (!mPattern.test(e.detail.value.mobile) || !e.detail.value.mobile) {
            wx.showToast({
                title: '请填写正确电话',
                icon: 'loading'
            })
        } else if (!e.detail.value.hospital) {
            wx.showToast({
                title: '请填写任职医院',
                icon: 'loading'
            })
        } else if (!e.detail.value.job) {
            wx.showToast({
                title: '请填写职称',
                icon: 'loading'
            })
        } else if (e.detail.value.departid == 'a') {
            wx.showToast({
                title: '请选择所在科室',
                icon: 'loading'
            })
        } else if (!e.detail.value.front) {
            wx.showToast({
                title: '上传身份证正面',
                icon: 'loading'
            })
        } else if (!e.detail.value.verso) {
            wx.showToast({
                title: '上传身份证反面',
                icon: 'loading'
            })
        } else if (e.detail.value.doctor_certificate.length == 0) {
            wx.showToast({
                title: '上传医生资格证',
                icon: 'loading'
            })
        } else if (e.detail.value.practice_doctors_certificate.length == 0) {
            wx.showToast({
                title: '上传执业医生证',
                icon: 'loading'
            })
        } else {
            e.detail.value.openid = that.data.openid
            port.post("member/identity/doc_apply", {
                param: e.detail.value
            }, function (res) {
                if (res.status == 1) {
                    wx.showToast({
                        title: '提交成功',
                        icon: 'success'
                    },
                      that.get_doc_apply(),
                        wx.navigateTo({
                            url: '/pages/applyForshow/applyForshow',
                        })
                    )
                }
            })
        }
    },

    // 上传身份证正面
    justupload: function (t) {
        var a = this,
            i = port.data(t),
            s = i.type,
            r = a.data.justIDimages,
            n = a.data.justIDimgs,
            o = i.index;
        "image" == s ? port.upload(function (t) {
            r.push(t.filename),
                n.push(t.url),
                a.setData({
                    justIDimages: r,
                    justIDimgs: n
                })
        }) : "image-remove" == s ? (r.splice(o, 1), n.splice(o, 1), a.setData({
            justIDimages: r,
            justIDimgs: n
        })) : "image-preview" == s && wx.previewImage({
            current: n[o],
            urls: n
        })
    },

    // 上传身份证反面
    backupload: function (t) {
        var a = this,
            i = port.data(t),
            s = i.type,
            r = a.data.backIDimages,
            n = a.data.backIDimgs,
            o = i.index;
        "image" == s ? port.upload(function (t) {
            r.push(t.filename),
                n.push(t.url),
                a.setData({
                    backIDimages: r,
                    backIDimgs: n
                })
        }) : "image-remove" == s ? (r.splice(o, 1), n.splice(o, 1), a.setData({
            backIDimages: r,
            backIDimgs: n
        })) : "image-preview" == s && wx.previewImage({
            current: n[o],
            urls: n
        })
    },

    // 上传医生资格证
    certificationupload: function (t) {
        var a = this,
            i = port.data(t),
            s = i.type,
            r = a.data.certificationimages,
            n = a.data.certificationimgs,
            o = i.index;
        "image" == s ? port.upload(function (t) {

            r.push(t.filename),
                n.push(t.url),
                a.setData({
                    certificationimages: r,
                    certificationimgs: n
                })
        }) : "image-remove" == s ? (r.splice(o, 1), n.splice(o, 1), a.setData({
            certificationimages: r,
            certificationimgs: n
        })) : "image-preview" == s && wx.previewImage({
            current: n[o],
            urls: n
        })
    },

    // 上传执业医生证
    doctorCertificateupload: function (t) {
        var a = this,
            i = port.data(t),
            s = i.type,
            r = a.data.doctorCertificateimages,
            n = a.data.doctorCertificateimgs,
            o = i.index;
        "image" == s ? port.upload(function (t) {
            r.push(t.filename),
                n.push(t.url),
                a.setData({
                    doctorCertificateimages: r,
                    doctorCertificateimgs: n
                })
        }) : "image-remove" == s ? (r.splice(o, 1), n.splice(o, 1), a.setData({
            doctorCertificateimages: r,
            doctorCertificateimgs: n
        })) : "image-preview" == s && wx.previewImage({
            current: n[o],
            urls: n
        })
    },


    // 点击上传身份证
    ID() {
        this.setData({
            ID: !this.data.ID
        })
    },

    // 点击上传医生资格证
    certification() {
        this.setData({
            certification: !this.data.certification
        })
    },

    // 点击上传执业医生证
    doctorCertificate() {
        this.setData({
            doctorCertificate: !this.data.doctorCertificate
        })
    },

    // 申请状态
    status() {
        const that = this
        port.get("member/identity/get_data", {
            param: {
                openid: that.data.openid
            }
        }, function (res) {
            that.setData({
                isaudit: res.list.isaudit
            })
        })
    },

    clickhead(t) {
        var a = this,
            i = port.data(t),
            s = i.type,
            r = a.data.images,
            n = a.data.avatar,
            o = i.index;
        "image" == s ? port.upload(function (t) {
            a.setData({
                images: t.filename,
                avatar: t.url
            })
        }) : (console.log())
    }
})