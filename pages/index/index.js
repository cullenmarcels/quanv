const app = getApp(),
port = app.requirejs("core");

Page({

  data: {
    show: false,
    imgUrls: [],
    accredit: false
  },

  bindgetuserinfo(e) {
    let that = this
    if (e.detail.errMsg == 'getUserInfo:ok') {
      console.log("授权:", e.detail);
      let tt = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        userInfo: e.detail.userInfo
      }
      let i
      app.getUserInfo(function(res) {

        if (res.openid) {
          that.setData({
            openid: res.openid,
            accredit: false,
            show: false,
          })
          that.onShow()
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '拒绝授权，将影响您的功能体验',
        confirmText: '授权',
        confirmColor: '#02c6dc',
        success: (res) => {
          if (res.confirm) {
            wx.getSetting({
              success: (res) => {
                if (res.authSetting['scope.userInfo']) {
                  wx.openSetting({
                    success: (res) => {
                      if (res.authSetting['scope.userInfo']) {
                        wx.getUserInfo({
                          withCredentials: true,
                          success: (res) => {
                            app.getUserInfo(function(res) {
                              if (res.openid) {
                                that.setData({
                                  openid: res.openid,
                                  accredit: false,
                                  show: false,
                                })
                                that.onShow()
                              }
                            })
                          }
                        })
                      } else {
                        wx.showToast({
                          title: '授权失败',
                          icon: 'loading'
                        })
                      }
                    }
                  })
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    }
  },

  // 获取数据
  getShop: function() {
    const that = this;
    port.get("shop/get_shopindex", {}, function(a) {})
  },

  onLoad: function(a) {
    app.url(a);
    port.get("newshop/get_goodsswitch", {}, function(res) {
      console.log("get_goodsswitch==>", res);
      if (res.goodsswitch == 1) {
        wx.reLaunch({
          url: '/pages/patient/myattention/myattention'
        })
      }
    })
  },

  lightning() {
    wx.showToast({
      title: '近期更新',
      icon: 'loading',
    })
  },


  onShow: function() {
    this.getShop();
    const that = this
    var a = app.getCache("sysset");

    wx.setNavigationBarTitle({
      title: a.shopname || "全V健康"
    })

    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          if (app.getCache("userinfo") != '') {

            app.getUserInfo(function(res) {

              if (res.openid) {
                that.setData({
                  openid: res.openid,
                  accredit: false
                })
                console.log("开始获取首页资料!");
                port.post("member/member/get_memadv", {
                  param: {
                    openid: res.openid
                  }
                }, function(res) {
                  console.log("banner获取成功!", res.list);
                  that.setData({
                    banner: res.list
                  })
                })

                port.get("sysset/get_sysset", {
                  param: {
                    openid: res.openid
                  }
                }, function(res) {
                  console.log("sysset获取成功!", res.list);
                  wx.setStorage({
                    key: "set",
                    data: res.list
                  })
                })

                port.get("member/identity/get_data", {
                  param: {
                    openid: res.openid
                  }
                }, function(res) {
                  console.log("identity获取成功!", res.list);
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
                    that.doctorPort()
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
                    that.patientPort()
                  }
                })
              } else {

                that.setData({
                  accredit: true,
                  show: true
                })
              }
            })

          } else {

            that.setData({
              accredit: true,
              show: true
            })
          }
        } else {
          that.setData({
            accredit: true,
            show: true
          })
        }
      }
    })
  },

  navtap() {
    const that = this;
    port.get("member/fanskefu/messifans_list_total", {
      param: {
        openid: that.data.openid
      }
    }, function(res) {
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

  // 调取医生首页
  doctorPort() {
    const that = this
    port.get("newshop/get_docindex", {}, function(res) {

      if (res.error == 0) {
        that.setData({
          doctors: res.sorts,
          show: true
        })
      }
    })

    port.get("member/fanskefu/messikefu_list_total", {
      param: {
        openid: that.data.openid
      }
    }, function(res) {
      if (res.total.unrecovered != 0 || res.total.new != 0) {
        that.setData({
          dain1: true
        })
      } else {
        that.setData({
          dain1: false
        })
      }
    })
    port.get("member/consult/get_docconsult_total", {
      param: {
        openid: that.data.openid
      }
    }, function(res) {
      if (res.list.release != 0) {
        that.setData({
          dain2: true
        })
      } else {
        that.setData({
          dain2: false
        })
      }
    })
  },

  // 调取患者首页
  patientPort() {
    const that = this
    port.get("vindex/get_pat_index", {}, function(res) {

      if (res.error == 0) {
        that.setData({
          patients: res.patients,
          show: true
        })
      }
    })
    that.navtap()
  },

  // 点击搜索进入搜索页
  search: function() {
    wx.navigateTo({
      url: '/pages/doctor/search/search',
    })
  },

  // 点击当面咨询
  order: function() {
    wx.navigateTo({
      url: '/pages/doctor/order/order',
    })
  },

  // 我的视屏
  myViewScreen: function() {
    wx.navigateTo({
      url: '/pages/doctor/myViewScreen/myViewScreen',
    })
  },

  // 我的文章
  myEssay: function() {
    wx.navigateTo({
      url: '/pages/doctor/myEssay/myEssay',
    })
  },

  // 线下讲座
  chair: function() {
    wx.navigateTo({
      url: '/pages/doctor/chair/chair',
    })
  },

  // 医生集团
  doctor: function() {
    wx.showToast({
      title: '近期更新',
      icon: 'loading',
    })
  },

  // 图文咨询
  consult: function() {
    wx.navigateTo({
      url: '/pages/doctor/consult/consult',
    })
  },

  // 找医生
  patient: function() {
    wx.navigateTo({
      url: '/pages/patient/patient/patient',
    })
  },

  doctorhome: function(e) {
    wx.navigateTo({
      url: '/pages/patient/doctor/doctor?openid=' + e.currentTarget.dataset.openid,
    })
  },

  // 文章详情
  essayShow: function(e) {
    wx.navigateTo({
      url: '/pages/essayShow/essayShow?id=' + e.currentTarget.dataset.id,
    })
  },

  // 视屏详情
  videoShow: function(e) {
    wx.navigateTo({
      url: '/pages/ViewScreenShow/ViewScreenShow?id=' + e.currentTarget.dataset.id,
    })
  },

  look(e) {
    wx.navigateTo({
      url: '/pages/chairShow/chairShow?id=' + e.currentTarget.dataset.id,
    })
  },

  // 更多讲座
  chairList() {
    wx.navigateTo({
      url: '/pages/chairList/chairList',
    })
  },

  Articles() {
    wx.navigateTo({
      url: '/pages/Articles/Articles',
    })
  },

  boutiqueVideo() {
    wx.navigateTo({
      url: '/pages/boutiqueVideo/boutiqueVideo',
    })
  },

  imagesHeight: function(t) {
    var width = t.detail.width,
      height = t.detail.height,
      o = t.target.dataset.type,
      i = {},
      s = this;
    wx.getSystemInfo({
      success: function(t) {
        i[o] = t.windowWidth / width * height,
          (!s.data[o] || s.data[o] && i[o] < s.data[o]) && s.setData(i)
      }
    })
  },

  Height: function(t) {
    var width = t.detail.width,
      height = t.detail.height,
      o = t.target.dataset.type,
      i = {},
      s = this;
    wx.getSystemInfo({
      success: function(t) {
        i[o] = t.windowWidth / width * height,
          (!s.data[o] || s.data[o] && i[o] < s.data[o]) && s.setData(i)
      }
    })
  },


  bannerShow(e) {
    wx.navigateTo({
      url: '/pages/videoList/videoList?id=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type
    })
  }


})