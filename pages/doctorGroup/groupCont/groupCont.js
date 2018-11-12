const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    groupInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    that.setData({
      udid: options.udid,
      gid: options.gid
    })
    // 获取集团信息
    app.postData("/docgroup/group/getgroupbyid", {
      "gid": that.data.gid,
    }).then(res => {
      that.setData({
        groupInfo: res.data
      })
      // 获取集团通知
      app.postData("/docgroup/notice/getnoticebygid", {
        "gid": that.data.gid,
      }).then(res => {
        that.setData({
          groupNotice: res.data
        })
        // 获取集团成员
        app.postData("/docgroup/member/getpassmember", {
          "gid": that.data.gid,
        }).then(res => {
          that.setData({
            groupMember: res.data,
            show: true
          })
        })
      })
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})