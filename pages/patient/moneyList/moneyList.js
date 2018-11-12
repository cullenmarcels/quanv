const app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        page: 0,
        list: [],
        bottom: true,
        display: false,
        show: false
    },


    onLoad: function (options) {
        this.setData({
            openid: app.getCache("userinfo").openid
        })
        this.list()
    },

    list() {
        const that = this
        let e = {}
        e.pageSize = 20,
        e.page = this.data.page + 1,
        e.openid = that.data.openid
        if (this.data.bottom) {
            port.get("member/moneybag/pat_moneybag_detail", {
                param: e
            }, function (res) {
                if (res.error == 0) {
                    if (res.list.length == 0) {
                        return that.setData({
                            show: true,
                            bottom: false,
                            display: true
                        })
                    } else {
                        that.setData({
                            list: that.data.list.concat(res.list),
                            page: e.page,
                            display: true,
                            show: true,
                        })
                    }
                }
            })
        }

    },
    onReachBottom() {
        this.list()
    }

})