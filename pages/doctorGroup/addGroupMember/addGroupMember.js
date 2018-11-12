const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    page: 0,
    list: [],
    nohave: false
  },
  onLoad: function(options) {
    const that = this
    that.setData({
      ismanager: options.ismanager,
      gid: options.gid,
      did: options.did
    })
  },
  // 查找列表切换
  click: function() {
    const that = this
    that.setData({
      click: !that.data.click
    })
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },
  // 添加成员
  addmember: function(e) {
    var did = e.currentTarget.dataset.did;
    var gid = this.data.gid;
    app.postData("/docgroup/member/manageraddmember", {
      "did": did,
      "gid": gid
    }).then(res => {
      if (res.status == "ok") {
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 4000
        })
        wx.navigateTo({
          url: '/pages/doctorGroup/manage/manage?ismanager=' + this.data.ismanager + '&gid=' + this.data.gid + '&did=' + this.data.did,
        })
      } else {
        wx.showToast({
          title: "好像失败了，sorry",
          icon: 'none',
          duration: 4000
        })
      }
    })
  },
  bindinput: function(e) {
    const that = this
    that.setData({
      value: e.detail.value
    })
  },
  search: function() {
    this.setData({
      list: [],
      page: 0
    })
    this.getsearchlist(0);
  },
  onReachBottom: function() {
    this.getsearchlist(this.data.page);
  },
  getsearchlist: function(page) {
    if (this.data.value == '') {
      wx.showToast({
        title: "搜索条件不可为空",
        icon: 'none',
        duration: 4000
      })
    }
    app.postData("/docgroup/index/search", {
      "keyword": this.data.value,
      "gid": this.data.gid,
      "page": page
    }).then(res => {

      if (res.status == 'ok') {
        var list = this.data.list.concat(res.doctors)
        this.setData({
          list: list,
          listtype: 0,
          page: this.data.page + 1
        })
        if (res.doctors.length < 5) {
          this.setData({
            nohave: true
          })
        }
      }
    })
  }
})