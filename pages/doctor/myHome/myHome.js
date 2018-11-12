var app = getApp(),
    port = app.requirejs("core")
Page({
    data: {
        nav:['图文咨询','当面咨询','电话咨询'],
        id: 0,
        concent: [
            { img: '', name: '群名称', time: '16：00', con: '讨论啥呢？说来听听，讨论啥呢？说来听听，讨论啥呢？说来听听，讨论啥呢？说来听听，讨论啥呢？说来听听，讨论啥呢？说来听听，', num: 196 }
        ],
        show: true,
        commentIndex: 0,
        commenpage: 0,
        bottom: true,
        display: false,
        comList: [],

        navIndex: 0,
        page: 0,
        list: [],
        accredit: false
    },

    onLoad: function (options) {
        // this.setData({
        //     openid: app.getCache("userinfo").openid
        // })
    },

    pat_gzhopenid() {
        const that = this
        port.get("member/member/user_binding", {
            param: { openid: that.data.openid }
        }, function (res) {
            that.setData({
                pat_gzhopenid: res.list.gzhopenid,
                show: true
            })
            if (!res.list.gzhopenid) {
                wx.showModal({
                    title: '提示',
                    content: '此账号未绑定公众号，请先点击绑定再咨询,绑定之后如若未关注公众号，请到微信搜索“全V健康”公众号并关注，以便接收动态回复消息！！！',
                    confirmText: '绑定',
                    confirmColor: '#02c6dc',
                    success: (res) => {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: '/pages/web-view/web-view',
                            })
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
            }else{
                that.patient()
            }
        })
    },

    onShow: function () {
        const that = this
        if (app.getCache("userinfo")=='') {
            this.setData({
                accredit: true,
                show: true,
            })
        } else {
            this.setData({
                accredit: false,
                openid: app.getCache("userinfo").openid
            })
            
        

            wx.getStorage({
                key: 'role',
                success: function (res) {
                    that.setData({
                        role: res.data
                    })
                    if (res.data == 1) {
                        wx.setNavigationBarTitle({
                            title: '我的主页',
                        })
                        that.port()
                    } else {
                        wx.setNavigationBarTitle({
                            title: '我的咨询',
                        })
                        
                        that.setData({
                            commenpage: 0,
                            bottom: true,
                            display: false,
                            comList: [],
                            page: 0,
                            list: [],
                        })
                        that.pat_gzhopenid()
                        that.messifans_list_total()
                    }
                }
            })
        }
       
    },

    messifans_list_total(){
        const that = this
        port.get("member/fanskefu/messifans_list_total", {
            param: {
                openid: that.data.openid
            }
        }, function (res) {
            if (res.total.number>99){
                res.total.number = "99+"
                
            }
            if (res.total.number>0){
                wx.showTabBarRedDot({
                    index: 2,
                })
            } else {
                wx.hideTabBarRedDot({
                    index: 2,
                })
            }
            that.setData({
                total: res.total.number
            })
        })
    },

    onReachBottom(){
        if(this.data.role == 1){

        }else{
            this.patient()
        }
    },

    // 获取患者端信息
    patient(){
        const that = this
        let param = {}
        param.openid = that.data.openid
        param.page = Number(that.data.page) + 1
        param.pageSize = 200
        if(that.data.bottom){
            wx,wx.showLoading({
                title: '加载中...'
            })
            if (that.data.navIndex == 0) {
                port.get("member/fanskefu/messifans_list", {
                    param: param
                }, function (res) {
                    wx.hideLoading()
                    if (res.status == 0){
                        that.setData({
                            show: true,
                        })
                        wx.showModal({
                            title: '提示',
                            content: '此账号未绑定公众号，请先绑定,绑定后如若未关注公众号，请到微信搜索“全V健康”公众号并关注，以便接收动态消息回复！！！',
                            confirmText: '绑定',
                            confirmColor: '#02c6dc',
                            success: (res)=>{
                                if (res.confirm) {
                                    wx.navigateTo({
                                        url: '/pages/web-view/web-view',
                                    })
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                }
                            }
                        })
                    }else{
                        if (res.messikefu_list.length == 0) {
                            return that.setData({
                                show: true,
                                bottom: false,
                                display: true
                            })
                        } else {
                            let reg = /^[a-zA-Z0-9_-]{64}$/
                           
                            for (var i = 0; i < res.messikefu_list.length;i++){
                                if (res.messikefu_list[i].kefulastcon.substr(-4) == '.gif' || res.messikefu_list[i].kefulastcon.substr(-4) == '.jpg' || res.messikefu_list[i].kefulastcon.substr(-4) == '.png'){
                                    res.messikefu_list[i].kefulastcon = '[图片]'
                                }else if (reg.test(res.messikefu_list[i].kefulastcon)){
                                    res.messikefu_list[i].kefulastcon = '[语音]'
                                }

                                res.messikefu_list[i].kefulastcon = res.messikefu_list[i].kefulastcon.replace(/&nbsp;/g, " ")
                                res.messikefu_list[i].kefulastcon = res.messikefu_list[i].kefulastcon.replace(/&lt;br&gt;/g, "<br>")

                                if (res.messikefu_list[i].lastcon.substr(-4) == '.gif' || res.messikefu_list[i].lastcon.substr(-4) == '.jpg' || res.messikefu_list[i].lastcon.substr(-4) == '.png') {
                                    res.messikefu_list[i].lastcon = '[图片]'
                                } else if (reg.test(res.messikefu_list[i].lastcon)) {
                                    res.messikefu_list[i].lastcon = '[语音]'
                                }

                                res.messikefu_list[i].lastcon = res.messikefu_list[i].lastcon.replace(/&nbsp;/g, " ")
                                res.messikefu_list[i].lastcon = res.messikefu_list[i].lastcon.replace(/&lt;br&gt;/g, "<br>")

                                if (res.messikefu_list[i].kefulastcon.indexOf('<span class="red">系统提示：</span><br/>') != -1) {
                                    res.messikefu_list[i].kefulastcon = '[系统提示]'
                                }
                                if (res.messikefu_list[i].lastcon.indexOf('<span class="red">系统提示：</span><br/>') != -1) {
                                    res.messikefu_list[i].lastcon = '[系统提示]'
                                }
                                
                               
                            }
                           
                          
                            that.setData({
                                show: true,
                                list: that.data.list.concat(res.messikefu_list),
                                page: param.page,
                                display: true
                            })
                        }
                    }
                })
            } else {
                port.get("member/consult/pat_consults", {
                    param: param
                }, function (res) {
                    wx.hideLoading()
                    if (res.list.length == 0) {
                        return that.setData({
                                    show: true,
                                    bottom: false,
                                    display: true
                                })
                    }else{
                        for (var i = 0; i < res.list.length; i++) {
                            res.list[i].newData = res.list[i].start_time.split(' ')[0]
                            if (Number(res.list[i].start_time.split(' ')[1].split(':')[0]) > 11) {
                                res.list[i].newTime = '下午' + ' ' + (Number(res.list[i].start_time.split(' ')[1].split(':')[0]) - 12) + ':' + res.list[i].start_time.split(' ')[1].split(':')[1]
                            } else {
                                res.list[i].newTime = '上午' + ' ' + Number(res.list[i].start_time.split(' ')[1].split(':')[0]) + ':' + res.list[i].start_time.split(' ')[1].split(':')[1]
                            }
                            res.list[i].newData.split('/')
                            res.list[i].newData = res.list[i].newData.split('/')[0] + '-' + res.list[i].newData.split('/')[1] + '-' + res.list[i].newData.split('/')[2]

                        }
                        that.setData({
                            show: true,
                            list: that.data.list.concat(res.list),
                            page: param.page,
                            display: true
                        })
                    }  
                })
            }
        }
        
    },

    // 获取医生端信息
    port() {
        const that = this
        port.get("member/doctors/doc_index", {
            param: {
                doc_openid: that.data.openid,
                type: 1
            }
        }, function (res) {
            that.setData({
                patient: res.result,
                show: true
            })
        })
    },


    nav: function (e) {
        const that = this
        that.setData({
            id: e.currentTarget.dataset.id
        })
        if (e.currentTarget.dataset.id == 2 && this.data.comList.length == 0) {
            that.comment()
        }
       
    },

    com(e) {
        this.setData({
            commentIndex: e.currentTarget.dataset.type,
            commenpage: 0,
            bottom: true,
            display: false,
            comList: []
        })
        this.comment()
    },

    // 获取医生端
    comment() {
        const that = this
        let e = {}
        e.openid = that.data.patient.gzh_openid
        e.type = that.data.commentIndex
        e.page = Number(that.data.commenpage) + 1
        e.pageSize = 10
        if (this.data.bottom) {
            port.get("member/doctors/appraise", {
                param: e
            }, function (res) {
                if (res.error == 0) {
                    if (res.list.length == 0) {
                        return that.setData({
                            bottom: false,
                            display: true,
                            comListnav: res.total
                        })
                    } else {
                        that.setData({
                            comList: that.data.comList.concat(res.list),
                            page: e.page,
                            display: false,
                            comListnav: res.total
                        })
                    }
                }
            })
        }
    },

    // 医生端的图文咨询
    setOrder: function (e) {
        wx.navigateTo({
            url: '/pages/doctor/order/order',
        })
    },

    // 医生端的当面咨询
    char(e) {
        wx.navigateTo({
            url: '/pages/doctor/consult/consult',
        })
    },

    essayList(e) {
        wx.navigateTo({
            url: '/pages/Articles/moreArticles/moreArticles?doc_openid=' + e.currentTarget.dataset.openid
        })
    },

    videoList(e) {
        wx.navigateTo({
            url: '/pages/boutiqueVideo/moreVideo/moreVideo?doc_openid=' + e.currentTarget.dataset.openid,
        })
    },

    // 文章详情
    essayShow(e) {
        wx.navigateTo({
            url: '/pages/essayShow/essayShow?id=' + e.currentTarget.dataset.id,
        })
    },

    // 视频详情
    videoShow(e) {
        wx.navigateTo({
            url: '/pages/ViewScreenShow/ViewScreenShow?id=' + e.currentTarget.dataset.id,
        })
    },


    // 更多讲座
    chairList() {
        wx.navigateTo({
            url: '/pages/chairList/chairList',
        })
    },

    // 讲座详情
    look(e) {
        wx.navigateTo({
            url: '/pages/chairShow/chairShow?id=' + e.currentTarget.dataset.id,
        })
    },

    give: function () {
        wx.showToast({
            title: '近期更新',
            icon: 'loading',
        })
    },

    // 医生简介
    intro(e) {
        wx.navigateTo({
            url: '/pages/doctor/intro/intro?openid=' + e.currentTarget.dataset.openid
        })
    },


    // 我的咨询头部切换
    navView(e){
        this.setData({
            navIndex: e.currentTarget.dataset.index,
            list: [],
            page: 0,
            bottom: true,
            display: false,
        })
        this.patient()
        this.messifans_list_total()
    },

    // 进入聊天室
    patientChat(e){
        wx.navigateTo({
            url: '/pages/patientChat/patientChat?gzh_openid=' + e.currentTarget.dataset.gzh_openid + '&diaglogid=' + e.currentTarget.dataset.diaglogid
        })
    },

    // 当面预约详情
    faceshow(e){
        wx.navigateTo({
            url: '/pages/patient/orderListShow/orderListShow?consult_logid=' + e.currentTarget.dataset.consult_logid
        })
    }
})