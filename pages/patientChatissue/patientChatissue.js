var app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        items: [
            { name: '1', value: '男' },
            { name: '0', value: '女' },
        ],
        array: [],
        index: 0,
        images:[],
        imgs:[],
        time: 0
    },

    onLoad: function (options) {
        this.setData({
            money: JSON.parse(options.value),
            doctorOpenid: options.gzh_openid,
            doctorid: options.doctorid,
            openid: app.getCache("userinfo").openid
        })
    },

    bindPickerChange: function (e) {
        this.setData({
            index: e.detail.value
        })
    },

    radioChange: function (e) {},

    upload: function (t) {
        var a = this,
            i = port.data(t),
            s = i.type,
            r = a.data.images,
            n = a.data.imgs,
            o = i.index;
        "image" == s ? port.upload(function (t) {
                r.push(t.filename)
                n.push(t.url)
                if(r.length > 9){
                    r.length = 9
                }
                if (n.length > 9){
                    n.length = 9
                }
                a.setData({
                    images: r,
                    imgs: n
                })
        }) : "image-remove" == s ? (r.splice(o, 1), n.splice(o, 1), a.setData({
            images: r,
            imgs: n
        })) : "image-preview" == s && wx.previewImage({
            current: n[o],
            urls: n
        })
    },

    formSubmit: function (e) {
        const that = this
        if (that.data.pat_gzhopenid){
            let time = Date.parse(new Date())
            if (time > that.data.time + 10000) {
                that.setData({
                    time: time
                })
                let consult_type
                let mPattern = /^1[34578]\d{9}$/
                if (!e.detail.value.name || !e.detail.value.age || !e.detail.value.sex || !e.detail.value.mobile || !e.detail.value.content){
                    wx.showToast({
                        title: '请先完善信息',
                        icon: 'loading'
                    })
                }else{
                    if (!mPattern.test(e.detail.value.mobile)){
                        wx.showToast({
                            title: '号码格式错误',
                            icon: 'loading'
                        })
                    }else{
                        wx.showLoading({
                            title: '提交中',
                        })
                        e.detail.value.diag_thumbs = that.data.imgs
                        e.detail.value.openid = that.data.openid
                        if (e.detail.target.dataset.state == 1){
                            console.log(e.detail.value)
                            port.post("member/patients/save_patdata", {
                                param: e.detail.value
                            }, function (res) {
                                wx.hideToast()
                                if(res.status == 1 ) {
                                    wx.showToast({
                                        title: '保存成功',
                                        icon: 'success'
                                    })
                                }else{
                                    wx.showToast({
                                        title: '保存失败',
                                        icon: 'loading'
                                    })
                                }
                            })
                        }else{
                            e.detail.value.doctorid = that.data.doctorid
                            if (that.data.money.name == 'default_consult'){
                                consult_type = 1
                            }else{
                                consult_type = 2
                            }
                            e.detail.value.consult_type = consult_type
                            if (that.data.money.value == 0 ){
                                port.post("member/patients/save_patdata", {
                                    param: e.detail.value
                                }, function (res) {
                                    wx.hideToast()
                                    if (res.status == 1) {
                                        wx.navigateTo({
                                            url: '/pages/patientChat/patientChat?gzh_openid=' + that.data.doctorOpenid + '&diaglogid=' + res.diaglogid+'&type=1',
                                        })
                                    }
                                })
                            }else{
                                port.post("member/patients/save_patdata", {
                                    param: e.detail.value
                                }, function (res) {
                                    
                                    let diaglogid = res.diaglogid
                                    if (res.status == 1) {
                                        let param = {
                                            openid: that.data.openid,
                                            goodsid: res.diaglogid,
                                            goodstype: 1,
                                            price: that.data.money.value,
                                            total: 1,
                                            optionname: '图文咨询'
                                        }
                                       
                                        port.post("order/newpay/createpay", {
                                            param: param
                                        }, function (res) {
                                         
                                            wx.hideToast()
                                            let orderid = res.order.orderid
                                            if (orderid) {
                                                wx.requestPayment({
                                                    'timeStamp': res.wechat.payinfo.timeStamp,
                                                    'nonceStr': res.wechat.payinfo.nonceStr,
                                                    'package': res.wechat.payinfo.package,
                                                    'signType': 'MD5',
                                                    'paySign': res.wechat.payinfo.paySign,
                                                    'success': function (res) {
                                                        
                                                        // 修改支付状态
                                                        port.post("order/newpay/complete", {
                                                            param: {
                                                                openid: that.data.openid,
                                                                orderid: orderid
                                                            }
                                                        }, function (res) {
                                                            console.log(res, '修改状态')
                                                            if (res.status == 1) {
                                                                wx.showToast({
                                                                    title: '支付成功',
                                                                    icon: 'success'
                                                                })
                                                                wx.navigateTo({
                                                                    url: '/pages/patientChat/patientChat?gzh_openid=' + that.data.doctorOpenid + '&diaglogid=' + diaglogid+'&type=1',
                                                                })
                                                            } else {
                                                                wx.showModal({
                                                                    title: '提示',
                                                                    content: '支付成功，下单失败，请把此页面截图并联系客服，错误:' + res.message + ' ,' + orderid + ' ,' + that.data.openid,
                                                                })
                                                                // wx.showToast({
                                                                //     title: '下单失败',
                                                                //     icon: 'loading',
                                                                // })
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
                                    } else {
                                        wx.hideToast()
                                        wx.showToast({
                                            title: '提交失败',
                                            icon: 'loading',
                                        })
                                    }
                                })
                            }
                        }
                    }
                }


                // !e.detail.value.name || !e.detail.value.age || !e.detail.value.sex || !e.detail.value.mobile || !e.detail.value.content ? (
                //     wx.showToast({
                //         title: '请先完善信息',
                //         icon: '      '
                //     })
                // ) : (
                //         !mPattern.test(e.detail.value.mobile) ? (
                //             wx.showToast({
                //                 title: '号码格式错误',
                //                 icon: 'loading'
                //             })
                //         ) : (
                //                 wx.showLoading({
                //                     title: '提交中',
                //                 }),
                //                 e.detail.value.diag_thumbs = that.data.imgs,
                //                 e.detail.value.openid = that.data.openid,
                //                 e.detail.target.dataset.state == 1 ? (  //点击保存到我的资料
                //                     port.post("member/patients/save_patdata", {
                //                         param: e.detail.value
                //                     }, function (res) {
                //                         wx.hideToast(),
                //                             res.status == 1 ? (
                //                                 wx.showToast({
                //                                     title: '保存成功',
                //                                     icon: 'success'
                //                                 })
                //                             ) : (
                //                                     wx.showToast({
                //                                         title: '保存失败',
                //                                         icon: 'loading'
                //                                     })
                //                                 )
                //                     })
                //                 ) : (//发起咨询

                //                         e.detail.value.doctorid = that.data.doctorid,
                //                         that.data.money.name == 'default_consult' ? (
                //                             consult_type = 1
                //                         ) : (
                //                                 consult_type = 2
                //                             ),
                //                         e.detail.value.consult_type = consult_type,
                //                         that.data.money.value == 0 ? (
                //                             port.post("member/patients/save_patdata", {
                //                                 param: e.detail.value
                //                             }, function (res) {
                //                                 wx.hideToast()
                //                                 if (res.status == 1) {
                //                                     wx.redirectTo({
                //                                         url: '/pages/patientChat/patientChat?gzh_openid=' + that.data.doctorOpenid + '&diaglogid=' + res.diaglogid,
                //                                     })
                //                                 }
                //                             })
                //                         ) : (
                //                                 port.post("member/patients/save_patdata", {
                //                                     param: e.detail.value
                //                                 }, function (res) {
                //                                     let diaglogid = res.diaglogid
                //                                     if (res.status == 1) {
                //                                         let param = {
                //                                             openid: that.data.openid,
                //                                             goodsid: res.diaglogid,
                //                                             goodstype: 1,
                //                                             price: that.data.money.value,
                //                                             total: 1,
                //                                             optionname: '图文咨询'
                //                                         }
                //                                         port.post("order/newpay/createpay", {
                //                                             param: param
                //                                         }, function (res) {
                //                                             wx.hideToast()
                //                                             let orderid = res.order.orderid
                //                                             if (orderid) {
                //                                                 wx.requestPayment({
                //                                                     'timeStamp': res.wechat.payinfo.timeStamp,
                //                                                     'nonceStr': res.wechat.payinfo.nonceStr,
                //                                                     'package': res.wechat.payinfo.package,
                //                                                     'signType': 'MD5',
                //                                                     'paySign': res.wechat.payinfo.paySign,
                //                                                     'success': function (res) {
                //                                                         if (res.errMsg == 'requestPayment:ok') {
                //                                                             // 修改支付状态
                //                                                             port.post("order/newpay/complete", {
                //                                                                 param: {
                //                                                                     openid: that.data.openid,
                //                                                                     orderid: orderid
                //                                                                 }
                //                                                             }, function (res) {
                //                                                                 console.log(res,'修改状态')
                //                                                                 if (res.status == 1){
                //                                                                     wx.showToast({
                //                                                                         title: '支付成功',
                //                                                                         icon: 'success',
                //                                                                     })
                //                                                                     wx.redirectTo({
                //                                                                         url: '/pages/patientChat/patientChat?gzh_openid=' + that.data.doctorOpenid + '&diaglogid=' + diaglogid,
                //                                                                     })
                //                                                                 }else{
                //                                                                     wx.showToast({
                //                                                                         title: '下单失败',
                //                                                                         icon: 'loading',
                //                                                                     })
                //                                                                 }
                                                                                    
                //                                                             })
                //                                                         }
                //                                                     },
                //                                                     'fail': function (res) {
                //                                                         wx.showToast({
                //                                                             title: '支付失败',
                //                                                             icon: 'loading',
                //                                                         })
                //                                                     }
                //                                                 })
                //                                             } else {
                //                                                 wx.showToast({
                //                                                     title: '请求失败',
                //                                                     icon: 'loading',
                //                                                 })
                //                                             }
                //                                         })
                //                                     }else{
                //                                         wx.hideToast()
                //                                         wx.showToast({
                //                                             title: '提交失败',
                //                                             icon: 'loading',
                //                                         })
                //                                     }
                //                                 })
                //                             )
                //                     )
                //             )
                //     )
            }else{
                wx.showToast({
                    title: '勿连续多次点击',
                    icon: 'loading'
                })
            }
        }else{
            wx.showModal({
                title: '提示',
                content: '此账号未绑定公众号，请先点击绑定再咨询，绑定后如果未关注公众号，请用微信搜索“全V健康”公众号并关注，以便接受医生回复提醒！！！',
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
        }
        
    },

    lead(){
        wx.navigateTo({
            url: '/pages/patient/mydatum/mydatum?style=1&openid=' + this.data.openid,
        })
    },

    pat_gzhopenid(){
        const  that = this
        port.get("member/member/user_binding", { 
            param: {openid: that.data.openid} 
        },function(res){
            that.setData({
                pat_gzhopenid: res.list.gzhopenid
            })
            if(!res.list.gzhopenid){
                wx.showModal({
                    title: '提示',
                    content: '此账号未绑定公众号，请先点击绑定再咨询，绑定后如若未关注公众号，请在微信搜索“全V健康”公众号，并且关注，以便接收消息回复提醒！！！',
                    confirmText: '关注',
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
            }
        })
    },

    onShow(){
        const that = this
        that.pat_gzhopenid()
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];     //当前页面
        // console.log(currPage.data.newContent, '传值')   //就可以看到data里mydata的值了
        
        if (currPage.data.newContent) {
            this.data.items
            for (var i = 0; i < this.data.items.length;i++){
                if (this.data.items[i].name == currPage.data.newContent.sex){
                    this.data.items[i].checked = true
                }else{
                    this.data.items[i].checked = false
                }
            }
            this.setData({
                content: currPage.data.newContent.content,
                name: currPage.data.newContent.name,
                age: currPage.data.newContent.age,
                title: currPage.data.newContent.title,
                mobile: currPage.data.newContent.mobile,
                imgs: currPage.data.newContent.diag_thumbs,
                items: this.data.items
            })
        }
    },

    
})