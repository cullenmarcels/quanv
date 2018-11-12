const app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        all: false,
        bottom: true,
        photoLiid: 'a',
        page: 0,
        disply: false,
        list:[],
        show: false,
        className: '分类查找',
        value:'',
        id:'',
        timestamp: 0
    },

    onLoad: function (options) {
        this.setData({
            openid2: 'sns_wa_' + app.getCache("userinfo").openid
        })
        this.get_search()
        this.get_category()
        this.portdoctor()
    },

    bindinput(event){
        this.setData({
            value: event.detail.value
        })
    },

    // 点击搜索
    search(){
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        !re.test(this.data.value) && this.data.value ? (
            this.setData({
                value: this.data.value,
                id: '',
                className: '分类查找',
                photoLiid: '',
                bottom: true,
                page: 0,
                list: [],
                disply: false,
                all: false,
            }),
            this.portdoctor()
        ) : (
                wx.showToast({
                    title: '请输入内容',
                    icon: 'loading'
                })
            )
    },

    // 输入框点击完成按钮
    bindconfirm(event){
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        !re.test(event.detail.value) && event.detail.value?(
            this.setData({
                value: event.detail.value,
                id: '',
                className: '分类查找',
                photoLiid: '',
                bottom: true,
                page: 0,
                list: [],
                disply: false,
                all: false,
            }),
            this.portdoctor()
        ):(
            wx.showToast({
                title: '请输入内容',
                icon:'loading'
            })
        )
    },

    // 调取医生列表
    portdoctor(){
        const that = this
        let  param = {}
        param.pageSize = 20
        param.page = this.data.page + 1
        if(that.data.value){
            param.keyword = that.data.value
            param.type = 1
        } else if (that.data.id && that.data.id != 'a'){
            param.keyword = that.data.id
            param.type = 3
        }else{
            param.keyword = ''
            param.type = 2
        }

        if (this.data.bottom) {
            port.get("vindex/search", {
                param: param
            }, function (res) {
                if (res.error == 0) {
                    if (res.list.length == 0) {
                        return that.setData({
                                bottom: false,
                                disply: true,
                                show: true
                            })
                    } else {
                        that.setData({
                            list: that.data.list.concat(res.list),
                            page: param.page,
                            disply: false,
                            show: true
                        })
                    }
                }
            })
        }
    },

    // 获取热门搜索
    get_search: function () {
        const that = this
        port.get("hotsearch/hotkeyword", {
            param: { type: 3}   
        }, function (res) {
            if (res.error == 0) {
                that.setData({
                    hotkeyword: res.hotkeyword
                })
            }
        })
    },

    // 获取科室分类
    get_category: function () {
        const that = this
        port.get("newshop/get_category", {}, function (res) {
            let newLi = [{ id: 'a', name: '推荐医生' }]
            if (res.error == 0) {
                that.setData({
                    scroll: newLi.concat(res.category),
                    get_categoryId: res.category[0].id,
                    son_get_category: res.category[0].child,
                    get_category: res.category,
                })
            }
        })
    },
    
    // 点击分类大类
    li: function (e) {
        this.setData({
            get_categoryId: e.currentTarget.dataset.item.id,
            son_get_category: e.currentTarget.dataset.item.child
        })
    },

    // 点击分类小类
    show: function (event) {
        if (event.currentTarget.dataset.id != this.data.photoLiid) {
            this.setData({
                photoLiid: event.currentTarget.dataset.id,
                id: event.currentTarget.dataset.id,
                value:'',
                page: 0,
                list: [],
                bottom: true,
                disply: false,
                all: false,
                className: event.currentTarget.dataset.name,
            })
            this.portdoctor()
        }
    },

    // 点击常见疾病
    illness: function (e) {
        this.setData({
            id: '',
            photoLiid:'',
            value: e.currentTarget.dataset.content,
            all: false,
            page: 0,
            list: [],
            bottom: true,
            disply: false,
        })
        this.portdoctor()
    },

    all: function(){
        this.setData({
            all: !this.data.all
        })
    },

    // 点击选中科室
    office: function(e){
        this.setData({
            clickid: e.currentTarget.dataset.id
        })
    },

    // 点击推荐医生一栏
    photoLi:function(event){
        let newName
        if (event.currentTarget.dataset.name == '推荐医生'){
            newName = '分类查找'
        }else{
            newName = event.currentTarget.dataset.name
        }
        let date = Date.parse(new Date())
        if (event.currentTarget.dataset.id != this.data.photoLiid && (this.data.timestamp + 300 < date)){
            this.setData({
                photoLiid: event.currentTarget.dataset.id,
                id: event.currentTarget.dataset.id,
                value: '',
                page: 0,
                timestamp: date,
                list: [],
                bottom: true,
                disply: false,
                className: newName
            })
            this.portdoctor()
        }
    },

    onReachBottom: function () {
        this.portdoctor()
    },

    preventTouchMove: function () {},

    doctor: function(e){
        wx.navigateTo({
            url: '/pages/patient/doctor/doctor?openid=' + e.currentTarget.dataset.openid,
        })
    }
})