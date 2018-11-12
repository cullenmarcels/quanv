const app = getApp(),
    port = app.requirejs("core")
Page({
    data: {
        show: false
    },
    onLoad: function (options) {
        const that = this
        that.setData({
            style: options.style,
        })

        wx.getStorage({
            key: 'set',
            success: function (res) {
                that.setData({
                    phone: res.data
                })
            }
        })
       
        port.get("member/consult/pat_payconsultdetail", {
            param:{
                openid: options.openid,
                consult_logid: options.consult_logid
            }
        }, function (res) {
            that.setData({
                list: res.list[0],
                show: true
            })
        })
        
    },
})