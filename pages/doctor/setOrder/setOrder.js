var app = getApp(),
    port = app.requirejs("core")
Page({


    data: {
        list:[],
        display: false,
        show: false
    },

    onLoad: function (options) {
        this.setData({
            openid: app.getCache("userinfo").openid
        })
        // this.gain()
    },

    onShow: function(){
        this.gain()
    },

    gain: function(){
        const that = this
        port.get("member/consult/get_docconsult", {
            param: {openid:that.data.openid}
        }, function (res) {
            if(res.error == 0){
                that.setData({
                    list: res.list,
                    display: true,
                    show: true
                })
            }
        })
    },

    alterOrder: function(e){ 
        wx.navigateTo({
            url: '/pages/doctor/alterOrder/alterOrder?id=' + JSON.stringify(e.currentTarget.dataset.id),
        })
    },
    delete: function(e){
        const that = this
        if (e.currentTarget.dataset.consult_nums==0){
            wx.showModal({
                title: '提示',
                content: '是否确定删除',
                success: function (res) {
                    if (res.confirm) {
                        port.get("member/consult/delete", {
                            id: e.currentTarget.dataset.id
                        }, function (res) {
                            if (res.status == 1) {
                                wx.showToast({
                                    title: '删除成功',
                                    icon: 'success'
                                })
                            }
                            that.gain()
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
        
        
    }
})