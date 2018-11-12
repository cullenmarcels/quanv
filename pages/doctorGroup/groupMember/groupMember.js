const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    click: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    that.setData({
      gid: options.gid
    })
    // 获取集团成员
    app.postData("/docgroup/member/getpassmember", {
      "gid": that.data.gid,
    }).then(res => {
      let groupManager = [],
        groupMember = []
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].ismanager != 0) {
          groupManager.push(res.data[i])
        } else {
          groupMember.push(res.data[i])
        }
      }
      that.setData({
        groupManager: groupManager,
        groupMember: groupMember,
        show: true
      })
    })
  },
  toDynamicWeb: function(e) {
    const that = this
    wx.navigateTo({
      url: '/pages/doctorGroup/dynamicList/dynamicList?udid=' + that.data.udid + '&did=' + e.currentTarget.dataset.did,
    })
  }

})