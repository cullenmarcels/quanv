// pages/patientChatcost/patientChatcost.js
Page({

    data: {
        items: [],
        show: false
    },

    radioChange: function (e) {
        // console.log('radio发生change事件，携带value值为：', e.detail.value)
        this.setData({
            value: e.detail.value
        })
    },

    onLoad: function (options) {
        let items = [
            { name: 'default_consult', value: options.default_consult, explain: '医生可回复6条信息'},
            { name: 'highgrade_consult', value: options.highgrade_consult, explain: '七天内不限条数' },
        ]
       
        this.setData({
            gzh_openid: options.gzh_openid,
            items: items,
            doctorid: options.doctorid,
            show: true
        })
    },

    issue(){
        let items = this.data.items
        let value = this.data.value
        if (value){
            wx.navigateTo({
                url: '/pages/patientChatissue/patientChatissue?gzh_openid=' + this.data.gzh_openid + '&doctorid=' + this.data.doctorid + '&value=' + JSON.stringify(items[value]),
            })
        }else{
            wx.showToast({
                title: '请选择类型',
                icon:'loading'
            })
        }
    }
})