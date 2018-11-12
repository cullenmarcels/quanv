var app = getApp(),
    port = app.requirejs("core")
Page({
    data: {
        page: 0,
        list: [],
        bottom: true,
        display: false,
        show: false,
        accredit: false
    },

    onShow: function () {
        const that = this
        if (app.getCache("userinfo")=='') {
            this.setData({
                accredit: true,
                show: true,
            })
        } else {
            this.setData({
                accredit: false,
                page: 0,
                list: [],
                bottom: true,
                display: false,
                accredit: false,
                openid: app.getCache("userinfo").openid
            })
            wx.getStorage({
                key: 'role',
                success: function (res) {
                    if (res.data == 0) {
                        wx.setNavigationBarTitle({
                            title: '我的关注',
                        })
                        that.lectures()
                        that.navtap()
                    } else {
                        wx.setNavigationBarTitle({
                            title: '我的患者',
                        })
                    }
                    that.setData({
                        role: res.data,
                        show: true
                    })
                }
            })

            wx.getStorage({
                key: 'set',
                success: function (res) {
                    that.setData({
                        phone: res.data
                    })
                }
            })
        }
       
    },

    navtap() {
        const that = this
        port.get("member/fanskefu/messifans_list_total", {
            param: {
                openid: that.data.openid
            }
        }, function (res) {
            if (res.total.number > 0) {
                wx.showTabBarRedDot({
                    index: 2,
                })
            } else {
                wx.hideTabBarRedDot({
                    index: 2,
                })
            }
        })
    },

    onLoad: function (options) {
        // this.setData({
        //     openid: app.getCache("userinfo").openid
        // })
    },

    lectures: function () {
        const that = this
        let e = {}
        e.pageSize = 10
        e.page = this.data.page + 1,
        e.openid = that.data.openid
        if (this.data.bottom) {
            port.get("member/patients/my_focus", {
                param: e
            }, function (res) {
                console.log(res)
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

    // char(e) {
    //     wx.navigateTo({
    //         url: '/pages/patientChatcost/patientChatcost?gzh_openid=' + e.currentTarget.dataset.gzh_openid + '&default_consult=' + e.currentTarget.dataset.default_consult + '&highgrade_consult=' + e.currentTarget.dataset.highgrade_consult + '&doctorid=' + e.currentTarget.dataset.doctorid,
    //     })
    // },

    char(e) {
        if (e.currentTarget.dataset.isoverdue == 2){
            wx.showModal({
                title: '提示',
                content: '此账号未绑定公众号，请先点击绑定再咨询，绑定后如若未关注公众号，请到微信搜索“全V健康”公众号并关注，以便于接收动态消息回复',
                confirmText: '绑定',
                confirmColor: '#02c6dc',
                success: (res) => {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/web-view/web-view',
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }

            })
        } else if (e.currentTarget.dataset.isoverdue == 1){
            wx.navigateTo({
                url: '/pages/patientChat/patientChat?gzh_openid=' + e.currentTarget.dataset.gzh_openid + '&diaglogid=' + e.currentTarget.dataset.diaglogid,
            })
        }else{
            wx.navigateTo({
                url: '/pages/patientChatcost/patientChatcost?gzh_openid=' + e.currentTarget.dataset.gzh_openid + '&default_consult=' + e.currentTarget.dataset.default_consult + '&highgrade_consult=' + e.currentTarget.dataset.highgrade_consult + '&doctorid=' + e.currentTarget.dataset.doctorid,
            })
        }
       
    },



    setOrder: function (e) {
        wx.navigateTo({
            url: '/pages/patient/setOrder/setOrder?doc_openid=' + e.currentTarget.dataset.doc_openid,
        })
    },

    doctor(e) {
        wx.navigateTo({
            url: '/pages/patient/doctor/doctor?openid=' + e.currentTarget.dataset.openid,
        })
    },

    phone() {
        console.log('暂未开放')
    }

})