var app = getApp(),
    port = app.requirejs("core")
Page({
    data: {
        item: {
            index: 0,
            nav: ['视频', '文章'],
            title: ['','']
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
        this.port()
    },

    nav: function (event) {
        const that = this
        let date = Date.parse(new Date())
        if (this.data.item.index != event.currentTarget.dataset.id && (this.data.timestamp + 300 < date)){
            this.data.item.index = event.currentTarget.dataset.id
            this.setData({
                item: this.data.item,
                page: 0,
                list: [],
                timestamp: date,
                bottom: true,
                display: false,
            })
            this.port()
        }
    },

    port(){
        const that = this
        let e = {}
        e.pageSize = 10
        e.page = this.data.page + 1
        e.openid = that.data.openid
        if (that.data.item.index == 0){
            e.type = 2
        } else if (that.data.item.index == 1){
            e.type = 3
        }

        if (this.data.bottom) {
            port.get("member/patients/my_buy", {
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
        this.port()
    },

    // 文章详情
    essayShow: function (e) {
        wx.navigateTo({
            url: '/pages/essayShow/essayShow?id=' + e.currentTarget.dataset.id,
        })
    },

    // 视屏详情
    videoShow: function (e) {
        wx.navigateTo({
            url: '/pages/ViewScreenShow/ViewScreenShow?id=' + e.currentTarget.dataset.id,
        })
    },

})