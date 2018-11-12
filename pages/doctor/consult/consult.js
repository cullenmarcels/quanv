var app = getApp(),
    port = app.requirejs("core")
Page({

  
    data: {
        item: {
            shu: false,
            index: 0,
            nav: ['新咨询', '未回复','历史记录'],
            title:['','']
        },
        messikefu_list:[],
        display: false,
        show: true,
        value: '',
        timestamp: 0
    },

    onLoad: function (options) {
        const that = this
        this.setData({
            openid: app.getCache("userinfo").openid,
        })
        
    },

    list(){
        const that = this
        let e = {}
        e.type = Number(that.data.item.index) +1
        e.openid = that.data.openid
        wx.showLoading()
        port.get("member/fanskefu/messikefu_list", {
            param: e
        }, function (res) {
           wx.hideLoading()
            let reg = /^[a-zA-Z0-9_-]{64}$/
            for (var i = 0; i < res.messifans_list.length; i++) {
                if (res.messifans_list[i].kefulastcon.substr(-4) == '.git' || res.messifans_list[i].kefulastcon.substr(-4) == '.jpg' || res.messifans_list[i].kefulastcon.substr(-4) == '.png') {
                    res.messifans_list[i].kefulastcon = '[图片]'
                }else if (reg.test(res.messifans_list[i].kefulastcon)) {
                    res.messifans_list[i].kefulastcon = '[语音]'
                }

                res.messifans_list[i].kefulastcon = res.messifans_list[i].kefulastcon.replace(/&nbsp;/g, " ")
                res.messifans_list[i].kefulastcon = res.messifans_list[i].kefulastcon.replace(/&lt;br&gt;/g, "<br>")

                if (res.messifans_list[i].lastcon.substr(-4) == '.git' || res.messifans_list[i].lastcon.substr(-4) == '.jpg' || res.messifans_list[i].lastcon.substr(-4) == '.png') {
                    res.messifans_list[i].lastcon = '[图片]'
                }else if (reg.test(res.messifans_list[i].lastcon)) {
                    res.messifans_list[i].lastcon = '[语音]'
                }

                res.messifans_list[i].lastcon = res.messifans_list[i].lastcon.replace(/&nbsp;/g, " ")
                res.messifans_list[i].lastcon = res.messifans_list[i].lastcon.replace(/&lt;br&gt;/g, "<br>")
                if (res.messifans_list[i].kefulastcon.indexOf('<span class="red">系统提示：</span><br/>') != -1) {
                    res.messifans_list[i].kefulastcon = '[系统提示]'
                }
                if (res.messifans_list[i].lastcon.indexOf('<span class="red">系统提示：</span><br/>') != -1){
                    res.messifans_list[i].lastcon = '[系统提示]'
                }
                
            }

            

            that.setData({
                messikefu_list: res.messifans_list,
                display: true,
                show: true
            })
        })
    },

    onShow(){
        this.get_article_list_total()
        this.list()
    },

    get_article_list_total() {
        const that = this
        port.get("member/fanskefu/messikefu_list_total", {
            param: { openid: that.data.openid }
        }, function (res) {
      
            let history = res.total.history
            let new1 = res.total.new
            let unrecovered = res.total.unrecovered
            if (Number(history) > 99) {
                history = '99+'
            }
            if (Number(new1) > 99) {
                new1 = '99+'
            }
            if (Number(unrecovered) > 99) {
                unrecovered = '99+'
            }
            that.data.item.nav = ['新咨询', '未回复', '历史记录']
            that.data.item.title = [new1, unrecovered]
            that.setData({
                item: that.data.item
            })
        })
    },

 

    // 栏目切换
    nav: function (event) {
        let e 
        let date = Date.parse(new Date())
        this.data.item.index != event.currentTarget.dataset.id && (this.data.timestamp + 500 < date)?(
            this.data.item.index = event.currentTarget.dataset.id,
            this.setData({
                item: this.data.item,
                messikefu_list: [],
                timestamp: date,
                display: false
            }),
            this.list(),
            this.get_article_list_total()
        ):(
            console.log()
        )
    },

    char(e){
        wx.navigateTo({
            url: '/pages/doctorChat/doctorChat?fansopenid=' + e.currentTarget.dataset.fansopenid + '&diaglogid=' + e.currentTarget.dataset.diaglogid,
        })
    },

    // 搜索框输入内容
    bindinput(event){
        this.setData({
            value: event.detail.value
        })
    },

    // 点击搜索图标
    search(){
        const that = this
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        !re.test(that.data.value) && that.data.value ? (
            port.get("member/fanskefu/messikefu_list", {
                param: {
                    openid: that.data.openid,
                    type: 3,
                    keyword: that.data.value
                }
            }, function (res) {
                that.setData({
                    messikefu_list: res.messifans_list,
                    display: true,
                    show: true
                })
            })
        ):(
            wx.showToast({
                title: '请输入内容',
                icon: 'loading'
            })
        )
    },

    // 搜索点击完成
    bindconfirm(event){
        const that = this
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        !re.test(event.detail.value) && event.detail.value?(
            port.get("member/fanskefu/messikefu_list", {
                param: {
                    openid: that.data.openid,
                    type: 3,
                    keyword: event.detail.value
                }
            }, function (res) {
                that.setData({
                    messikefu_list: res.messifans_list,
                    display: true,
                    show: true
                })
            })
        ):(
            wx.showToast({
                title: '请输入内容',
                icon: 'loading'
            })
        )
    }
})