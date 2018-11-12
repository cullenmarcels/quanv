const app = getApp()
Page({
  data: {
    show: true
  },
  onLoad: function(options) {
    const that = this
    that.setData({
      did: options.did,
      gid: options.gid
    })
    // 新成员申请列表
    app.postData("/docgroup/member/getnopassmember", {
      'gid': that.data.gid
    }).then(res => {
      if (res.status == 'ok') {
        that.setData({
          newMemberList: res.data
        })
      }
    })
    // 集团成员列表
    app.postData("/docgroup/member/getpassmember", {
      'did': that.data.did,
      'gid': that.data.gid
    }).then(res => {
      if (res.status == 'ok') {
        console.log(res.data)
        that.setData({
          memberList: res.data
        })
      }
    })
  },
  // 通过审核
  agree:function(e){
    const that = this
    let did = e.currentTarget.dataset.did
    wx.showModal({
      title: '通过审核',
      content: '请确认改成员加入本集团?',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确认',
      success: function (res) {
        if (res.confirm) {
          app.postData("/docgroup/member/passmember", {
            "gid": that.data.gid,
            "did": did
          }).then(res => {
            if (res.status == 'ok') {
              wx.showToast({
                title: '通过审核',
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
  // 移除成员
  remove:function(e){
    const that = this
    let did = e.currentTarget.dataset.did
    wx.showModal({
      title: '移除成员',
      content: '请确认是否从本集团移除该成员?',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确认',
      success: function (res) {
        if (res.confirm) {
          app.postData("/docgroup/member/delmember", {
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
  // 搜索
  bindinput: function (e) {
    const that = this
    that.setData({
      searchValue: e.detail.value
    })
  },
  search: function () {
    const that = this
    let memberList = that.data.memberList,
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