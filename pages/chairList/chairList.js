var app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        item: {
            shu: false,
            index: 0,
            nav: ['本月开讲', '下月举办', '往期记录'],
            title: ['', '']
        },
        page: 0,
        list: [],
        bottom: true,
        display: false,
        show: false,
        timestamp: 0,
    },

    onLoad: function (options) {
        this.setData({
            openid: app.getCache("userinfo").openid
        })
    },

    onShow(){
        this.setData({
            page: 0,
            list: [],
            bottom: true,
            display: false,
            show: false,
        })
        this.lectures()
    },

    lectures: function () {
        const that = this
        let e ={}
        e.pageSize = 30,
        e.type = Number(that.data.item.index)+1
        e.page = this.data.page + 1,
        e.openid = that.data.openid
        if (this.data.bottom) {
            port.get("vindex/more_lectures", {
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

    // 栏目切换
    nav: function (event) {
        let date = Date.parse(new Date())
        if (this.data.item.index != event.currentTarget.dataset.id && (this.data.timestamp + 500 < date)){
            this.data.item.index = event.currentTarget.dataset.id
            this.setData({
                item: this.data.item,
                page: 0,
                timestamp: date,
                list: [],
                bottom: true,
                display: false
            })
            this.lectures()
        }
    },

    onReachBottom: function () {
        this.lectures()
    },

    apply(e){
        wx.navigateTo({
            url: '/pages/chairShow/chairShow?id=' + e.currentTarget.dataset.id,
        })
    }
    
})