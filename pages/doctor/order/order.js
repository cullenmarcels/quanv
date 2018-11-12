var app = getApp(),
    port = app.requirejs("core")
Page({
    data: {
       
        item: {
            index: 0,
            nav: ['新的预约', '历史记录'],
            title: ['']
        },
        list:[],
        display: false,
        show: false,
        timestamp: 0
    },

    onLoad: function (options) {
        const that = this
        that.setData({
            openid: app.getCache("userinfo").openid
        })
        that.gain()       
    },

    onShow(){
        this.get_lecture_total()
    },

    get_lecture_total() {
        const that = this
        port.get("member/consult/get_docconsult_total", {
            param: { openid: that.data.openid }
        }, function (res) {
            let release = res.list.release
            if (Number(release) > 99) {
                release = '99+'
            }
            that.data.item.nav = ['新的预约', '历史记录']
            that.data.item.title = [release]
            that.setData({
                item: that.data.item
            })
        })
    },

    gain: function () {
        const that = this
        that.data.item.index == 1?(
            port.get("member/consult/get_docconsult", {
                param: { openid: that.data.openid , type: 0}
            }, function (res) {
                if (res.error == 0) {
                    that.setData({
                        list: res.list,
                        display: true,
                        show: true
                    })
                }
            })
        ):(
            port.get("member/consult/get_docconsult", {
                param: { openid: that.data.openid }
            }, function (res) {
                if (res.error == 0) {
                    that.setData({
                        list: res.list,
                        display: true,
                        show: true
                    })
                }
            })
        )
    },


    // 栏目切换
    nav: function(event){
        let date = Date.parse(new Date())
        if (this.data.item.index != event.currentTarget.dataset.id && (this.data.timestamp + 300 < date)){
            this.data.item.index = event.currentTarget.dataset.id
            this.setData({
                item: this.data.item,
                timestamp: date,
                display: false
            })
            this.gain()
        }
        
    },

    look: function(e){
        this.data.item.index == 0?(
            wx.navigateTo({
                url: '/pages/doctor/orderList/orderList?id='+e.currentTarget.dataset.id,
            })
        ):(
            wx.navigateTo({
                    url: '/pages/doctor/historyList/historyList?id=' + e.currentTarget.dataset.id,
            })
        )
        
    }
})