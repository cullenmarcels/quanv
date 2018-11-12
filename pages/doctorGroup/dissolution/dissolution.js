const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noteMaxLen: 300,
    submit: '解散'
  },
  onLoad: function(options) {
    const that = this
    that.setData({
      did: options.did,
      gid: options.gid
    })
  },
  //上传申请理由
  formSubmit: function(e) {
    const that = this
    that.setData({
      reason: e.detail.value.reason
    })
    wx.showModal({
      title: '请确认',
      content: '注意: 点击确认之后将无法撤销申请哦',
      showCancel: true,
      cancelText: '取消解散',
      confirmText: '确认解散',
      success: function(res) {
        if (res.confirm) {
          app.postData("/docgroup/dissolve/adddissolve", {
            "did": that.data.did,
            "gid": that.data.gid,
            "reason": that.data.reason
          }).then(res => {
            if (res.status == 'ok') {
              wx.showToast({
                title: '成功申请解散',
                icon: 'success',
              })
              wx.reLaunch({
                url: '/pages/doctorGroup/index/index?doc_openid=nohave&&user_openid=' + wx.getStorageSync('my1openid'),
              })
            } else if (res.status == 'error') {
              wx.showToast({
                title: '操作失败',
                icon:'error'
              })
            }
            that.setData({
              reason: ''
            })
          })
        } else {
          wx.showToast({
            title: '已取消',
          })
        }
      }
    })
  },
  bindWordLimit: function(e) {
    const that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen) return;
    that.setData({
      currentNoteLen: len //当前字数
    });
  }

})