const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    click: false,
    edit: false
  },
  onLoad: function(options) {
    const that = this
    that.setData({
      did: options.did,
      gid: options.gid
    })
    // 获取成员列表
    app.postData("/docgroup/member/getpassmember", {
      "gid": that.data.gid
    }).then(res => {
      let groupLoad = [],
        groupManager = [],
        groupMember = []
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].ismanager == 1) {
          groupLoad.push(res.data[i])
        } else if (res.data[i].ismanager == 2) {
          groupManager.push(res.data[i])
        } else {
          groupMember.push(res.data[i])
        }
      }
      that.setData({
        groupLoad: groupLoad,
        groupManager: groupManager,
        groupMember: groupMember,
        show: true
      })
    })
  },
  // 添加管理员身份
  edit: function(e) {
    const that = this
    let did = e.currentTarget.dataset.did
    wx.showModal({
      title: '指定管理员',
      content: '请确认指定该成员为本集团的管理员?',
      showCancel: true,
      cancelText: '取消指定',
      confirmText: '确认指定',
      success: function(res) {
        if (res.confirm) {
          app.postData("/docgroup/member/setmanager", {
            "gid": that.data.gid,
            "did": did
          }).then(res => {
            if (res.status == 'ok') {
              wx.showToast({
                title: res.info,
                icon: 'success'
              })
            } else if (res.status == 'error') {
              wx.showToast({
                title: res.info
              })
            }
          })
        }
      }
    })
  },
  // 移除管理员身份
  remove: function(e) {
    const that = this
    let did = e.currentTarget.dataset.did
    wx.showModal({
      title: '取消管理员',
      content: '请确认取消该成员为本集团管理员身份?',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      success: function(res) {
        if (res.confirm) {
          app.postData("/docgroup/member/cancelmanager", {
            "gid": that.data.gid,
            "did": did
          }).then(res => {
            wx.showToast({
              title: res.info,
              icon: 'success'
            })
          })
        }
      },
      fail: function(res) {}
    })
  },
  // 搜索
  bindinput: function(e) {
    const that = this
    that.setData({
      searchValue: e.detail.value
    })
  },
  search: function() {
    const that = this
    let memberList = that.data.groupMember,
      name = that.data.searchValue
    let searchList = []
    for (let i = 0; i < memberList.length; i++) {
      if (memberList[i].docinfo.realname.indexOf(name) != -1) {
        searchList.push(memberList[i])
      } else if (name.indexOf(memberList[i].docinfo.realname) != -1) {
        searchList.push(memberList[i])
      }
      that.setData({
        searchList: searchList,
        searched: true
      })
    }
  }
})