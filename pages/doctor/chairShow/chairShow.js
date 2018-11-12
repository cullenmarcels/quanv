var app = getApp(),
    port = app.requirejs("core")
Page({

 
    data: {
        concent: {}
    },

  
    onLoad: function (options) {
        console.log(options)
        const that = this
        port.get("lectures/lecture_detail", {
            param:{
                id: options.id,
                openid: app.getCache("userinfo").openid
            }
        }, function (res) {
            console.log(res)
            var dayValue = res.res.data
            var day = new Date(Date.parse(dayValue.replace(/-/g, '/'))); 
            var today = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"); 
            var week = today[day.getDay()]
            // console.log(today[day.getDay()])
            that.setData({
                concent: res.res,
                week: week
            })
        })
    },

  
})