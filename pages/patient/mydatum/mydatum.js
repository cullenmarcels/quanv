var app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        page: 0,
        list: [],
        bottom: true,
        display: false,
        show: false,
        
    },

    onLoad: function (options) {
     
        let style, isdoctor
        if (options.style){
            style = 1
        }else{
            style = ''
        }
        if (options.isdoctor == 1){
            isdoctor =1
        }else{
            isdoctor = ''
        }
        this.setData({
            style: style,
            options: options
        })
    },

    onShow(){
        this.setData({
            page: 0,
            list: [],
            bottom: true,
            display: false,
        })
        this.port()
    },

    port() {
        const that = this
        let e = {}
        e.pageSize = 10
        e.page = this.data.page + 1
        e.openid = that.data.options.openid
       
        if (this.data.bottom) {
            port.post("member/patients/get_diag_list", {
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
                            display: true,
                            show: true
                        })
                    }
                }
            })
        }
    },

    onReachBottom: function () {
        this.port()
    },

    add(){
        wx.navigateTo({
            url: '/pages/patient/myadddatum/myadddatum',
        })
    },

    close(e){
        const that = this
        wx.showModal({
            title: '提示',
            content: '确定删除？',
            success: function (res) {
                if (res.confirm) {
                    port.get("member/patients/delete_diag", {
                        param:{id: e.currentTarget.dataset.id}
                    }, function (res) {
                        if(res.res==1){
                            wx.showToast({
                                title: '删除成功',
                                icon: 'success'
                            },
                                that.onShow()
                            )
                        }else{
                            wx.showToast({
                                title: '删除失败',
                                icon: 'loading'
                            })
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    li(e){
        if (e.currentTarget.dataset.style==1){
            wx.navigateTo({
                url: '/pages/patient/myadddatum/myadddatum?content=' + JSON.stringify(e.currentTarget.dataset.li)+'&style=1',
            })
        } else {
            wx.navigateTo({
                url: '/pages/patient/myadddatum/myadddatum?content=' + JSON.stringify(e.currentTarget.dataset.li),
            })
        }
    },

    // 导入
    tolead(e){
        let content = e.currentTarget.dataset.li;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        prevPage.setData({
            newContent: content
        })

        wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
        })
    }
})