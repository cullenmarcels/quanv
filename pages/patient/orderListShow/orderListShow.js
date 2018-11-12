const app = getApp(),
    port = app.requirejs("core")
Page({
    data: {
        show: false
    },
    onLoad: function (options) {
        this.setData({
            openid: app.getCache("userinfo").openid,
            consult_logid: options.consult_logid
        })
        this.port()
    },

    port(){
        const that = this
        port.get("member/consult/pat_consultsdetail", {
            param: {
                openid: that.data.openid,
                consult_logid: that.data.consult_logid
            }
        }, function (res) {
            that.setData({
                list: res.list,
                show: true,
            })
        })
    },

    affirm(){
        const that = this
        wx.showModal({
            title: '提示',
            content: '确认当面预约已经完成',
            confirmColor: '#02c6dc',
            success: function (res) {
                if (res.confirm) {
                    port.get("member/patients/confirm_consult", {
                        param: {
                            openid: that.data.openid,
                            consult_logid: that.data.consult_logid,
                            consultid: that.data.list.consultid
                        }
                    }, function (res) {
                        if(res.status==1){
                            wx.showToast({
                                title: '确认成功',
                                icon:'success'
                            },
                                that.port()
                            )
                        }
                        
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    }
})