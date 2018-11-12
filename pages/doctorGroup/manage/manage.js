const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    that.setData({
      ismanager: options.ismanager,
      gid: options.gid,
      did: options.did
    })
    // 获取集团头像等信息
    app.postData("/docgroup/group/getgroupbyid", {
      "gid": that.data.gid,
    }).then(res => {
      that.setData({
        groupIco: res.data.icon,
        groupName: res.data.name
      })
    })
  },
})