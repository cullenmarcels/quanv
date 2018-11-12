var app = getApp(),
  port = app.requirejs("core")
Page({

  data: {
    show: false,
    inputShow: false,
    value: '',
    display: false,
    click: '查看图片',
    page: 0,
    list: [],
    bottom: true,
    display: false,
    rid: '',
    commenttype: 0,
    rid: '',
    cid: '',
    reply_name: '',
    placeholder: '发表评论',
    time: 0,
    focus: false
  },

  bindgetuserinfo(e) {
    let that = this
    if (e.detail.errMsg == 'getUserInfo:ok') {
      // console.log(e.detail)
      wx.showLoading({
        title: '授权中...',
      })
      let tt = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        userInfo: e.detail.userInfo
      }
      let i
      app.getUserInfo(function(res) {
        // console.log(res,'回来')
        wx.hideLoading()
        if (res.openid) {
          that.setData({
            openid: res.openid,
            accredit: false,
            show: false,
          })
          that.onShow()
        }
      }, i, tt)
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
                            // console.log(res)
                            let tt = {
                              encryptedData: res.encryptedData,
                              iv: res.iv,
                              userInfo: res.userInfo
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

  onShow() {
    const that = this
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          if (app.getCache("userinfo") != '') {
            app.getUserInfo(function(res) {
              // console.log(res.openid, '获取到')
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
            that.show()
            that.commentList()
            that.add_click_nums()
          } else {
            that.setData({
              accredit: true,
              show: true,
            })
          }
        } else {
          that.setData({
            accredit: true,
            show: true,
          })
        }
      }
    })

  },



  onLoad: function(options) {
    console.log(options)
    const that = this
    this.setData({
      id: options.id,
    })
  },

  add_click_nums() {
    const that = this
    port.get("articles/add_click_nums", {
      id: that.data.id
    }, function(res) {})
  },

  onReachBottom() {
    this.commentList()
  },

  // 收藏
  collect() {
    const that = this
    port.get("member/comments/add_collection", {
      param: {
        pid: that.data.id,
        openid: that.data.openid,
        type: 2
      }
    }, function(res) {
      if (res.status != 0) {
        if (res.status == 1) {
          that.data.essay.iscollection = 1
        } else {
          that.data.essay.iscollection = 0
        }
        that.data.essay.collection_total = res.collection_total
        that.setData({
          essay: that.data.essay
        })
      } else {
        wx.showToast({
          title: '收藏失败',
          icon: 'loading'
        })
      }
    })
  },

  // 评论列表
  commentList() {
    const that = this
    if (this.data.bottom) {
      let param = {}
      param.page = that.data.page + 1
      param.pageSize = 10
      param.type = 3
      param.pid = that.data.id
      param.openid = that.data.openid
      port.get("member/comments/comments_list", {
        param: param
      }, function(res) {
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

  show() {
    const that = this
    port.get("articles/article_detail", {
      param: {
        id: that.data.id,
        openid: that.data.openid
      }
    }, function(res) {
      console.log(res)
      that.setData({
        article_content: res.res.article_content,
        essay: res.res,
        show: true
      })

    })
  },

  // 支付
  pay(e) {
    const that = this
    let param = {}
    param.goodsid = e.currentTarget.dataset.goodsid
    param.price = e.currentTarget.dataset.price
    param.goodstype = 3
    param.total = 1
    param.optionname = '文章查阅'
    param.openid = that.data.openid

    let time = Date.parse(new Date())
    wx.showLoading()
    if (Number(time) > Number(that.data.time) + 6000) {
      // 生成订单
      port.get("order/newpay/createpay", {
        param: param
      }, function(res) {
        let orderid = res.order.orderid
        if (orderid) {
          // 调用支付
          wx.requestPayment({
            'timeStamp': res.wechat.payinfo.timeStamp,
            'nonceStr': res.wechat.payinfo.nonceStr,
            'package': res.wechat.payinfo.package,
            'signType': 'MD5',
            'paySign': res.wechat.payinfo.paySign,
            'success': function(res) {

              // 修改支付状态
              port.get("order/newpay/complete", {
                param: {
                  openid: that.data.openid,
                  orderid: orderid
                }
              }, function(res) {
                wx.hideLoading()
                if (res.status == 1)
                  wx.showToast({
                      title: '购买成功',
                      icon: 'success',
                    },
                    that.show()
                  )
              })

            },
            'fail': function(res) {
              wx.hideLoading()
              wx.showToast({
                title: '支付失败',
                icon: 'loading',
              })
            }
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '请求失败',
            icon: 'loading',
          })
        }
      })
    }

  },

  // 转发
  onShareAppMessage: function(res) {
    const that = this
    if (res.from === 'button') {
      // 来自页面内转发按钮

    }
    return {
      title: this.data.essay.article_title,
      path: '/pages/essayShow/essayShow?id=' + this.data.essay.id,
      success: function(res) {
        // 转发成功
        port.get("member/comments/turn", {
          param: {
            article_id: that.data.id,
            type: 1,
          }
        }, function(res) {
          res.status == 1 ? (
            that.data.essay.turn_nums = res.turn_nums,
            that.setData({
              essay: that.data.essay
            })
          ) : (
            wx.showToast({
              title: '转发失败',
              icon: 'none'
            })
          )
        })
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
        doc_openid: that.data.essay.openid,
        pat_openid: that.data.openid
      }
    }, function(res) {
      if (res.status == 1) {
        if (res.isfollow == 1) {
          wx.showToast({
              title: '关注成功',
              icon: 'success'
            },
            that.show()
          )
        } else {
          wx.showToast({
              title: '取消关注成功',
              icon: 'success'
            },
            that.show()
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

  setOrder: function(e) {
    wx.navigateTo({
      url: '/pages/patient/setOrder/setOrder?doc_openid=' + e.currentTarget.dataset.doc_openid,
    })
  },

  char(e) {
    wx.navigateTo({
      url: '/pages/patientChatcost/patientChatcost?gzh_openid=' + e.currentTarget.dataset.openid + '&default_consult=' + e.currentTarget.dataset.default_consult + '&highgrade_consult=' + e.currentTarget.dataset.highgrade_consult + '&doctorid=' + e.currentTarget.dataset.doctorid,
    })
  },

  inputShow(e) {
    const that = this
    if (e.currentTarget.dataset.ico == 'ico') {
      var query = wx.createSelectorQuery()
      query.select('#ico').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function(res) {
        let top = res[0].top + res[1].scrollTop
        wx.pageScrollTo({
          scrollTop: top,
          duration: 300
        }, setTimeout(function() {
          that.setData({
            focus: true
          })
        }, 500))
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

  // 评论输入
  publish() {
    const that = this
    var regu = "^[ ]+$";
    var re = new RegExp(regu);

    if (!re.test(that.data.value) && that.data.value) {
      let commenttype = Number(that.data.commenttype)
      switch (commenttype) {
        case 2:
          port.get("member/comments/add_comments", {
            param: {
              pid: that.data.id,
              type: 3,
              openid: that.data.openid,
              content: that.data.value,
              cid: that.data.cid,
              rid: that.data.rid,
              reply_name: that.data.reply_name
            }
          }, function(res) {
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
              type: 3,
              openid: that.data.openid,
              content: that.data.value,
              cid: that.data.cid,
              rid: that.data.rid,
              reply_name: that.data.reply_name
            }
          }, function(res) {

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
        default:
          port.get("member/comments/add_comments", {
            param: {
              pid: that.data.id,
              type: 3,
              openid: that.data.openid,
              content: that.data.value,
              cid: that.data.cid,
              rid: that.data.rid,
              reply_name: that.data.reply_name
            }
          }, function(res) {
            that.data.list.unshift(res.list)
            that.data.essay.comments_total = res.comments_total
            that.setData({
              list: that.data.list,
              value: '',
              inputShow: false,
              listlength: res.comments_total,
              // essay: that.data.essay
              cid: '',
              rid: '',
              placeholder: '发表评论',
              reply_name: ''
            })
          })
      }
    } else {
      wx.showToast({
        title: '请先输入内容',
        icon: 'loading'
      })
    }
  },


  // 评论的评论
  sonpraise(e) {
    let name
    if (e.currentTarget.dataset.item.realname) {
      name = e.currentTarget.dataset.item.realname
    } else {
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

  // 文章点赞
  click(e) {
    const that = this
    let param = {}
    param.openid = that.data.openid
    param.pid = that.data.id
    param.type = 3
    port.get("member/comments/click_like", {
      param: param
    }, function(res) {
      if (res.status != 0) {
        if (res.status == 1) {
          that.data.essay.islike = res.status
        } else {
          that.data.essay.islike = 0
        }
        that.data.essay.like_total = res.like_total
        that.setData({
          essay: that.data.essay
        })
      } else {
        wx.showToast({
          title: '点赞失败',
          icon: 'loading'
        })
      }
    })
  },

  // 评论点赞
  comClick(e) {
    const that = this
    let param = {}
    param.openid = that.data.openid
    param.pid = e.currentTarget.dataset.pid
    param.type = 4
    port.get("member/comments/click_like", {
      param: param
    }, function(res) {
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

  // 文章详情中图片的显隐
  imgShow(e) {
    let newEssey = this.data.article_content
    let click
    if (newEssey[e.currentTarget.dataset.imgshowindex].tactful) {
      newEssey[e.currentTarget.dataset.imgshowindex].tactful = 0
      click = '隐藏此图片'
    } else {
      newEssey[e.currentTarget.dataset.imgshowindex].tactful = 1
      click = '查看图片'
    }
    this.setData({
      article_content: newEssey,
      click: click
    })
  },

  // 点击查看全部
  all(e) {
    this.data.list[e.currentTarget.dataset.index].sonShow = true
    this.setData({
      list: this.data.list
    })
  },

  doctor(e) {
    wx.navigateTo({
      url: '/pages/patient/doctor/doctor?openid=' + e.currentTarget.dataset.openid,
    })
  },

  // 送心意
  give: function() {
    wx.navigateTo({
      url: '/pages/doctor/give/give?doc_openid=' + this.data.essay.openid,
    })
  },

  // 点击二级评论
  sonItem(e) {
    let name
    if (e.currentTarget.dataset.sonitem.realname) {
      name = e.currentTarget.dataset.sonitem.realname
    } else {
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
  sonsItem(e) {
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
  },

  btn(e) {
    console.log(e)
  }
})