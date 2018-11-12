const app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        concent: [
            { img: '', name: '群名称', time: '16：00', con: '讨论啥呢？说来听听，讨论啥呢？说来听听，讨论啥呢？说来听听，讨论啥呢？说来听听，讨论啥呢？说来听听，讨论啥呢？说来听听，', num: 196 },
        ],
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
    },

    onShow: function () {
        const that = this

        wx.getStorage({
            key: 'set',
            success: function (res) {
                that.setData({
                    phone: res.data
                })
            }
        })
        that.lectures()
    },


    lectures: function () {
        const that = this
        let e = {}
        e.pageSize = 10
        e.page = this.data.page + 1,
            e.openid = that.data.openid
        if (this.data.bottom) {
            port.get("member/patients/my_notice", {
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
        this.lectures()
    },


    show(e) {
        wx.navigateTo({
            url: '/pages/doctor/myPatientShow/myPatientShow?cen=' + JSON.stringify(e.currentTarget.dataset.cen),
        })
    }
})