const app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        item: {
            index: 0,
            nav: ['待完成', '已完成'],
            title: ['']
        },
        display: false,
        show: false
    },

    onLoad: function (options) {
        const that = this  
        this.setData({
            id: options.id,
            openid: app.getCache("userinfo").openid
        })
        that.list()
    },

    list(){
        const that = this
      
        port.get("member/consult/doc_consultdetail", {
            consultid: that.data.id,
            type: Number(that.data.item.index) + 1
        }, function (res) {
           console.log(res)
            that.setData({
                list: res.list,
                display: true,
                show: true
            })
        })
    },

    // 栏目切换
    nav: function (event) {

        if (this.data.item.index != event.currentTarget.dataset.id){
            this.data.item.index = event.currentTarget.dataset.id
            this.setData({
                item: this.data.item,
                display: false,
                list: []
            })
            this.list()
        }
        
    },

    // 进入详情页
    show: function (e) {
        let consult_logid = e.currentTarget.dataset.consult_logid
        let openid = e.currentTarget.dataset.openid
        console.log(consult_logid, openid)
        wx.navigateTo({
            url: '/pages/doctor/orderListShow/orderListShow?style=' + this.data.item.index + '&consult_logid=' + consult_logid + '&openid=' + openid,
        })
    },

    onShow(){
        // this.get_article_list_total()
    },

    get_article_list_total() {
        const that = this
        port.get("member/consult/doc_consultdetail_total", {
            consultid: that.data.id 
        }, function (res) {
            console.log(res)
            let unfinished = res.list.unfinished
            let finished = res.list.finished
            if (Number(unfinished) > 99) {
                unfinished = '99+'
            }
            if (Number(finished) > 99) {
                finished = '99+'
            }
            that.data.item.nav = ['待完成', '已完成']
            that.data.item.title = [unfinished]
            that.setData({
                item: that.data.item
            })
        })
    },


})