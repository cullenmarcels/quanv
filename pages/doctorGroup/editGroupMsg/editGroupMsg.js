const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  onLoad: function (options) {
    const that = this
    that.setData({
      ismanager: options.ismanager,
      gid: options.gid,
      did: options.did
    })
    app.postData("/docgroup/notice/getnoticebygid", {
      "gid": this.data.gid
    }).then(res => {
      if (res.status == 'ok') {
        that.setData({
          title: res.data.title,
          content: res.data.notice
        })
      }
    })
  },
  // 上传编辑内容
  formSubmit: function (e) {
    var title = e.detail.value.title
    var content = e.detail.value.content

    app.postData("/docgroup/notice/addnotice", {
      "gid": this.data.gid,
      "did": this.data.did,
      "title": title,
      "notice": content
    }).then(res => {
      if (res.status != 'ok') {
        wx.showToast({
          title: res.errorinfo,
          icon: 'none',
          duration: 4000
        })
      } else {
        wx.showToast({
          title: res.info,
          icon: 'success',
          duration: 2000
        })
        wx.navigateTo({
          url: '/pages/doctorGroup/manage/manage?ismanager=' + this.data.ismanager + '&gid=' + this.data.gid + '&did=' + this.data.did,
        })
      }

    })

  },


})