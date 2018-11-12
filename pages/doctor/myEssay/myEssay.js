const app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        item: {
            index: 0,
            nav: ['全部文章', '审核文章']
        },
        page: 0,
        list: [],
        bottom: true,
        disply: false,
        show: false,
        timestamp: 0
    },


    onLoad: function (options) {
        const that = this
        this.setData({
            openid: app.getCache("userinfo").openid
        })
    },

    onShow(){
        this.setData({
            page: 0,
            list: [],
            bottom: true,
            disply: false
        })
        this.lectures()
        this.get_article_list_total()
    },

    get_article_list_total(){
        const that = this
        port.get("articles/get_article_list_total", {
            param: { openid:that.data.openid}
        }, function (res) {
            let release = res.total.release
            let audit = res.total.audit
            if (Number(release) > 99) {
                release = '99+'
            }
            if (Number(audit) > 99) {
                audit = '99+'
            }
            that.data.item.nav = ['全部文章(' + release + ')', '审核文章(' + audit + ')']
           
            that.setData({
                item: that.data.item
            })
        })
    },


    onReachBottom: function () {
        this.lectures()
    },

    // 栏目切换
    nav: function (event) {
        const that = this
        let date = Date.parse(new Date())
        if (event.currentTarget.dataset.id != this.data.item.index && (this.data.timestamp + 300 < date)){
            this.data.item.index = event.currentTarget.dataset.id
            this.setData({
                item: this.data.item,
                page: 0,
                list: [],
                timestamp: date,
                bottom: true,
                disply: false
            })
            this.lectures()
        }
    },

    lectures: function () {
        const that = this
        let e = {}
        if(that.data.item.index == 0){
            e.type = 1
        }else{
            e.type = 0
        }
        e.pageSize = 10
        e.openid = that.data.openid
        e.page = this.data.page + 1
        if (this.data.bottom) {
            port.get("articles/get_article_list", {
                param: e
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
                            page: e.page,
                            disply: false,
                            show: true
                        })
                    }
                }
            })
        }

    },

    // 上传文章
    uploadingEssay: function(){
        wx.navigateTo({
            url: '/pages/doctor/uploadingEssay/uploadingEssay',
        })
    },

    // 文章详情
    essayShow: function (e) {
        if(this.data.item.index == 0){
            wx.navigateTo({
                url: '/pages/essayShow/essayShow?id=' + e.currentTarget.dataset.id,
            })
        }else{
            wx.navigateTo({
                url: '/pages/doctor/essayShow/essayShow?id=' + e.currentTarget.dataset.id,
            })
        }
    }
})