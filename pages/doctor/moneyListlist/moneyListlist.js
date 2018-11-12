const app = getApp(),
    port = app.requirejs("core")
Page({


    data: {
        page: 0,
        list: [],
        bottom: true,
        display: false,
        show: false
    },

    onLoad: function (options) {
        let title
        switch (options.goodstype) {
            case '1':
                title = '图文咨询'
                break;
            case '2':
                title = '科普视频'
                break;
            case '3':
                title = '科普文章'
                break;
            case '4':
                title = '线下讲座'
                break;
            case '5':
                title = '当面咨询'
                break;
            case '6':
                title = '送心意'
                break;
            default:
              
        }

        wx.setNavigationBarTitle({
            title: title+'明细',
        })

        this.setData({
            date: options.date,
            goodstype: options.goodstype,
            openid: app.getCache("userinfo").openid
        })
        this.port()
    },

    port(){
        const that = this
        let param = {}
        param.openid = that.data.openid
        param.goodstype = that.data.goodstype
        param.date = that.data.date
        param.page = that.data.page + 1
        param.pageSize = 20
        if (this.data.bottom) {
            port.get("member/moneybag/doc_moneybag_order", {
                param: param
            }, function (res) {
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
                            page: param.page,
                            disply: false,
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

    show(e){
        wx.navigateTo({
            url: '/pages/doctor/moneyListshow/moneyListshow?orderid=' + e.currentTarget.dataset.orderid,
        })
    }
  
})