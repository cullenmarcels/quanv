const app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        items: [
            { name: '男', value: 1 },
            { name: '女', value: 0 },
        ]
    },

    onLoad: function (options) {
        this.setData({
            id: options.id,
            openid: app.getCache("userinfo").openid,
            money: options.money
        })
    },
    formSubmit: function (e) {
        const that = this
        let mPattern = /^1[34578]\d{9}$/
        if (!e.detail.value.name || !e.detail.value.age || !e.detail.value.mobile || !e.detail.value.title || !e.detail.value.sex){
            wx.showToast({
                title: '请先完善资料',
                icon: 'loading'
            })
        }else{
            if (!mPattern.test(e.detail.value.mobile)){
                wx.showToast({
                    title: '号码格式错误',
                    icon: 'loading'
                })
            }else{
                e.detail.value.consultid = that.data.id,
                e.detail.value.openid = that.data.openid,

                wx.showModal({
                    title: '提示',
                    content: '确定预约需支付￥' + that.data.money + '！ 确定预约？？',
                    confirmColor: '#02c6dc',
                    success: function (res) {
                        if (res.confirm) {
                            wx.showLoading()
                            port.post("member/consult/pat_submit", {
                                param: e.detail.value
                            }, function (res) {
                                if (res.status == 1) {
                                    let param = {
                                        openid: that.data.openid,
                                        goodsid: that.data.id,
                                        goodstype: 5,
                                        price: that.data.money,
                                        total: 1,
                                        optionname: '当面咨询'
                                    }
                                    port.post("order/newpay/createpay", {
                                        param: param
                                    }, function (res) {
                                        let orderid = res.order.orderid
                                        wx.hideLoading()
                                        if (orderid) {
                                            wx.requestPayment({
                                                'timeStamp': res.wechat.payinfo.timeStamp,
                                                'nonceStr': res.wechat.payinfo.nonceStr,
                                                'package': res.wechat.payinfo.package,
                                                'signType': 'MD5',
                                                'paySign': res.wechat.payinfo.paySign,
                                                'success': function (res) {
                                                    // console.log(res,'支付')
                                                   
                                                    // 修改支付状态
                                                    port.post("order/newpay/complete", {
                                                        param: {
                                                            openid: that.data.openid,
                                                            orderid: orderid
                                                        }
                                                    }, function (res) {
                                                        if (res.status == 1) {
                                                            wx.showToast({
                                                                title: '预约成功',
                                                                icon: 'success',
                                                            })
                                                            wx.navigateBack({
                                                                delta: 1
                                                            })
                                                        } else {
                                                            wx.showToast({
                                                                title: '修改失败',
                                                                icon: 'loading',
                                                            })
                                                        }
                                                    })
                                                    
                                                },
                                                'fail': function (res) {
                                                    wx.showToast({
                                                        title: '预约失败',
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
                                    wx.hideLoading()
                                    wx.showToast({
                                        title: '数据提交失败',
                                        icon: 'loading'
                                    })
                                }
                            })
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }

                })
            }
        }
        // !e.detail.value.name || !e.detail.value.age || !e.detail.value.mobile || !e.detail.value.title || !e.detail.value.sex?(
        //     wx.showToast({
        //         title: '请先完善资料',
        //         icon: 'loading'
        //     })
        // ):(

        //     !mPattern.test(e.detail.value.mobile)?(
        //         wx.showToast({
        //             title: '号码格式错误',
        //             icon: 'loading'
        //         })
        //     ):(
        //         e.detail.value.consultid = that.data.id,
        //         e.detail.value.openid = that.data.openid,

        //         wx.showModal({
        //             title: '提示',
        //             content: '确定预约需支付￥' + that.data.money + '！ 确定预约？？',
        //             confirmColor: '#02c6dc',
        //             success: function (res) {
        //                 if (res.confirm) {
        //                     wx.showLoading()
        //                     port.post("member/consult/pat_submit", {
        //                         param: e.detail.value
        //                     }, function (res) {
        //                         if (res.status == 1) {
        //                             let param = {
        //                                 openid: that.data.openid,
        //                                 goodsid: that.data.id,
        //                                 goodstype: 5,
        //                                 price: that.data.money,
        //                                 total: 1,
        //                                 optionname: '当面咨询'
        //                             }

        //                             port.post("order/newpay/createpay", {
        //                                 param: param
        //                             }, function (res) {
                                        
        //                                wx.hideLoading()
        //                                let orderid = res.order.orderid
        //                                if (orderid) {
        //                                     wx.requestPayment({
        //                                         'timeStamp': res.wechat.payinfo.timeStamp,
        //                                         'nonceStr': res.wechat.payinfo.nonceStr,
        //                                         'package': res.wechat.payinfo.package,
        //                                         'signType': 'MD5',
        //                                         'paySign': res.wechat.payinfo.paySign,
        //                                         'success': function (res) {
        //                                             // console.log(res,'支付')
        //                                             if (res.errMsg == 'requestPayment:ok') {
        //                                                 // 修改支付状态
        //                                                 port.post("order/newpay/complete", {
        //                                                     param: {
        //                                                         openid: that.data.openid,
        //                                                         orderid: orderid
        //                                                     }
        //                                                 }, function (res) {
        //                                                     if (res.status == 1){
        //                                                         wx.showToast({
        //                                                             title: '预约成功',
        //                                                             icon: 'success',
        //                                                         })
        //                                                         wx.navigateBack({
        //                                                             delta: 1
        //                                                         })
        //                                                     }else{
        //                                                         wx.showToast({
        //                                                             title: '修改失败',
        //                                                             icon: 'loading',
        //                                                         })
        //                                                     }
        //                                                 })
        //                                             }
        //                                         },
        //                                         'fail': function (res) {
        //                                             wx.showToast({
        //                                                 title: '预约失败',
        //                                                 icon: 'loading',
        //                                             })
        //                                         }
        //                                     })
        //                                 } else {
        //                                     wx.showToast({
        //                                         title: '请求失败',
        //                                         icon: 'loading',
        //                                     })
        //                                 }
        //                             })
        //                         }else{
        //                             wx.hideLoading()
        //                             wx.showToast({
        //                                 title: '数据提交失败',
        //                                 icon:'loading'
        //                             })
        //                         }
        //                     })
        //                 } else if (res.cancel) {
        //                     console.log('用户点击取消')
        //                 }
        //             }

        //         })

               
        //     )

                
        // )
    },
    radioChange: function (e) {},
  
})