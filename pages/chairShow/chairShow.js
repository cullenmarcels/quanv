var app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        concent: {},
        show: false
    },

    onLoad: function (options) {
        if (options.clear == 1){
            port.get("lectures/clear_remind", {
                id: options.id,
                type: 1
            }, function (res) {})
        }
        this.setData({
            id: options.id,
            openid: app.getCache("userinfo").openid,
            Openid: 'sns_wa_' + app.getCache("userinfo").openid
        })
        this.part()
    },

    part(){ 
        const that = this
        port.get("vindex/more_lectures_detail", {
            param:{ 
                id: that.data.id,
                openid: that.data.openid
            }
        }, function (res) {
            var dayValue = res.res.data
            var day = new Date(Date.parse(dayValue.replace(/-/g, '/')));
            var today = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
            var week = today[day.getDay()]
            that.setData({  
                concent: res.res,
                week: week,
                show: true
            })
        })
    },


    pay(){
        const that = this
        wx.showModal({
            title: '提示',
            content: '报名需交' + that.data.concent.lecture_cost + '元报名费',
            confirmColor: '#02c6dc',
            success: function (res) {
                if (res.confirm) {
                    port.get("member/patients/notice", {
                        param: {
                            id: that.data.id,
                            openid: that.data.openid
                        }
                    }, function (res) {
                        if (res.res == 1) {
                            let param = {
                                openid: that.data.openid,
                                goodsid: res.lec_logid,
                                goodstype: 4,
                                price: that.data.concent.lecture_cost,
                                total: 1,
                                optionname: '线下讲座'
                            }
                            port.get("order/newpay/createpay", {
                                param: param
                            }, function (res) {
                                let orderid = res.order.orderid
                                if (orderid) {
                                    wx.requestPayment({
                                        'timeStamp': res.wechat.payinfo.timeStamp,
                                        'nonceStr': res.wechat.payinfo.nonceStr,
                                        'package': res.wechat.payinfo.package,
                                        'signType': 'MD5',
                                        'paySign': res.wechat.payinfo.paySign,
                                        'success': function (res) {
                                            if (res.errMsg == 'requestPayment:ok') {
                                                // 修改支付状态
                                                port.post("order/newpay/complete", {
                                                    param: {
                                                        openid: that.data.openid,
                                                        orderid: orderid
                                                    }
                                                }, function (res) {
                                                    if (res.status == 1){
                                                        wx.showToast({
                                                            title: '报名成功',
                                                            icon: 'success',
                                                        },
                                                            that.part()
                                                        )
                                                    }
                                                        
                                                })
                                            }
                                        },
                                        'fail': function (res) {
                                            wx.showToast({
                                                title: '报名失败',
                                                icon: 'loading',
                                            })
                                        }
                                    })
                                } else {
                                    wx.showToast({
                                        title: '请求失败',
                                        icon: 'loading',
                                    })
                                }
                            })
                        } else {
                            wx.showToast({
                                title: '请求失败',
                                icon: 'loading',
                            })
                        }
                    }) 
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
        
    },

    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: this.data.concent.lecture_title,
            path: '/pages/essayShow/essayShow?id=' + this.data.concent.id,
            success: function (res) {
                // 转发成功
                console.log('转发成功')
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },

    // // 关注
    // attention() {
    //     const that = this
    //     port.get("member/follow/set_follow", {
    //         param: {
    //             doc_openid: that.data.essay.openid,
    //             pat_openid: that.data.openid
    //         }
    //     }, function (res) {
    //         if (res.res == 1) {
    //             wx.showToast({
    //                 title: '关注成功',
    //                 icon: 'success'
    //             },
    //                 that.part()
    //             )
    //         } else {
    //             wx.showToast({
    //                 title: '关注失败',
    //                 icon: 'success'
    //             })
    //         }
    //     })
    // },

    // 关注
    attention() {
        const that = this
        port.get("member/follow/set_follow", {
            param: {
                doc_openid: that.data.concent.openid,
                pat_openid: that.data.openid
            }
        }, function (res) {
            if (res.status == 1) {
                if (res.isfollow == 1) {
                    wx.showToast({
                        title: '关注成功',
                        icon: 'success'
                    },
                        that.part()
                    )
                } else {
                    wx.showToast({
                        title: '取消关注成功',
                        icon: 'success'
                    },
                        that.part()
                    )
                }
            } else {
                wx.showToast({
                    title: '请求失败',
                    icon: 'loading'
                })
            }
        })
    },

    doctor(e) {
        wx.navigateTo({
            url: '/pages/patient/doctor/doctor?openid=' + e.currentTarget.dataset.openid,
        })
    }
})