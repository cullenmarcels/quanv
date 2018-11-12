const app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        all: false,
        classify: '科室查找',
        navActive: 1,
        imgUrls: [],
        page: 0,
        list: [],
        bottom: true,
        display: false,
        value:'',
        show: false,
        doc_openid: '',
        timestamp: 0
    },

    onLoad: function (options) {
        this.get_category()
        if (options.doc_openid){
            this.setData({
                doc_openid: options.doc_openid
            })
        }
        
        let e = { type: this.data.navActive}
        this.banner()
        this.list(e)
        this.hot()
    },

    banner() {
        const that = this
        port.get("member/doctors/hot_data", {
            param: { type: 1}
        }, function (res) {
            that.setData({
                imgUrls: res.list
            })
        })
    },

    hot(){
        const that = this
        port.get("hotsearch/hotkeyword", {
            param: {type: 2}
        }, function (res) {
            res.hotkeyword.unshift({content:'推荐所有'})
            that.setData({
                get_search: res.hotkeyword
            })
        })
    },

    illness(event){
       
        if (event.currentTarget.dataset.content == '推荐所有'){
            this.setData({
                page: 0,
                list: [],
                bottom: true,
                disply: false,
                all: false,
                classify: '科室查找',
                value: ''
            })
        }else{
            this.setData({
                page: 0,
                list: [],
                bottom: true,
                disply: false,
                all: false,
                classify: '科室查找',
                value: event.currentTarget.dataset.content
            })
        }
        
        let e = { type: this.data.navActive }
        this.list(e)
    },

    list(e){
        const that = this
        e.pageSize = 20
        e.page = this.data.page + 1
        if (this.data.value){
            e.keyword = this.data.value
        } else if (this.data.classify != '科室查找'){
            e.keyword = this.data.classifyid
        }else{
            e.keyword = ''
        }
  
        if (this.data.bottom) {
            port.get("articles/search_articles", {
                param: e
            }, function (res) {
                if (res.error == 0) {
                    if (res.list.length == 0) {
                        return that.setData({
                            bottom: false,
                            display: true,
                            show: true
                        })
                    } else {
                        that.setData({
                            list: that.data.list.concat(res.list),
                            page: e.page,
                            display: true,
                            show: true
                        })
                    }
                }
            })
        }
    },
  
    onReachBottom: function () {
        let e = { type: this.data.navActive }
        this.list(e)
    },


    all: function () {
        this.setData({
            all: !this.data.all
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
        if (this.data.classify == '分类搜索'){
            this.setData({
                photoLiid: event.currentTarget.dataset.id,
                page: 0,
                list: [],
                bottom: true,
                disply: false,
                all: false,
                classify: event.currentTarget.dataset.name,
                classifyid: event.currentTarget.dataset.id,
                value: ''
            })
            let e = { type: this.data.navActive }
            this.list(e)
        }else{
            if (event.currentTarget.dataset.id != this.data.photoLiid) {
                this.setData({
                    photoLiid: event.currentTarget.dataset.id,
                    page: 0,
                    list: [],
                    bottom: true,
                    disply: false,
                    all: false,
                    classify: event.currentTarget.dataset.name,
                    classifyid: event.currentTarget.dataset.id,
                    value: ''
                })
                let e = { type: this.data.navActive }
                this.list(e)
            } else {
                this.setData({
                    all: false,
                })
            }
        }
    },

    nav(event){

        let date = Date.parse(new Date())
        if (event.currentTarget.dataset.kind != this.data.navActive && (this.data.timestamp+500 < date)) {
            this.setData({
                navActive: event.currentTarget.dataset.kind,
                timestamp: date,
                page: 0,
                list: [],
                bottom: true,
                display: false
            })
            let e = { type: Number(event.currentTarget.dataset.kind) }
            this.list(e)
        }
    },

    // 文章详情
    essayShow: function (e) {
        wx.navigateTo({
            url: '/pages/essayShow/essayShow?id=' + e.currentTarget.dataset.id,
        })
    },

    // input输入
    bindinput(e) {
        this.setData({
            value: e.detail.value
        })
    },

    // 点击搜索
    input() {
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        !re.test(this.data.value) && this.data.value ? (
            this.setData({
                classify: '科室查找',
                value: this.data.value,
                page: 0,
                list: [],
                bottom: true,
                disply: false
            }),
            event = { type: this.data.navActive },
            this.list(event)
        ) : (
                wx.showToast({
                    title: '请输入内容',
                    icon: 'loading'
                })
            )
    },

    // 键盘的完成
    bindconfirm(e) {
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        var event
        !re.test(e.detail.value) && e.detail.value ? (
            this.setData({
                classify: '科室查找',
                value: e.detail.value,
                page: 0,
                list: [],
                bottom: true,
                disply: false
            }),
            event = { type: this.data.navActive},
            this.list(event)
        ) : (
                wx.showToast({
                    title: '请输入内容',
                    icon: 'loading'
                })
            )
    },

    imagesHeight: function (t) {
        var a = t.detail.width,
            e = t.detail.height,
            o = t.target.dataset.type,
            i = {},
            s = this;
        wx.getSystemInfo({
            success: function (t) {
                i[o] = t.windowWidth / a * e,
                    (!s.data[o] || s.data[o] && i[o] < s.data[o]) && s.setData(i)
            }
        })
    },
})