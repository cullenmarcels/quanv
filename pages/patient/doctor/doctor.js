const app = getApp(),
  port = app.requirejs("core")
Page({

  data: {
    id: 0,
    concent: [{
      img: '',
      name: '群名称',
      time: '16：00',
      con: '讨论啥呢？说来听听，讨论啥呢？说来听听，讨论啥呢？说来听听，讨论啥呢？说来听听，讨论啥呢？说来听听，讨论啥呢？说来听听，',
      num: 196
    }, ],
    show: false,
    commentIndex: 0,
    commenpage: 0,
    bottom: true,
    display: false,
    comList: []
  },

  onLoad: function(options) {
    const that = this
    this.setData({
      doc_openid: options.openid,
    })
  },

  onShow() {
    const that = this
    wx.getSetting({
      success: (res) => {
        console.log(111)
        if (res.authSetting['scope.userInfo']) {
          if (app.getCache("userinfo") != '') {
            app.getUserInfo(function(res) {
              if (res.openid) {
                that.setData({
                  openid: res.openid,
                  accredit: false,
                  openid: app.getCache("userinfo").openid,
                  openid2: 'sns_wa_' + app.getCache("userinfo").openid
                })
                port.get("sysset/get_sysset", {
                  param: {
                    openid: res.openid
                  }
                }, function(res) {
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
          } else {
            that.setData({
              accredit: true,
              show: true,
            })
          }
          this.port()
        } else {
          that.setData({
            accredit: true,
            show: true,
          })
        }
      }
    })

  },

  port() {
    const that = this
    port.get("member/doctors/doc_index", {
      param: {
        doc_openid: that.data.doc_openid,
        pat_openid: that.data.openid,
        type: 2
      }
    }, function(res) {
      that.setData({
        patient: res.result,
        show: true
      })
    })
  },


  nav: function(e) {
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
      }, function(res) {
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


  setOrder: function(e) {
    wx.navigateTo({
      url: '/pages/patient/setOrder/setOrder?doc_openid=' + e.currentTarget.dataset.doc_openid,
    })
  },

  char(e) {
    console.log(e.currentTarget.dataset.isoverdue)
    if (e.currentTarget.dataset.pat_gzhopenid && e.currentTarget.dataset.gzh_openid) {
      if (e.currentTarget.dataset.isoverdue == 1) {
        wx.navigateTo({
          url: '/pages/patientChat/patientChat?gzh_openid=' + e.currentTarget.dataset.gzh_openid + '&diaglogid=' + e.currentTarget.dataset.diaglogid,
        })
      } else {
        wx.navigateTo({
          url: '/pages/patientChatcost/patientChatcost?gzh_openid=' + e.currentTarget.dataset.gzh_openid + '&default_consult=' + e.currentTarget.dataset.default_consult + '&highgrade_consult=' + e.currentTarget.dataset.highgrade_consult + '&doctorid=' + e.currentTarget.dataset.doctorid,
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '此账号未绑定公众号，请先点击绑定再咨询',
        confirmText: '关注',
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
    }
  },

  essayList() {
    wx.navigateTo({
      url: '/pages/moreArticles/moreArticles?doc_openid=' + this.data.doc_openid,
    })
  },

  videoList() {
    wx.navigateTo({
      url: '/pages/moreVideo/moreVideo?doc_openid=' + this.data.doc_openid,
    })
  },

  essayShow(e) {
    wx.navigateTo({
      url: '/pages/essayShow/essayShow?id=' + e.currentTarget.dataset.id,
    })
  },

  videoShow(e) {
    wx.navigateTo({
      url: '/pages/ViewScreenShow/ViewScreenShow?id=' + e.currentTarget.dataset.id,
    })
  },
  goDocGroup(e){
    wx.navigateTo({
      url: '/pages/doctorGroup/index/index?doc_openid=' + e.currentTarget.dataset.doc_openid + '&user_openid=' + e.currentTarget.dataset.user_openid,
    })
  },


  // 更多讲座
  chairList() {
    wx.navigateTo({
      url: '/pages/chairList/chairList',
    })
  },

  look(e) {
    wx.navigateTo({
      url: '/pages/chairShow/chairShow?id=' + e.currentTarget.dataset.id,
    })
  },

  // 转发
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.patient.realname ? this.data.patient.realname : this.data.patient.nickname,
      path: '/pages/patient/doctor/doctor?openid=' + this.data.doc_openid,
      success: function(res) {
        // 转发成功
        console.log('转发成功')
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },

  // 关注
  attention() {
    const that = this
    port.get("member/follow/set_follow", {
      param: {
        doc_openid: that.data.doc_openid,
        pat_openid: that.data.openid
      }
    }, function(res) {
      if (res.status == 1) {
        if (res.isfollow == 1) {
          wx.showToast({
              title: '关注成功',
              icon: 'success'
            },
            that.port()
          )
        } else {
          wx.showToast({
              title: '取消关注成功',
              icon: 'success'
            },
            that.port()
          )
        }
      } else {
        wx.showToast({
          title: '请求失败',
          icon: 'loading'
        })
      }
    })
  },


  // 送心意
  give: function() {
    wx.navigateTo({
      url: '/pages/doctor/give/give?doc_openid=' + this.data.doc_openid,
    })
  },

  intro(e) {
    wx.navigateTo({
      url: '/pages/doctor/intro/intro?openid=' + e.currentTarget.dataset.openid
    })
  }
})