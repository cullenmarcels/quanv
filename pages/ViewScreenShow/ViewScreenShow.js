const app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        video: '',
        play: false,
        play2: false,
        show: false,
        inputShow: false,
        value: '',
        display: false,
        page: 0,
        list: [],
        bottom: true,
        rid: '',
        cid: '',
        reply_name: '',
        placeholder:'发表评论',
        focus: false,
       
    },

    onShow() {
        const that = this
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userInfo']) {
                    if (app.getCache("userinfo") != '') {
                        app.getUserInfo(function (res) {
                            // console.log(res.openid, '获取到')
                            if (res.openid) {
                                that.setData({
                                    openid: res.openid,
                                    accredit: false,
                                    openid: app.getCache("userinfo").openid,
                                    openid2: 'sns_wa_' + app.getCache("userinfo").openid
                                })

                                port.get("sysset/get_sysset", {
                                    param: { openid: res.openid }
                                }, function (res) {
                                    wx.setStorage({
                                        key: "set",
                                        data: res.list
                                    })
                                })

                                port.get("member/identity/get_data", {
                                    param: { openid: res.openid }
                                }, function (res) {
                                    var role = res.list.identity
                                    that.setData({
                                        role: role
                                    })
                                    wx.setStorage({
                                        key: "role",
                                        data: res.list.identity
                                    })
                                    if (role == 1) {
                                        wx.setTabBarItem({
                                            index: 0,
                                            text: '工作站',
                                            iconPath: "static/images/demo/append1.png",
                                            selectedIconPath: "static/images/demo/append.png"
                                        })
                                        wx.setTabBarItem({
                                            index: 1,
                                            text: '我的患者',
                                            iconPath: "static/images/demo/love1.png",
                                            selectedIconPath: "static/images/demo/love.png"
                                        })
                                        wx.setTabBarItem({
                                            index: 2,
                                            text: '我的主页',
                                            iconPath: "static/images/demo/home.png",
                                            selectedIconPath: "static/images/demo/home-l.png"
                                        })
                                    } else {
                                        wx.setTabBarItem({
                                            index: 0,
                                            text: '首页',
                                            iconPath: "static/images/demo/home.png",
                                            selectedIconPath: "static/images/demo/home-l.png"
                                        })
                                        wx.setTabBarItem({
                                            index: 1,
                                            text: '我的医生',
                                            iconPath: "static/images/demo/focus.png",
                                            selectedIconPath: "static/images/demo/focus-l.png"
                                        })
                                        wx.setTabBarItem({
                                            index: 2,
                                            text: '我的咨询',
                                            iconPath: "static/images/demo/consult.png",
                                            selectedIconPath: "static/images/demo/consult-l.png"
                                        })
                                    }
                                })
                            } else {
                                that.setData({
                                    accredit: true,
                                    show: true
                                })
                            }
                        })
                        this.port()
                    } else {
                        that.setData({
                            accredit: true,
                            show: true,
                        })
                    }
                }else{
                    that.setData({
                        accredit: true,
                        show: true,
                    })
                }
            }
        })
    },


    onLoad: function (options) {
        console.log(options)
        const that = this
        this.setData({
            id: options.id,
            // openid: app.getCache("userinfo").openid
        })
        // this.port()
       
    },

    onReachBottom() {
        this.commentList()
    },

    // 评论列表
    commentList() {
        const that = this
        if (this.data.bottom) {
            let param = {}
            param.page = that.data.page + 1
            param.pageSize = 10
            param.type = 1
            param.pid = that.data.id
            param.openid = that.data.openid
            port.get("member/comments/comments_list", {
                param: param
            }, function (res) {
                if (res.error == 0) {
                    if (res.list.length == 0) {
                        return that.setData({
                            bottom: false,
                            display: true,
                            show: true,
                            listlength: res.comments_total
                        })
                    } else {
                        that.setData({
                            list: that.data.list.concat(res.list),
                            page: param.page,
                            display: true,
                            show: true,
                            listlength: res.comments_total
                        })
                    }
                }
            })
        }
    },

    // 文章点赞
    click(e) {
        const that = this
        let param = {}
        param.openid = that.data.openid
        param.pid = that.data.id
        param.type = 1
        port.get("member/comments/click_like", {
            param: param
        }, function (res) {
            if (res.status != 0) {
                if (res.status == 1) {
                    that.data.video.islike = res.status
                } else {
                    that.data.video.islike = 0
                }
                that.data.video.like_total = res.like_total
                that.setData({
                    video: that.data.video
                })
            } else {
                wx.showToast({
                    title: '点赞失败',
                    icon: 'loading'
                })
            }
        })
    },

    // 视频详情
    port(){
        const that = this
        port.get("member/videos/get_detail", {
            param:{
                id: that.data.id,
                openid: that.data.openid
            }
        }, function (res) {
            if (res.error == 0) {
                let url = res.list.videoinfo.transcodeInfo.transcodeList[res.list.videoinfo.transcodeInfo.transcodeList.length - 1].url
                that.setData({
                    video: res.list,
                    video2: {
                        url: url,
                        fileId: res.list.fileid,
                        coverUrl: res.list.videoinfo.snapshotByTimeOffsetInfo.snapshotByTimeOffsetList[0].picInfoList[0].url
                    },
                    show: true
                })
                that.commentList()
            }
        })
    },


    bindplay(){
       const that = this
        // 判断是否该付费
       if (that.data.video.money != 0 && that.data.video.paystatus == 0 && that.data.openid != that.data.video.openid_wa){
           this.audioPause() 
        }else{
            this.videoContext.play()
            that.setData({
                play2: true
            })
            port.get("member/videos/add_playcount", {
                id: that.data.video.id
            }, function (res) {})
        }
    },

    // 调用支付
    hint(){
        const that = this
        wx.showModal({
            title: '提示',
            content: '此视频需要购买才能播放',
            confirmText: '去购买',
            cancelText: '再想想',
            success: function (res) {
                if (res.confirm) {
                    let param = {
                        openid: that.data.openid,
                        goodsid: that.data.video.id,
                        goodstype: 2,
                        price: that.data.video.money,
                        total: 1,
                        optionname: '视频播放'
                    }
                    port.get("order/newpay/createpay", {
                        param: param
                    }, function (res) {
                        let orderid = res.order.orderid
                        if (orderid) {
                            wx.requestPayment({
                                'timeStamp': res.wechat.payinfo.timeStamp,
                                'nonceStr': res.wechat.payinfo.nonceStr,
                                'package': res.wechat.payinfo.package,
                                'signType': 'MD5',
                                'paySign': res.wechat.payinfo.paySign,
                                'success': function (res) {
                                   
                                        // 修改支付状态
                                        port.get("order/newpay/complete", {
                                            param: {
                                                openid: that.data.openid,
                                                orderid: orderid
                                            }
                                        }, function (res) {
                                            if (res.status == 1)
                                                wx.showToast({
                                                    title: '购买成功',
                                                    icon: 'success',
                                                },
                                                    that.port()
                                                )
                                        })
                                    
                                },
                                'fail': function (res) {
                                    wx.showToast({
                                        title: '支付失败',
                                        icon: 'loading',
                                    })
                                }
                            })
                        } else {
                            wx.showToast({
                                title: '请求失败',
                                icon: 'loading',
                            })
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    audioPause: function () {
        const that = this
        this.videoContext.pause()
        this.setData({
            play2: false
        })
        this.hint()
    },

    // 获取视屏上下文组件
    onReady(){
        this.videoContext = wx.createVideoContext('myVideo')
    },   

    // 点击播放
    play(){
        this.setData({
            play2: true
        })
        const that = this
        
    },

    // 点击暂停
    pause(){
        this.setData({
            play2: false
        })
    },

    setOrder: function (e) {
        wx.navigateTo({
            url: '/pages/patient/setOrder/setOrder?doc_openid=' + e.currentTarget.dataset.doc_openid,
        })
    },

    char(e) {
        wx.navigateTo({
            url: '/pages/patientChatcost/patientChatcost?gzh_openid=' + e.currentTarget.dataset.gzh_openid + '&default_consult=' + e.currentTarget.dataset.default_consult + '&highgrade_consult=' + e.currentTarget.dataset.highgrade_consult + '&doctorid=' + e.currentTarget.dataset.doctorid,
        })
    },

    onShareAppMessage: function (res) {
        const that = this
        if (res.from === 'button') {
            // 来自页面内转发按钮
            // console.log(res.target)
        }
        return {
            title: this.data.video.videoname,
            path: '/pages/ViewScreenShow/ViewScreenShow?id=' + this.data.video.id,
            success: function (res) {
                // 转发成功
                port.get("member/comments/turn", {
                    param: {
                        video_id: that.data.id,
                        type: 2,
                    }
                }, function (res) {
                    res.status == 1 ? (
                        that.data.video.turn_nums = res.turn_nums,
                        that.setData({
                            video: that.data.video
                        })
                    ) : (
                            wx.showToast({
                                title: '转发失败',
                                icon: 'none'
                            })
                        )
                })
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },

    // 关注
    attention() {
        const that = this
        port.get("member/follow/set_follow", {
            param: {
                doc_openid: that.data.video.openid,
                pat_openid: that.data.openid
            }
        }, function (res) {
            if (res.status == 1) {
                if (res.isfollow == 1) {
                    wx.showToast({
                        title: '关注成功',
                        icon: 'success'
                    },
                        that.port()
                    )
                }else{
                    wx.showToast({
                        title: '取消关注成功',
                        icon: 'success'
                    },
                        that.port()
                    )
                }
            }else{
                wx.showToast({
                    title: '请求失败',
                    icon: 'loading'
                })
            }
        })
    },

    inputShow(e) {
        const that = this
        if (e.currentTarget.dataset.ico == 'ico'){
            var query = wx.createSelectorQuery()
            query.select('#ico').boundingClientRect()
            query.selectViewport().scrollOffset()
            query.exec(function (res) {
                let top = res[0].top + res[1].scrollTop 
                wx.pageScrollTo({
                    scrollTop: top,
                    duration: 300
                },setTimeout(function(){
                    that.setData({
                        focus: true
                    })
                },500))
            })
        }
        this.setData({
            placeholder: '发表评论',
            inputShow: !this.data.inputShow,
            rid: '',
            cid: '',
            commenttype: e.currentTarget.dataset.commenttype,
            reply_name: ''
        })
    },

    bindinput(e) {
        this.setData({
            value: e.detail.value
        })
    },

    // 收藏
    collect() {
        const that = this
        port.get("member/comments/add_collection", {
            param: {
                pid: that.data.id,
                openid: that.data.openid,
                type: 1
            }
        }, function (res) {
            if (res.status != 0) {
                if (res.status == 1) {
                    that.data.video.iscollection = 1
                } else {
                    that.data.video.iscollection = 0
                }
                that.data.video.collection_total = res.collection_total
                that.setData({
                    video: that.data.video
                })
            } else {
                wx.showToast({
                    title: '收藏失败',
                    icon: 'loading'
                })
            }
        })
    },

    // 评论输入
    publish() {
        const that = this
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        
        if (!re.test(that.data.value) && that.data.value){
            let commenttype = Number(that.data.commenttype) 
            switch (commenttype){
                case 2:
                    port.get("member/comments/add_comments", {
                        param: {
                            pid: that.data.id,
                            type: 2,
                            openid: that.data.openid,
                            content: that.data.value,
                            cid: that.data.cid,
                            rid: that.data.rid,
                            reply_name: that.data.reply_name
                        }
                    }, function (res) {
                        for (var i = 0; i < that.data.list.length; i++) {
                            if (that.data.list[i].id == res.list.id) {
                                that.data.list[i] = res.list
                                that.data.list[i].sonShow = true
                            }
                        }
                        that.setData({
                            list: that.data.list,
                            value: '',
                            inputShow: false,
                            cid: '',
                            rid: '',
                            placeholder: '发表评论',
                            reply_name: ''
                        })
                    })
                    break;
                case 3:
                    port.get("member/comments/add_comments", {
                        param: {
                            pid: that.data.id,
                            type: 2,
                            openid: that.data.openid,
                            content: that.data.value,
                            cid: that.data.cid,
                            rid: that.data.rid,
                            reply_name: that.data.reply_name
                        }
                    }, function (res) {
                        for (var i = 0; i < that.data.list.length; i++) {
                            if (that.data.list[i].id == res.list.id) {
                                that.data.list[i] = res.list
                                that.data.list[i].sonShow = true
                            }
                        }
                        that.setData({
                            list: that.data.list,
                            value: '',
                            inputShow: false,
                            cid: '',
                            rid: '',
                            placeholder: '发表评论',
                            reply_name:''
                        })
                    })
                    break;
                default:
                    port.get("member/comments/add_comments", {
                        param: {
                            pid: that.data.id,
                            type: 1,
                            openid: that.data.openid,
                            content: that.data.value,
                            cid: that.data.cid,
                            rid: that.data.rid,
                            reply_name: that.data.reply_name
                        }
                    }, function (res) {
                        that.data.list.unshift(res.list)
                        that.data.video.comments_total = res.comments_total
                        if (res.status == 1) {
                            that.data.video.iscomments = 1
                        } else if (res.status == 2) {
                            that.data.video.iscomments = 0
                        }

                        that.setData({
                            list: that.data.list,
                            value: '',
                            inputShow: false,
                            listlength: res.comments_total,
                            // video: that.data.video,
                            cid: '',
                            rid: '',
                            placeholder: '发表评论',
                            reply_name:''
                        })
                    })
            }
        }else{
            wx.showToast({
                title: '请先输入内容',
                icon: 'loading'
            })
        }
    },

    // 评论的评论
    sonpraise(e) {
        let name
        if (e.currentTarget.dataset.item.realname){
            name = e.currentTarget.dataset.item.realname
        }else{
            name = e.currentTarget.dataset.item.nickname
        }
        this.setData({
            placeholder: '回复 ' + name + ' :',
            cid: e.currentTarget.dataset.item.id,
            rid: '',
            reply_name: '',
            inputShow: true,
            commenttype: e.currentTarget.dataset.commenttype,
        })
    },

    // 点击查看全部
    all(e) {
        this.data.list[e.currentTarget.dataset.index].sonShow = true
        this.setData({
            list: this.data.list
        })
    },

    // 评论点赞
    comClick(e) {
        const that = this
        let param = {}
        param.openid = that.data.openid
        param.pid = e.currentTarget.dataset.pid
        param.type = 2
        port.get("member/comments/click_like", {
            param: param
        }, function (res) {
            if (res.status != 0) {
                that.data.list[e.currentTarget.dataset.index].islike = res.status
                that.data.list[e.currentTarget.dataset.index].commentslike_total = res.like_total
                that.setData({
                    list: that.data.list
                })
            } else {
                wx.showToast({
                    title: '点赞失败',
                    icon: 'loading'
                })
            }
        })
    },

    doctor(e) {
        wx.navigateTo({
            url: '/pages/patient/doctor/doctor?openid=' + e.currentTarget.dataset.openid,
        })
    },

    // 送心意
    give: function () {
        wx.navigateTo({
            url: '/pages/doctor/give/give?doc_openid=' + this.data.video.openid,
        })
    },

    // 点击二级评论
    sonItem(e){
        let name
        if (e.currentTarget.dataset.sonitem.realname){
            name = e.currentTarget.dataset.sonitem.realname
        }else{
            name = e.currentTarget.dataset.sonitem.nickname
        }
        this.setData({
            placeholder: '回复 ' + name + ' :',
            commenttype: 3,
            rid: e.currentTarget.dataset.sonitem.id,
            cid: e.currentTarget.dataset.sonitem.cid,
        })
    },

    // 点击二级评论回复
    sonsItem(e){
        let name
        if (e.currentTarget.dataset.sonsitem.realname) {
            name = e.currentTarget.dataset.sonsitem.realname
        } else {
            name = e.currentTarget.dataset.sonsitem.nickname
        }
        this.setData({
            placeholder: '回复 ' + name + ' :',
            reply_name: name,
            commenttype: 3,
            rid: e.currentTarget.dataset.sonsitem.rid,
            cid: e.currentTarget.dataset.sonitem.cid,
        })
    }
})