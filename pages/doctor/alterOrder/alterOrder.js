var app = getApp(),
    port = app.requirejs("core"),
    util = require('../../../utils/util');  
Page({

    data: {
        start_time: '00:00',
        end_time: '00:00',
        date: '',
        address:'',
        people_nums:'',
        remark: '',
        price: '',
        show: false
    },

    onShow(){
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1]; //当前页面
        if (currPage.data.address) {
            this.setData({
                address: currPage.data.address
            })
        }
    },

    onLoad: function (options) {
        let optionsId = JSON.parse(options.id)
        var dayValue, day, today, week, value, newValue
        optionsId == 'add'?(
            dayValue = util.Data(new Date()),
            day = new Date(Date.parse(dayValue.replace(/-/g, '/'))),
            today = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"),
            week = today[day.getDay()],
            wx.setNavigationBarTitle({
                title: '添加咨询设置'
            }),
            value = util.Data(new Date()).split('-'),
            newValue = value[0] + '/' + value[1] + '/' + value[2],
            this.setData({
                date: newValue,
                week: week,
                openid: app.getCache("userinfo").openid,
                show: true
            })
        ):(
            wx.setNavigationBarTitle({
                title: '修改咨询设置'
            }),
           
            this.setData({
                date: optionsId.date,
                week: optionsId.week,
                start_time: optionsId.start_time,
                end_time: optionsId.end_time,
                address: optionsId.address,
                people_nums: optionsId.people_nums,
                price: optionsId.price,
                id: optionsId.id,
                remark: optionsId.remark,
                openid: app.getCache("userinfo").openid,
                show: true
            })
        )
    },

    // 开始时间
    bindTimeChange: function (e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            start_time: e.detail.value
        })
    },

    // 结束时间
    bindTimeChangeEnd: function (e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            end_time: e.detail.value
        })
    },

    // 日期选择
    bindDateChange: function (e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        var dayValue, day, today, week
        dayValue = e.detail.value
        day = new Date(Date.parse(dayValue.replace(/-/g, '/')))
        today = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")
        week = today[day.getDay()]
        let value = e.detail.value.split('-')
        let newValue = value[0] + '/' + value[1] + '/' + value[2]
        this.setData({
            date: newValue,
            week: week
        })
    },

    submit: function (e) {
        const that = this
        e.detail.value.week = that.data.week
        e.detail.value.openid = that.data.openid

        if (!e.detail.value.people_nums || !e.detail.value.price || !e.detail.value.address){
            wx.showToast({
                title: '请先完善',
                icon: 'none'
            })
        }else{
            wx.showModal({
                title: '提示',
                content: '确定检查完毕！！！',
                confirmColor: '#02c6dc',
                success: (res)=>{
                    if(res.confirm){
                        if (that.data.id) {
                            e.detail.value.id = that.data.id,
                            port.post("member/consult/edit", {
                                param: e.detail.value
                            }, function (res) {
                                if (res.status == 1) {
                                    wx.showToast({
                                        title: '修改成功',
                                        icon: 'success'
                                    },
                                        wx.navigateBack({
                                            delta: 1,
                                        })
                                    )
                                }
                            })
                        } else {
                            port.post("member/consult/add", {
                                param: e.detail.value
                            }, function (res) {
                                if (res.status == 1) {
                                    wx.showToast({
                                        title: '添加成功',
                                        icon: 'success'
                                    },
                                        wx.navigateBack({
                                            delta: 1,
                                        })
                                    )
                                } else {
                                    wx.showToast({
                                        title: '添加失败',
                                        icon: 'loading'
                                    })
                                }
                            })
                        }
                    }else if(res.cancel){
                        console.log('取消')
                    }
                }
            })
        }
    },
    abolish: function(){
        wx.navigateBack({
            delta: 1,
        })
    },

    add(){
        wx.navigateTo({
            url: '/pages/doctor/add/add',
        })
    }
})