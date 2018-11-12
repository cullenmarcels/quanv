const app = getApp(),
    port = app.requirejs("core")
Page({

  
    data: {
        keyword:'',
        display: false,
        show: false
    },

    onLoad: function (options) {
        const that = this 
        that.setData({
            id: options.id
        })
        that.list()
    },

    list() {
        const that = this
        port.get("member/consult/doc_consultdetail", {
            consultid: that.data.id,
            type: 3,
            keyword: this.data.keyword
        }, function (res) {
            that.setData({
                list: res.list,
                display: true,
                show: true
            })
        })
    },

    bindinput(e){
        this.setData({
            keyword: e.detail.value
        })
    },  

    search(){
        this.list()
    },

    bindconfirm(e){
        this.setData({
            keyword: e.detail.value
        })
        this.list()
    },
   
    // 进入详情页
    show: function (e) {
        wx.navigateTo({
            url: '/pages/doctor/orderListShow/orderListShow?style=1&consult_logid=' + e.currentTarget.dataset.consult_logid + '&openid=' + e.currentTarget.dataset.openid,
        })
    }
})