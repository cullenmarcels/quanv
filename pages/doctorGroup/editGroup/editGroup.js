const app = getApp();
Page({
  data: {
    groupName: '',
    groupInfo: '',
    groupPic: "../../../static/groupImages/groupPic.png", // 头像图片路径
    tempFilePaths: '', // 本地预览头像地址
    noteMaxLen: 300, // 字数限制
    actionSheetHidden: true, // 是否显示底部可选菜单
    actionSheetItems: [{
        bindtap: 'changeImage',
        txt: '修改头像'
      },
      {
        bindtap: 'viewImage',
        txt: '查看头像'
      }
    ], // 底部可选菜单

  },
  onLoad: function(options) {
    const that = this
    that.setData({
        ismanager: options.ismanager,
        gid: options.gid,
        did: options.did
      }),
      // 获取集团头像等信息
      app.postData("/docgroup/group/getgroupbyid", {
        "gid": that.data.gid,
      }).then(res => {
        that.setData({
          groupIcon: res.data.icon,
          groupName: res.data.name,
          groupSummary: res.data.summary
        })
      })
  },
  //显示字数限制
  bindWordLimit: function(e) {
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > this.data.noteMaxLen) return;
    this.setData({
      currentNoteLen: len //当前字数
    });
  },
  // 点击头像 显示底部菜单
  clickImage: function() {
    var that = this;
    that.setData({
      actionSheetHidden: !that.data.actionSheetHidden
    })
  },
  // 点击其他区域 隐藏底部菜单
  actionSheetbindchange: function() {
    var that = this;
    that.setData({
      actionSheetHidden: !that.data.actionSheetHidden
    })
  },
  // 上传头像
  changeImage: function() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: 'compressed', // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片，只有一张图片获取下标为0
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          actionSheetHidden: !that.data.actionSheetHidden
        })
        wx.showLoading({
          title: '上传中。。。',
          mark: true
        })
        app.uploadFiles('/docgroup/index/upicon', this, tempFilePaths[0], 'file', {}, function(res) {
          console.log(res.split("|:|"));
          if (res.split("|:|")[0] == "ok") {
            that.setData({
              groupIcon: app.globalData.api2 + res.split("|:|")[1]
            })
            wx.hideLoading()
          } else {
            wx.showToast({
              title: "上传失败了",
              icon: 'none',
              duration: 4000
            })
          }
        })
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  // 查看预览图
  viewImage: function() {
    var that = this
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [that.data.groupPic] // 需要预览的图片http链接列表
    })
  },
  // 上传编辑内容
  formSubmit: function(e) {
    var that = this
    let {
      groupName,
      groupInfo,
      imgurl
    } = e.detail.value;
    if (!groupName || !groupInfo) {
      wx.showToast({
        title: "不能留空哦!",
        icon: 'none',
        duration: 4000
      })
      return;
    }
    if (imgurl.substr(0, 5) != "https") {
      wx.showToast({
        title: "文件好像未上传或者上传失败了（-_-）!",
        icon: 'none',
        duration: 4000
      })
      return;
    }
    app.postData("/docgroup/group/updategroup", {
      "gid": this.data.gid,
      "icon": imgurl,
      "name": groupName,
      "summary": groupInfo
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
          icon: 'none',
          duration: 4000
        })
        wx.navigateTo({
          url: '/pages/doctorGroup/manage/manage?ismanager=' + this.data.ismanager + '&gid=' + this.data.gid + '&did=' + this.data.did,
        })
      }
    })
  },
})