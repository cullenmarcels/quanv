//app.js
var e = require("utils/core.js");
App({
  onLaunch: function() {
    //清除缓存 测试...
    const that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          that.getUserInfo(function(res) {
            console.log("之前有过授权，app启动获取...");
          })
        }
      }
    })
  },

  requirejs: function(e) {
    return require("utils/" + e + ".js")
  },

  getCache: function(e, t) {
    var i = +new Date / 1000,
      n = "";
    i = parseInt(i);
    try {
      n = wx.getStorageSync(e + this.globalData.appid),
        n.expire > i || 0 == n.expire ? n = n.value : (n = "", this.removeCache(e))
    } catch (e) {
      n = void 0 === t ? "" : t
    }

    return n = n || ""
  },

  setCache: function(e, t, i) {
    var n = +new Date / 1000,
      a = true,
      o = {
        expire: i ? n + parseInt(i) : 0,
        value: t
      };
    try {
      wx.setStorageSync(e + this.globalData.appid, o)
    } catch (e) {
      a = false
    }
    return a
  },

  removeCache: function(e) {
    var t = true;
    try {
      wx.removeStorageSync(e + this.globalData.appid);
    } catch (e) {
      t = false
    }
    return t
  },

  getUserInfo: function(t, i, tt) {
    var n = this,
      a = n.getCache("userinfo");
    if (a && !a.needauth) {
      console.log("通过缓存登录....");
      return void(t && "function" == typeof t && t(a));
    }
    console.log("正在登录...");
    wx.login({
      success: function(o) {
        if (!o.code) {
          return void e.alert("获取用户登录态失败:" + o.errMsg);
        }
        console.log("调用login...");
        e.post("wxapp/login", {
          code: o.code
        }, function(o) {
          console.log(o.error ? "调用login失败!" : "调用Login成功!");
          return o.error ? void e.alert("获取用户登录态失败:" + o.message) : o.isclose && i && "function" == typeof i ? void i(o.closetext, true) : void
          wx.getUserInfo({
            withCredentials: true,
            success: function(i) {
              a = i.userInfo,
                console.log("调用auth...");
              e.get("wxapp/auth", {
                data: i.encryptedData,
                iv: i.iv,
                sessionKey: o.session_key
              }, function(e) {
                console.log("登录成功...:");
                i.userInfo.openid = e.openId;
                i.userInfo.id = e.id;
                i.userInfo.uniacid = e.uniacid;
                i.needauth = 0;
                console.log("userinfo,放入缓存中.....");
                n.setCache("userinfo", i.userInfo, 7200000);
                t && "function" == typeof t && t(a)
              })
            },
            fail: function() {
              //授权问题
              e.get("wxapp/check", {
                openid: o.openid
              }, function(e) {
                e.needauth = 1,
                  n.setCache("userinfo", e, 7200),
                  t && "function" == typeof t && t(a)
              })
            }
          })
        })
      }
    })
  },

  // 获取商城基本信息
  getSet: function() {
    var t = this;
    "" == t.getCache("sysset") && setTimeout(function() {
      var i = t.getCache("cacheset");
      e.get("cacheset", {
        version: i.version
      }, function(e) {
        e.update && t.setCache("cacheset", e.data),
          t.setCache("sysset", e.sysset, 7200000)
      })
    }, 10)
  },

  url: function(e) {
    e = e || {};
    var t = {},
      i = "",
      n = "",
      a = this.getCache("usermid");
    i = e.mid || "",
      n = e.merchid || "",
      "" != a ? ("" != a.mid && void 0 !== a.mid || (t.mid = i), "" != a.merchid && void 0 !== a.merchid || (t.merchid = n)) : (t.mid = i, t.merchid = n),
      this.setCache("usermid", t, 60)
  },

  loginError: function() {
    wx.showLoading({
      title: '重新登录中',
      mask: true,
      success: function() {
        wx.navigateTo({
          url: '/pages/index/index',
        })
      },
    })
  },

  globalData: {
    appid: "wx8c45fc78f9bcdb6c",
    // api: "https://v.mctimes.cn/app/rr_vv3_api.php?i=3",
    // approot: "https://v.mctimes.cn/addons/rr_vv3/",,
    api: "https://www.chuangrongkj.com/quanvweb/app/rr_vv3_api.php?i=3",
    api2:"https://www.chuangrongkj.xyz/app/rr_vv3_api.php?i=3",
    chatapi: "https://www.chuangrongkj.com/quanvweb/app/index.php",
    approot: "https://www.chuangrongkj.com/quanvweb/addons/rr_vv3/",
    userInfo: null
  },
  //封装的特定post方法
  postData: function(url, data) {
    //从缓存中获取头部信息
    if (wx.getStorageSync('header') == null || wx.getStorageSync('header') == '') {
      wx.setStorageSync('header', {
        "Content-Type": "application/json;charset=UTF-8",
        'Cookie': 'nohave'
      })
    }
    // 从缓存中获取myopenid
    if (wx.getStorageSync('myopenid') != null && wx.getStorageSync('myopenid') != '') {
      data.openid = wx.getStorageSync('myopenid')
    }

    var that = this;
    return new Promise(function(resolve, reject) {
      wx.request({
        url: that.globalData.api2 + url,
        data: data,
        method: "POST",
        //加入header，自定义cookie包含session_id
        header: wx.getStorageSync('header'),
        success: function(res) {
          //如果没权调用就申请openid
          if ((res.data.status == 'error') && (res.data.errorinfo == '您无权限调用此接口,请先申请openid')) {
            wx.login({
              success: function(res) {
                if (res.code) {
                  wx.request({
                    url: that.globalData.api2 + '/docgroup/index/getopenid',
                    data: {
                      "code": res.code
                    },

                    method: "POST",
                    header: wx.getStorageSync('header'),
                    success: function(res) {
                      wx.setStorageSync('myopenid', res.data.openid)
                      data.openid = wx.getStorageSync('myopenid')
                      // 将sessionid放入到header
                      wx.setStorageSync('header', {
                        "Content-Type": "application/json;charset=UTF-8",
                        'Cookie': res.data.sessionid
                      })

                      wx.request({
                        url: that.globalData.api2 + url,
                        data: data,
                        method: "POST",
                        header: wx.getStorageSync('header'),
                        success: function(res) {
                          // 返回数据
                          resolve(res.data);
                        },
                        fail: function(res) {
                          reject(res);
                        },
                      })
                    },
                    fail: function(res) {
                      reject(res);
                    },
                  })

                } else {
                  console.log('登录失败！' + res.errMsg)
                }
              }
            });


          } else {
            resolve(res.data);
          }

        },
        fail: function(res) {
          reject(res);
        },
      })
    });
  }
})