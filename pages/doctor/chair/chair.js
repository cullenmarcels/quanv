var app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        item: {
            shu: false,
            index: 0,
            nav: ['待开讲', '我的申请', '往期记录'],
            title: ['','']
        },
        page: 0,
        list: [],
        bottom: true,
        display: false,
        show: false,
        timestamp: 0
    },

    onLoad: function (options) {
        const that = this
        that.setData({
            openid: app.getCache("userinfo").openid
        })
    },

    onShow(){
        this.setData({
            page: 0,
            list: [],
            bottom: true,
            display: false,
            avatarUrl: app.getCache("userinfo").avatarUrl
        })
        this.lectures()
        this.get_lecture_total()
    },

    get_lecture_total(){
        const that = this
        port.get("lectures/get_lecture_total", {
            param: { openid: that.data.openid}
        }, function (res) {
            let audit = res.total.nopass
            let history = res.total.history
            let release = res.total.notread
            if (Number(audit)>99){
                audit = '99+'
            }
            if (Number(history) > 99) {
                history = '99+'
            }
            if (Number(release) > 99) {
                release = '99+'
            }
            that.data.item.nav = ['待开讲', '我的申请', '历史记录']
            that.data.item.title = [release, audit]
            that.setData({
                item: that.data.item
            })
        })
    },


    // 栏目切换
    nav: function (event) {
        let date = Date.parse(new Date())
        if (this.data.item.index != event.currentTarget.dataset.id && (this.data.timestamp + 300 < date)){
            this.data.item.index = event.currentTarget.dataset.id
            this.setData({
                item: this.data.item,
                page: 0,
                list: [],
                timestamp: date,
                bottom: true,
                display: false
            })
            this.lectures()
            this.get_lecture_total()
        }

    },

    lectures: function(){
        const that = this
        let e = {}
        let newType
        this.data.item.index == 1 ? (
            newType = 0
        ) : (
                this.data.item.index == 0 ? (
                    newType = 1
                ) : (
                        newType = 2
                    )
            )
        e.type = newType
        e.pageSize = 30
        e.openid = this.data.openid
        e.page = this.data.page + 1
    
        if(this.data.bottom){
            port.get("lectures/get_lecture_list", {
                param: e
            }, function (res) {
                if (res.error == 0) {
                    if (res.list.length == 0) {
                        return that.setData({
                                    bottom: false,
                                    display: true,
                                    show: true
                                })
                    } else {
                        that.setData({
                            list: that.data.list.concat(res.list),
                            page: e.page,
                            display: false,
                            show: true
                        })
                    }
                }
            })
        }
        
    },


    // 申请开讲
    applyForChair: function(e){
        wx.navigateTo({
            url: '/pages/doctor/applyForChair/applyForChair?id=' + e.currentTarget.dataset.id
        })
    },

    chariShow: function(e){

        if (this.data.item.index == 0 || this.data.item.index == 2){
            wx.navigateTo({
                url: '/pages/chairShow/chairShow?id=' + e.currentTarget.dataset.id +'&clear=1',
            })
        }else{
            wx.navigateTo({
                url: '/pages/doctor/chairShow/chairShow?id=' + e.currentTarget.dataset.id
            })
        }
        
    },

    onReachBottom: function(){
        this.lectures()
    }
})