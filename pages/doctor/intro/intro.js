var app = getApp(),
    port = app.requirejs("core")
Page({


    data: {
        show: false,
        nav: 0
    },

    onLoad: function (options) {
        this.setData({
            doctor_id: options.openid,
            openid: app.getCache("userinfo").openid
        })
        this.port()
    },

    port(){
        const that = this
        port.get("member/doctors/doc_detail", {
            param: { 
                doc_openid: that.data.doctor_id,
                pat_openid: that.data.openid
            }
        }, function (res) {
            that.setData({
                concent: res.res,
                recommend_index: Number(res.res.recommend_index) ,
                show: true
            })
        })
    },

    nav(e){
        this.setData({
            nav: e.currentTarget.dataset.nav
        })
    }
})