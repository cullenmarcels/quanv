var app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        show: false,
        default_consult: 1,
        highgrade_consult: 1,
        
    },

    onLoad: function (options) {
        const that = this
     
        options.state == 0?(
            wx.setNavigationBarTitle({
                title: '图文咨询设置'
            }),

            that.imgText()
        ):(
            wx.setNavigationBarTitle({
                title: '电话咨询设置'
            })
        )

        this.setData({
            state: options.state,
            show: true,
            openid: app.getCache("userinfo").openid
        })
    },

    lightning() {
        wx.showToast({
            title: '近期更新',
            icon: 'loading',
        })
    },

    imgText(){
        const that = this
        port.get("member/doctors/consult_money_set", {
            param: { openid: app.getCache("userinfo").openid, type: 1 }
        }, function (res) {
            that.setData({
                default_consult: res.consult_money.default_consult,
                highgrade_consult: res.consult_money.highgrade_consult
            })
        })
    },

    formSubmit: function (e) {
        const that =this
        e.detail.value.openid = this.data.openid
        e.detail.value.type = 2
        port.get("member/doctors/consult_money_set", {
            param: e.detail.value
        }, function (res) {
            console.log(res)
            if (res.status == 1){
                wx.showToast({
                    title: '提交成功',
                    icon: 'success'
                },
                    that.imgText()
                )
            }
        })
    },
})