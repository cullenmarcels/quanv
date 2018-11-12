const app = getApp(),
  port = app.requirejs("core")
Page({

  data: {
    navActive: 1,
    imgUrls: [],
    page: 0,
    list: [],
    bottom: true,
    display: false,
    value: '',
    show: true,
    doc_openid: '',
    timestamp: 0,
  },

  onLoad: function (options) {
    if (options.doc_openid) {
      this.setData({
        doc_openid: options.doc_openid
      })
    }
    let e = { type: this.data.navActive }
   
    this.list(e)
  },


  

  list(e) {
    const that = this
    e.pageSize = 20
    e.page = this.data.page + 1
    if (this.data.value) {
      e.keyword = this.data.value
    } else if (this.data.classify != '科室查找') {
      e.keyword = this.data.classifyid
    } else {
      e.keyword = ''
    }
    if (this.data.bottom) {
        wx.showLoading({
            title: '加载中...',
        })
      e.openid = that.data.doc_openid
      e.species = 2 //查询视频
      port.post("vindex/more_material", {
        param: e
      }, function (res) {
          wx.hideLoading()
        if (res.error == 0) {
          if (res.list.length == 0) {
            return that.setData({
              bottom: false,
              display: true,
              show: true
            })
          } else {
            that.setData({
              list: that.data.list.concat(res.list),
              page: e.page,
              display: true,
              show: true
            })
          }
        }
      })
    }
  },

  onReachBottom: function () {
    let e = { type: this.data.navActive }
    this.list(e)
  },



  nav(event) {
    let date = Date.parse(new Date())
    if (event.currentTarget.dataset.kind != this.data.navActive && (this.data.timestamp + 300 < date)) {
      this.setData({
        navActive: event.currentTarget.dataset.kind,
        page: 0,
        timestamp: date,
        list: [],
        bottom: true,
        display: false
      })
      let e = { type: Number(event.currentTarget.dataset.kind) }
      this.list(e)
    }
  },

  // 视屏详情
  videoShow: function (e) {
    wx.navigateTo({
      url: '/pages/ViewScreenShow/ViewScreenShow?id=' + e.currentTarget.dataset.id,
    })
  },

  // input输入
  bindinput(e) {
    this.setData({
      value: e.detail.value
    })
  },

  // 点击搜索
  input() {
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    let event
    !re.test(this.data.value) && this.data.value ? (
      this.setData({
        classify: '科室查找',
        value: this.data.value,
        page: 0,
        list: [],
        bottom: true,
        disply: false
      }),
      event = { type: this.data.navActive },
      this.list(event)
    ) : (
        wx.showToast({
          title: '请输入内容',
          icon: 'loading'
        })
      )
  },

  // 键盘的完成
  bindconfirm(e) {
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    var event
    !re.test(e.detail.value) && e.detail.value ? (
      this.setData({
        classify: '科室查找',
        value: e.detail.value,
        page: 0,
        list: [],
        bottom: true,
        disply: false
      }),
      event = { type: this.data.navActive },
      this.list(event)
    ) : (
        wx.showToast({
          title: '请输入内容',
          icon: 'loading'
        })
      )
  },

  imagesHeight: function (t) {
    var a = t.detail.width,
      e = t.detail.height,
      o = t.target.dataset.type,
      i = {},
      s = this;
    wx.getSystemInfo({
      success: function (t) {
        i[o] = t.windowWidth / a * e,
          (!s.data[o] || s.data[o] && i[o] < s.data[o]) && s.setData(i)
      }
    })
  },
})