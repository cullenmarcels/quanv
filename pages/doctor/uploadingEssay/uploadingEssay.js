var app = getApp(),
    port = app.requirejs("core")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        charge: 0,
        display:'显示',
        displays: false,
        value:'',
        images: '',
        imgs: '',
        essey:[],
        frontImages: '',
        frontImgs: '',
        article_introduction: '',
        article_title: '',
        amend:false,
        show: false,
        click: '查看图片'
    },

    // 是否收费选中
    charge: function (e) {
        // console.log(e.currentTarget.dataset.chargestate)
        e.currentTarget.dataset.chargestate == 'yes' ? (
            this.setData({
                charge: 1
            })
        ) : (
                this.setData({
                    charge: 0
                })
            )
    },

    onLoad: function (options) {
        const that = this
        let id
        options.id?(
            id = options.id,
            port.get("articles/article_detail", {
                param:{
                    id: options.id,
                    openid: app.getCache("userinfo").openid
                }
            }, function (res) {
                console.log(res)
                if (res.error == 0) {
                    let charge
                    if (res.res.money == 0){
                        charge = 0
                    }else{
                        charge = 1
                    }
                    that.setData({
                        essey: res.res.article_content,
                        article_title: res.res.article_title,
                        article_introduction: res.res.article_introduction,
                        frontImgs: res.res.cover_url,
                        charge: charge,
                        money: res.res.money,
                        tag: res.res.tag
                    })
                }
            })
        ):(
            id = ''
        )
        
        this.setData({
            id: id,
            openid: app.getCache("userinfo").openid,
            show: true
        })
    },


    // 文章标题
    bindinput: function(e){
        this.setData({
            article_title: e.detail.value
        })
    },

    // 文章简介
    textarea: function(e){
        this.setData({
            article_introduction: e.detail.value
        })
    },

    money(e){
        this.setData({
            money: e.detail.value
        })
    },

    // 点击显示隐藏文章排版内容
    display: function(){
        !this.data.displays?(
            this.data.display = '隐藏'
        ):(
            this.data.display = '显示'
        )
        this.setData({
            displays: !this.data.displays,
            display: this.data.display
        })
    },

    // 保存内容
    bindFormSubmit: function (e) {
        !e.detail.value.textarea?(
            wx.showToast({
                title: '请先输入内容',
                icon: 'none',
            })
        ):(
            this.data.index ? (
                    this.data.essey[this.data.index] = { text: e.detail.value.textarea, state: 'text' }
            ) : (
                    this.data.essey.push({ text: e.detail.value.textarea, state: 'text' })
                ),
            this.setData({
                essey: this.data.essey,
                value: '',
                index:'',
                amend: false
            })
        )
    },

    // 上传图片
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
        }) : "image-remove" == s ? (r='', n='', a.setData({
            images: r,
            imgs: n
        })) : "image-preview" == s && wx.previewImage({
            current: [n],
            urls: [n]
        })
    },

    submitImg: function(){
        !this.data.imgs[0]?(
            wx.showToast({
                title: '请先选择图片',
                icon: 'none',
            })
        ):(
            this.data.index ? (
                    this.data.essey[this.data.index] = { img: this.data.imgs, state: 'img', tactful: 0, click: 0 }
            ) : (
                        this.data.essey.push({ img: this.data.imgs, state: 'img', tactful: 0, click: 0 })
                ),
            this.setData({
                essey: this.data.essey,
                imgs: '',
                index: '',
                amend: false
            })
        )
    },

    tactful(){
        !this.data.imgs[0] ? (
            wx.showToast({
                title: '请先选择图片',
                icon: 'none',
            })
        ) : (
                this.data.index ? (
                    this.data.essey[this.data.index] = { img: this.data.imgs, state: 'img', tactful: 1, click: 1}
                ) : (
                        this.data.essey.push({ img: this.data.imgs, state: 'img', tactful: 1, click: 1})
                    ),
                this.setData({
                    essey: this.data.essey,
                    imgs: '',
                    index: '',
                    amend: false
                })
            )
    },

    imgShow(e){
        console.log(e.currentTarget.dataset.imgshowindex)
        let newEssey = this.data.essey
        let click
        if (newEssey[e.currentTarget.dataset.imgshowindex].tactful){
            newEssey[e.currentTarget.dataset.imgshowindex].tactful = 0
            click = '隐藏此图片'
        }else{
            newEssey[e.currentTarget.dataset.imgshowindex].tactful = 1
            click = '查看图片'
        }
        this.setData({
            essey: newEssey,
            click: click
        })
    },

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
        }) : "image-remove" == s ? (r='', n='', that.setData({
            frontImages: r,
            frontImgs: n
        })) : "image-preview" == s && wx.previewImage({
            current: [n],
            urls: [n]
        })
    },

    tag(e){
        this.setData({
            tag: e.detail.value
        })
    },

    submit: function(){
        let id
        let param = {}
        this.data.id?(
            id = this.data.id
        ):(
            id = ''
        )

        let money
        !this.data.article_title?(
            wx.showToast({
                title: '请输入标题',
                icon: 'none',
            })
        ):(
            !this.data.article_introduction?(
                wx.showToast({
                    title: '请输入简介',
                    icon: 'none',
                })
            ):(
                !this.data.frontImgs? (
                    wx.showToast({
                        title: '请设置封面',
                        icon: 'none',
                    })
                ) : ( 
                    this.data.essey.length == 0 ?(
                    wx.showToast({
                        title: '请输入内容',
                        icon: 'none',
                    })
                ):(
                    this.data.charge == 1?(
                        this.data.money?(
                            money = this.data.money
                        ):(
                            wx.showToast({
                                title: '请输入价钱',
                                icon: 'none'
                            })
                        )
                    ):(
                        money = 0
                    ),

                    param.id = id,
                    param.article_title = this.data.article_title,
                    param.article_introduction = this.data.article_introduction,
                    param.article_content = this.data.essey,
                    param.cover_url = this.data.frontImgs,
                    param.openid = this.data.openid,
                    param.money = money,
                    param.tag = this.data.tag,
                    console.log(param),
                    port.post("articles/add_article", {
                        param: param
                    }, function (res) {
                        if(res.error == 0){
                            wx.showToast({
                                title: '提交审核成功',
                                icon: 'success',
                            },
                                id?(
                                    wx.navigateBack({
                                        delta: 2
                                    })
                                ):(
                                    wx.navigateBack({
                                        delta: 1
                                    })
                                )
                            )   
                        }
                    })
                ))
            )
        )
    },

    radioChange: function(e){
        if (this.data.essey[e.detail.value].state == 'text'){
            this.data.value = this.data.essey[e.detail.value].text
            this.setData({
                value: this.data.value,
                index: e.detail.value
            })
        }else{
            this.data.imgs = this.data.essey[e.detail.value].img
            this.setData({
                imgs: this.data.imgs,
                index: e.detail.value
            })
        }
    },

    amend:function(){
        this.setData({
            amend: !this.data.amend
        })
    },

    btnclose(){
        let newessey = []
        for (var i = 0; i < this.data.essey.length;i++){
            if (i != this.data.index){
                newessey.push(this.data.essey[i])
            }
        }
        this.setData({
            essey: newessey
        })
    }
})