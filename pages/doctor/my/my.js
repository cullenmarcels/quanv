var app = getApp(),
    port = app.requirejs("core"),
    wxParse = app.requirejs("wxParse/wxParse");
Page({

    data: {
        personage: false,
        refer: false,
        show: false,
        No1: 0,
        No2: 0,
        No3: 0,
        accredit: false
    },

  

    lightning(){
        wx.showToast({
            title: '近期更新',
            icon: 'loading',
        })
    },

    onLoad: function (options) {
        // console.log(app.getCache("userinfo"))
        // this.setData({
        //     openid: app.getCache("userinfo").openid
        // })
    },

    audit(){
        const that = this
        port.get("member/identity/get_data", {
            param: { openid: that.data.openid }
        }, function (res) {
            that.setData({
                identity: res.list,
            })
        })
    },

    collect(){
        wx.navigateTo({
            url: '/pages/patient/collect/collect',
        })
    },

    getInfo: function () {
        var e = this;
        port.get("member", {}, function (r) {
            let followcount = Number(r.followcount)
            let levelname = r.levelname
            let levels = r.levels

            let newLength
            switch (levelname) {
                case 'V1':
                    newLength = parseInt((followcount - Number(levels[0].followcount)) / (Number(levels[1].followcount) - Number(levels[0].followcount))*100)
                    e.setData({
                        No1: 100,
                        No2: newLength,
                        No3: 0,
                    })
                    break;
                case 'V2':
                    newLength = parseInt((followcount - Number(levels[1].followcount)) / (Number(levels[2].followcount) - Number(levels[1].followcount)) * 100)
                    e.setData({
                        No1: 100,
                        No2: 100,
                        No3: newLength,
                    })
                    break;
                case 'V3':
                    e.setData({
                        No1: 100,
                        No2: 100,
                        No3: 100,
                    })
                    break;
                default:
                    newLength = parseInt(followcount / Number(levels[0].followcount) * 100)
                   e.setData({
                       No1: newLength,
                       No2: 0,
                       No3: 0,
                   })
            }

            0 != r.error ? wx.redirectTo({
                url: "/pages/message/auth/index"
            }) : e.setData({
                member: r,
                show: !0
            }),
            wxParse.wxParse("wxParseData", "html", r.copyright, e, "5")
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

            this.getInfo()
            wx.getStorage({
                key: 'set',
                success: function (res) {
                    that.setData({
                        phone: res.data
                    })
                }
            })

            wx.getStorage({
                key: 'role',
                success: function (res) {
                    that.setData({
                        role: res.data,
                    })
                    if(res.data==0){
                        that.navtap()
                    }
                }
            })

            that.audit()
        }
        
    
     
        // wx.getStorage({
        //     key: 'img',
        //     success: function (res) {
        //         that.setData({
        //             imgUrl: res.data
        //         })
        //     }
        // })
      
    },

    navtap() {
        const that = this
        port.get("member/fanskefu/messifans_list_total", {
            param: {
                openid: that.data.openid
            }
        }, function (res) {
            if (res.total.number > 0) {
                wx.showTabBarRedDot({
                    index: 2,
                })
            } else {
                wx.hideTabBarRedDot({
                    index: 2,
                })
            }
        })
    },


    // 我的钱包
    money: function(){
        wx.navigateTo({
            url: '/pages/doctor/money/money',   
        })
    },

    // 上传执业医生证
    practicingCertificate: function(){
        wx.navigateTo({
            url: '/pages/doctor/practicingCertificate/practicingCertificate',
        })
    },
    
    //  上传身份证
    IDcard: function () {
        wx.navigateTo({
            url: '/pages/doctor/IDcard/IDcard',
        })
    },

    // 上传医生资格证
    certification: function(){
        wx.navigateTo({
            url: '/pages/doctor/certification/certification',
        })
    },

    // 完善个人资料
    personage: function(){
        this.setData({
            personage: !this.data.personage
        })
    },

    // 咨询设置
    refer: function () {
        this.setData({
            refer: !this.data.refer
        })
    },

    // 咨询设置里面的每一个小巷
    referLi: function(e){
        e.currentTarget.dataset.state == 1?(
            wx.navigateTo({
                url: '/pages/doctor/setOrder/setOrder',
            })
        ):(
            wx.navigateTo({
                    url: '/pages/doctor/setOrderPhone-Photo/setOrderPhone-Photo?state=' + e.currentTarget.dataset.state,
            })
        )
    },

    // 我的购买
    mybuy(){
        wx.navigateTo({
            url:'/pages/patient/mybuy/mybuy'
        })
    },

    // 我的关注
    attention() {
        wx.navigateTo({
            url: '/pages/patient/myattention/myattention'
        })
    },

    // 我的病情资料库
    datum() {
        wx.navigateTo({
            url: '/pages/patient/mydatum/mydatum?openid='+ this.data.openid
        })
    },

    mychairList(){
        wx.navigateTo({
            url: '/pages/mychairList/mychairList'
        })
    },

    // 我的收入
    patientMoney(){
        wx.navigateTo({
            url: '/pages/patient/money/money'
        })
    },

    applyFor(){
        if (this.data.identity.isaudit == 1 || this.data.identity.isaudit == 3){
            wx.navigateTo({
                url: '/pages/setapplyFor/setapplyFor',
            })
        }else{
            wx.navigateTo({
                url: '/pages/applyFor/applyFor'
            })
        }
        
    },

    phone(e){
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone
        })
    },

    intro(){
        wx.navigateTo({
            url: '/pages/doctor/setintro/setintro'
        })
    },

    // 通知中心
    inform(){
        wx.navigateTo({
            url: '/pages/patient/inform/inform'
        })
    },

    code(){
        wx.navigateTo({
            url: '/pages/doctor/code/code'
        })
    },

    
})