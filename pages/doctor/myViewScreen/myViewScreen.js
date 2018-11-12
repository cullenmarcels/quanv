const app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        item: {
            index: 0,
            nav: ['全部视屏', '审核视屏']
        },
        page: 0,
        list: [],
        bottom: true,
        disply: false,
        show: true,
        timestamp: 0

    },

    onLoad: function (options) {
        const that = this
        this.setData({
            openid: app.getCache("userinfo").openid
        })
    },

    lectures: function () {
        const that = this
        let e = {}
        if(that.data.item.index == 0){
            e.type = 1
        }else{
            e.type = 0
        }
        e.openid = that.data.openid
        e.pageSize = 30
        e.page = this.data.page + 1
        
        if (this.data.bottom) {
            wx.showLoading({
                title: '加载中...',
            })
            port.post("member/videos/get_data", {
                param: e
            }, function (res) {
                wx.hideLoading()
                if (res.error == 0) {
                    if (res.list.length == 0) {
                        return that.setData({
                            bottom: false,
                            disply: true,
                            show: true
                        })
                    } else {
                        that.setData({
                            list: that.data.list.concat(res.list),
                            page: e.page,
                            disply: false,
                            show: true
                        })
                    }
                }
            })
        }

    },

   
    onShow: function () {
        this.setData({
            page: 0,
            list: [],
            bottom: true,
            disply: false
        })
        this.lectures()
        this.get_videos_total()
    },

    get_videos_total() {
        const that = this
        port.get("member/videos/get_videos_total", {
            param: { openid: that.data.openid }
        }, function (res) {
            // let release = res.total.release
            let audit = res.total.audit
            // if (Number(release)> 99){
            //     release = '99+'
            // }
            if (Number(audit) > 99) {
                audit = '99+'
            }
            that.data.item.nav = ['全部视频', '审核视频(' + audit + ')']

            that.setData({
                item: that.data.item
            })
        })
    },


    onReachBottom: function () {
        this.lectures()
    },

    // 栏目切换
    nav: function (event) {
        const that = this
        let date = Date.parse(new Date())
        if (this.data.item.index != event.currentTarget.dataset.id && (this.data.timestamp + 300 < date)){
            this.data.item.index = event.currentTarget.dataset.id
            this.setData({
                item: this.data.item,
                page: 0,
                list: [],
                timestamp: date,
                bottom: true,
                disply: false
            })
            this.lectures()
            this.get_videos_total()
        }
    },

    // 查看详情
    ViewScreenShow: function(e){
        if (this.data.item.index == 0){
            wx.navigateTo({
                url: '/pages/ViewScreenShow/ViewScreenShow?id=' + e.currentTarget.dataset.id,
            })
        }else{
            wx.navigateTo({
                url: '/pages/doctor/ViewScreenShow/ViewScreenShow?id=' + e.currentTarget.dataset.id,
            })
        }

        
    },

    // 上传视屏
    uploadingViewScreen: function(){
        wx.navigateTo({
            url: '/pages/doctor/uploadingViewScreen/uploadingViewScreen',
        })
    }

})