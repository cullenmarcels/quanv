var app = getApp(),
    port = app.requirejs("core"),
    util = require('../../../utils/util');  
Page({
    
    data: {
        date: '',
        time: '00:00',
        timeEnd:'00:00',
        frontImages: [],
        frontImgs: [],
        lecture_title:'',
        lecture_author:'',
        lecture_nums:'',
        lecture_cost:'',
        lecture_address:'',
        lecture_introduction:'',
        show: false,
        year: '',
        month: '',
        day:''
    },

    // 日期选择
    bindDateChange: function (e) {
        let value = e.detail.value.split('-')
        // let newValue = value[0] + ' 年 ' + value[1] + ' 月 ' + value[2] + ' 日'
        this.setData({
            date: e.detail.value,
            // newdate: newValue,
            year: value[0],
            month: value[1],
            day: value[2]
        })
    },

    // 开始时间
    bindTimeChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            time: e.detail.value
        })
    },

    // 结束时间
    bindTimeChangeEnd: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            timeEnd: e.detail.value
        })
    },

    formSubmit: function (e) {
        let id 
        console.log(this.data.id)
        if (this.data.id =='a'){
            id = ''
        }else{
            id = this.data.id
        }
        e.detail.value.id = id
        e.detail.value.openid = this.data.openid
        e.detail.value.cover_url = this.data.frontImgs[0]
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
        e.detail.value.lecture_title && e.detail.value.lecture_nums && e.detail.value.lecture_nums && e.detail.value.lecture_cost && e.detail.value.lecture_author && e.detail.value.lecture_address && e.detail.value.cover_url?(
            console.log(e.detail.value),
            port.post("lectures/add_lecture", {
                param: e.detail.value
            }, function (res) {
                console.log(res,'提交')
                
                res.error == 0?(
                    wx.showToast({
                        title: '提交成功',
                        icon: 'success'
                    },
                        wx.navigateBack({
                            delta: 1
                        })
                    )
                ):(
                    wx.showToast({
                        title: '提交失败',
                        icon: 'loading'
                    })
                )
            })
        ):(
            wx.showToast({
                title: '请填写完整',
                icon: 'none'
            })
        )
    },

    onLoad: function (options) {
        console.log(options.id)
        const that = this
        let value
        let newValue
        options.id != 'a'?(
            port.get("lectures/lecture_detail", {
                param: {
                    id: options.id,
                    openid: app.getCache("userinfo").openid
                }
            }, function (res) {
                console.log(res.res)

                value = res.res.data.split('-')
                // newValue = value[0] + ' 年 ' + value[1] + ' 月 ' + value[2] + ' 日'
                that.setData({
                    id: options.id,
                    res: res.res,
                    status: res.res.status,
                    date: res.res.data,
                    // newdate: newValue,
                    time: res.res.time,
                    timeEnd: res.res.timeEnd,
                    frontImgs: [res.res.cover_url],
                    lecture_title: res.res.lecture_title,
                    lecture_author: res.res.lecture_author,
                    lecture_nums: res.res.lecture_nums,
                    lecture_cost: res.res.lecture_cost,
                    lecture_address: res.res.lecture_address,
                    lecture_introduction: res.res.lecture_introduction,
                    style: options.id,
                    openid: app.getCache("userinfo").openid,
                    show: true,
                    year: value[0],
                    month: value[1],
                    day: value[2],
                    
                })
                
            })
        ):(
            value = util.Data(new Date()).split('-'),
            newValue = value[0] + ' 年 ' + value[1] + ' 月 ' + value[2] + ' 日',
                console.log(newValue),
            this.setData({
                // Data: formatTime(new Date()).data,
                date: util.Data(new Date()),
                newdate: newValue,
                openid: app.getCache("userinfo").openid,
                style: options.id,
                id: options.id,
                show: true
            })
        )
    },

    // 上传封面图片
    upload: function (t) {
        var that = this,
            i = port.data(t),
            s = i.type,
            r = that.data.frontImages,
            n = that.data.frontImgs,
            o = i.index;

        "image" == s ? port.upload(function (t) {
            r.push(t.filename),
                n.push(t.url),
                that.setData({
                    frontImages: r,
                    frontImgs: n
                })
        }) : "image-remove" == s ? (r.splice(o, 1), n.splice(o, 1), that.setData({
            frontImages: r,
            frontImgs: n
        })) : "image-preview" == s && wx.previewImage({
            current: n[o],
            urls: n
        })
    },

    issue: function () {
        const that = this
        wx.showActionSheet({
            itemList: ['修改', '发布'],
            success: function (a) {
                if (a.tapIndex){
                    console.log(that.data.res.id)
                    port.get("lectures/clear_remind", {
                        id: that.data.res.id,
                        type: 2
                    }, function (res) {
                        console.log(res)
                    })
                    port.get("lectures/release_lecture", {
                        id: that.data.res.id
                    }, function (res) {
                        if(res.error == 0){
                            wx.showToast({
                                title: '发布成功',
                                icon: 'success'
                            },
                                wx.navigateBack({
                                    delta: 1
                                })
                            )
                        }else{
                            wx.showToast({
                                title: '发布失败',
                                icon: 'loading'
                            })
                        }
                    })
                }else{
                    that.setData({
                        style: 'a'
                    })
                }
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    },

    amend: function(){
        this.setData({
            style: 'a'
        })
    }
})