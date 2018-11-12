const app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        list: [],
        show: false
    },

    onLoad: function (options) {
        this.setData({
            doc_openid: options.doc_openid,
            openid: app.getCache("userinfo").openid
        })
        this.port()
        this.list()
    },

    list(){
        const that = this
        port.get("member/doctors/my_reward", {
            param: {
                openid: that.data.doc_openid
            }
        }, function (res) {
            that.setData({
                wallList: res.list,
            })
        })
    },

    port(){
        const that = this
        port.get("member/doctors/get_reward", {
           param:{
               openid: that.data.doc_openid
           }
        }, function (res) {
            that.setData({
                list: res.list,
                res_doc: res.res_doc,
                show: true
            })
        })
    },

    radioChange: function (e) {
        this.setData({
            radioIndex: e.detail.value
        })
    },

    formSubmit: function (e) {      
        const that = this
        let param = {}
        if (e.detail.value.radio){
            param.rewardid = that.data.list[e.detail.value.radio].id
            param.price = that.data.list[e.detail.value.radio].price
            param.doc_openid = that.data.doc_openid
            param.pat_openid = that.data.openid
            param.remark = e.detail.value.remark
            port.get("member/patients/reward_doc", {
                param:param
            }, function (res) {
                if (res.status==1){
                    let rewarddocid = res.rewarddocid
                    port.get("order/newpay/createpay", {
                        param: {
                            goodsid: rewarddocid,
                            price: param.price,
                            goodstype: 6,
                            total: 1,
                            optionname: '送心意',
                            openid: that.data.openid
                        }
                    }, function (res) {
                        let orderid = res.order.orderid
                        if (orderid) {
                            // 调用支付
                            wx.requestPayment({
                                'timeStamp': res.wechat.payinfo.timeStamp,
                                'nonceStr': res.wechat.payinfo.nonceStr,
                                'package': res.wechat.payinfo.package,
                                'signType': 'MD5',
                                'paySign': res.wechat.payinfo.paySign,
                                'success': function (res) {
                                   
                                    // 修改支付状态
                                    port.get("order/newpay/complete", {
                                        param: {
                                            openid: that.data.openid,
                                            orderid: orderid
                                        }
                                    }, function (res) {
                                        if (res.status == 1){
                                            wx.showToast({
                                                title: '心意已送达',
                                                icon: 'success',
                                            },
                                                that.setData({
                                                    radioIndex: '',
                                                    remark: ''
                                                },
                                                    that.list()
                                                )
                                            )
                                        }else{
                                            wx.showToast({
                                                title: '心意正在途中',
                                                icon: 'loading',
                                            })
                                        }
                                            
                                    })
                                    
                                },
                                'fail': function (res) {
                                    wx.showToast({
                                        title: '支付失败',
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
                }
                
            })
        } else {
            wx.showToast({
                title: '请选择类目',
                icon: 'loading'
            })
        }

    },
})