const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false
  },
  onLoad: function(options) {
    const that = this
    that.setData({
      gid: options.gid,
      createrid: options.did
    })
    // 获取管理员列表
    app.postData("/docgroup/member/getpassmember", {
      "gid": that.data.gid,
    }).then(res => {
      let groupManager = []
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].ismanager == 2) {
          groupManager.push(res.data[i])
        }
      }
      that.setData({
        groupManager: groupManager,
        show: true
      })
    })
  },

  // 转让集团
  giveTo: function(e) {
    const that = this
    app.postData("/docgroup/group/removemanager", {
      "createrid": that.data.createrid,
      "gid": that.data.gid,
      "tomemberid": e.currentTarget.dataset.did
    }).then(res => {
      if (res.status == 'ok') {
        wx.showToast({
          title: res.info,
          icon: 'success'
        })
      } else {
        console.log(res)
        wx.showToast({
          title: res.info,
          icon: 'loading'
        })
      }
    })

  }
})