const app = getApp(),
    port = app.requirejs("core"),
    util = require('../../../utils/util.js')
Page({

    data: {
        page: 0,
        list: [],
        bottom: true,
        display: false,
        show: false,
        startdate: '2016-09-01',
        enddate: '',
        presentdate: '',
    },

  
    onLoad: function (options) {
        var Data = util.Data(new Date());
        let startdate = Data.split('-')[0] + '-' + Data.split('-')[1] + '-01'
        this.setData({
            presentdate: Data,
            enddate: Data,
            startdate: startdate,
            openid: app.getCache("userinfo").openid
        })
        this.refer()
    },

    refer(){
        const that = this
        let param = {}
        param.firstDate = this.data.startdate
        param.lastDate = this.data.enddate
        param.openid = this.data.openid
        port.get("member/moneybag/doc_moneybag_list", {
            param: param
        }, function (res) {
            console.log(res)
            that.setData({
                list: res.res_arr,
                show: true,
            })
        })
    },

    navShow(e){
        if (this.data.list[e.currentTarget.dataset.index].click){
            this.data.list[e.currentTarget.dataset.index].click = false
        }else{
            this.data.list[e.currentTarget.dataset.index].click = true
        }
        
        this.setData({
            list: this.data.list
        })
    },

    startdate: function (e) {
        this.setData({
            startdate: e.detail.value
        })
    },

    enddate: function (e) {
        this.setData({
            enddate: e.detail.value
        })
    },

    moneyListshow(e){
        wx.navigateTo({
            url: '/pages/doctor/moneyListlist/moneyListlist?date=' + e.currentTarget.dataset.date + '&goodstype=' + e.currentTarget.dataset.goodstype,
        })
    }
})