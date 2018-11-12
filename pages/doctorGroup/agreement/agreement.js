// pages/doctorGroup/agreement/agreement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notes: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    const that = this
    var mynotes = "<p class='notes'>" + 111 + " </p>"
    that.setData({
      notes: mynotes
    })
  },
  // 返回
  btoBack: function() {
    wx.navigateBack({
      delta: 1
    })
  }
})