var app = getApp(),
    port = app.requirejs("core"),
    wxparse = app.requirejs("wxParse/wxParse");
Page({

    data: {
        show: false
    },

    onLoad: function (options) {
        this.setData({
            options: options
        })
        this.con()
    },

    con() {
        const that = this
        if (that.data.options.type == 'advsheight'){
            port.post("member/member/memadv_detail", {
                id: that.data.options.id
            }, function (res) {
                wx.setNavigationBarTitle({
                    title: res.list.advname,
                })
                that.setData({
                    nodes: res.list.content,
                    show: true
                })
            })
        }else{
            port.post("member/member/notice_detail", {
                id: that.data.options.id
            }, function (res) {
                wx.setNavigationBarTitle({
                    title: res.list.title,
                })
                that.setData({
                    nodes: res.list.detail,
                    show: true
                })
            })
        }
    },
})