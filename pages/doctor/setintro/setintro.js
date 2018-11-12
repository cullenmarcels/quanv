var app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        items:[
            { type: 0, value: '女' },
            { type: 1, value: '男' },
        ],
        list:[],
        text:'',
        title:'',
        frontImages: '',
        frontImgs: '',
        alter: false,
        sex:'',
        age:'',
        education:'',
        field:'',
        add: false,
        addhospital: false,
        hospitalalter: false,
        index: 0,
        index2: 0,
        hospital:[],
        images: '',
        imgs: '',
    },

    onLoad: function (options) {
        this.setData({
            openid: app.getCache("userinfo").openid
        })
        this.look()
        this.office()
    },

    // 获取科室分类
    office(){
        const that = this
        port.get("newshop/get_category", {}, function (res) {
            let newget_category = [{id:'',name:'所在科室'}]
            for (var i = 0; i < res.category.length;i++){
                for (var j = 0; j < res.category[i].child.length;j++){
                    newget_category.push(res.category[i].child[j])
                }
                newget_category.push(res.category[i])
            }
            
            that.setData({
                newget_category: newget_category
            })
        })
    },

    bindPickerChange: function (e) {
        this.setData({
            index2: e.detail.value
        })
    },

    look(){
        const that = this
        port.post("member/doctors/introduction_detail", {
            param: { openid: that.data.openid }
        }, function (res) {
            console.log(res)
            let items = that.data.items
            for (var i = 0; i < items.length;i++){
                if (items[i].type == res.res.sex){
                    items[i].checked = true
                }else{
                    items[i].checked = false
                }
            }

            for (var i = 0; i < res.res.hospital.length;i++){
                res.res.hospital[i].departmentid = res.res.hospital[i].name
            }
            that.setData({  
                list: res.res.introduce || [],
                items: items,
                age: res.res.age,
                hospital:  res.res.hospital,
                photo: res.res.avatar,
                mobile: res.res.mobile,
                name: res.res.realname,
                resume: res.res.resume,
                imgs: res.res.avatar
            })
        })
    },

    radioChange: function (e) {
        this.setData({
            index: e.detail.value,
            text: this.data.list[e.detail.value].text,
            title: this.data.list[e.detail.value].title,
            frontImgs: [this.data.list[e.detail.value].img],
        })
    },

    hospitalradioChange(e){
        let index
        for (var i = 0; i < this.data.newget_category.length;i++){
            if (this.data.newget_category[i].name == this.data.hospital[e.detail.value].departmentid){
                index = i
            }
        }
        this.setData({
            hospitalindex: e.detail.value,
            index2: index,
            hospitall: this.data.hospital[e.detail.value].hospital,
            job: this.data.hospital[e.detail.value].job,
        })
    },

    sexradio(e){},

    // 上传封面图片
    upload: function (t) {
        var that = this,
            i = port.data(t),
            s = i.type,
            r = that.data.frontImages,
            n = that.data.frontImgs,
            o = i.index;

        "image" == s ? port.upload(function (t) {
            r = t.filename,
                n = t.url,
                that.setData({
                    frontImages: r,
                    frontImgs: n
                })
        }) : "image-remove" == s ? (r = '', n = '', that.setData({
            frontImages: r,
            frontImgs: n
        })) : "image-preview" == s && wx.previewImage({
            current: [n],
            urls: [n]
        })
    },

    submit(e){
        const that = this
        let mPattern = /^1[34578]\d{9}$/
        !e.detail.value.name ?(
            wx.showToast({
                title: '请填写姓名',
                icon: 'loading'
            })
        ):(
            !e.detail.value.sex ? (
                wx.showToast({
                    title: '请填写性别',
                    icon: 'loading'
                })
            ) : (
                !e.detail.value.age ? (
                    wx.showToast({
                        title: '请填写年龄',
                        icon: 'loading'
                    })
                ) : (
                    !e.detail.value.resume ? (
                        wx.showToast({
                            title: '请填写个人介绍',
                            icon: 'loading'
                        })
                    ) : (
                        !mPattern.test(e.detail.value.mobile) && !e.detail.value.mobile? (
                            wx.showToast({
                                title: '联系号码错误',
                                icon: 'loading'
                            })
                        ) : (
                            e.detail.value.introduce = this.data.list,
                            e.detail.value.openid = that.data.openid,
                            e.detail.value.hospital = that.data.hospital,
                            e.detail.value.photo = that.data.imgs,
                          
                            that.data.newget_category.forEach((item, index) => {
                                that.data.hospital.forEach((item1, index1) => {
                                    item.name == item1.departmentid ?(
                                        item1.departmentid = item.id
                                    ):(
                                        console.log()
                                    )         
                                })
                            }),
                            console.log(e.detail.value),
                            port.post("member/doctors/doc_set", {
                                param: e.detail.value
                            }, function (res) {
                                res.status ==1 ? (
                                    wx.showToast({
                                        title: '提交成功',
                                        icon: 'success'
                                    }),
                                    that.look()
                                ) : (
                                        wx.showToast({
                                            title: '提交失败',
                                            icon: 'loading'
                                        })
                                    )
                            })
                        )
                    )
                )
            )
        )
        
    },

    add(){
        this.setData({
            add: true
        })
    },

    addhospital(){
        this.setData({
            addhospital: true
        })
    },

    // 保存任职医院资料
    addhospitalsubmit(e){
       
        if (!e.detail.value.hospital){
            wx.showToast({
                title: '请填写医院',
                icon: 'loading'
            })
        } else if (e.detail.value.departmentid == '所在科室'){
            wx.showToast({
                title: '请选择科室',
                icon: 'loading'
            })
        } else if (!e.detail.value.job){
            wx.showToast({
                title: '请填写职称',
                icon: 'loading'
            })
        }else{
            
            if (this.data.hospitalalter){
                 if (this.data.hospitalindex){
                    this.data.hospital[this.data.hospitalindex] = e.detail.value
                    this.setData({
                        hospital: this.data.hospital,
                        addhospital: false,
                        hospitalalter: false
                    })
                }else{
                    wx.showToast({
                        title: '请先选择修改项',
                        icon: 'loading'
                    })
                }
            }else{
                this.setData({
                    hospital: this.data.hospital.concat(e.detail.value),
                    addhospital: false,
                    hospitalalter: false
                })
            }
            
        }
    },

    // 保存
    formSubmit: function (e) {
        const that = this
        let list = that.data.list
       
        e.detail.value.img = that.data.frontImgs
        if (!e.detail.value.img){
            wx.showToast({
                title: '请上传证书',
                icon:'loading'
            })
        } else if (!e.detail.value.title){
            wx.showToast({
                title: '请填写证书名',
                icon: 'loading'
            })
        } else if (that.data.alter){
            if (list.length == 0){
                wx.showToast({
                    title: '暂无证书内容',
                    icon:'loading'
                })
                that.setData({
                    alter: false
                })
            } else if (!that.data.index){
                wx.showToast({
                    title: '请先选择修改项',
                    icon: 'loading'
                })
            }else{
                list[that.data.index] = e.detail.value
                that.setData({
                    list: list,
                    text: '',
                    title: '',
                    frontImgs: '',
                    add: false,
                    alter: false
                })
            }
        }else{
            list.push(e.detail.value)
            that.setData({
                list: list,
                text: '',
                title: '',
                frontImgs: '',
                add: false,
                alter: false
            })
        }
    },

    alter(){
        let add 
        if (this.data.alter){
            add = false
        }else{
            add = true
        }
        this.setData({
            alter: !this.data.alter,
            add: add
        })
    },

    hospitalalter(){
        let addhospital
        if (this.data.hospitalalter){
            addhospital = false
        }else{
            addhospital = true
        }
        this.setData({
            hospitalalter: !this.data.hospitalalter,
            addhospital: addhospital
        })
    },


    // 上传头像
    upload1: function (t) {
        var a = this,
            i = port.data(t),
            s = i.type,
            r = a.data.images,
            n = a.data.imgs,
            o = i.index;
        // 本地路径转换
        "image" == s ? port.upload(function (t) {
            r = t.filename,
                n = t.url,
                a.setData({
                    images: r,
                    imgs: n
                })
        }) : "image-remove" == s ? (r = '', n = '', a.setData({
            images: r,
            imgs: n
        })) : "image-preview" == s && wx.previewImage({
            current: [n],
            urls: [n]
        })
    },

})