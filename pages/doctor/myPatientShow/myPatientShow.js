// pages/doctor/myPatientShow/myPatientShow.js
Page({

    data: {
        show: false
    },

    onLoad: function (options) {
       const that = this
        wx.getStorage({
            key: 'set',
            success: function (res) {
                console.log(JSON.parse(options.cen))
                that.setData({
                    phone: res.data,
                    cen: JSON.parse(options.cen),
                    show: true
                })
            }
        })
    }
})