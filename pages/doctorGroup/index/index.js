const app = getApp()
Page({
  data: {
    isdoctor: 0,
    doc_group: {},
    mycreategroup: {},
    mygroup: {},
    show: false,
    groupList: [],
    issearched: false,
    isin: false
  },
  onLoad: function(options) {
    // 获取医生的openid和useropenid，并且判断是否是医生
    const that = this
    if (options.doc_openid == 'nohave') {

      var docopenid = 'sns_wa_' + options.user_openid;
      var useropenid = options.user_openid;
      that.setData({
        isdoctor: 1,
        docopenid: docopenid
      })
      wx.setStorageSync('myopenid', useropenid)
      wx.setStorageSync('my1openid', useropenid)
      wx.setStorageSync('dopenid', docopenid)
    } else {
      var docopenid = options.doc_openid;
      var useropenid = options.user_openid;
      that.setData({
        isdoctor: 0,
        docopenid: docopenid
      })
      wx.setStorageSync('myopenid', useropenid)
      wx.setStorageSync('dopenid', docopenid)
    }
    //获取did (更换方法!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!)
    app.postData("/docgroup/index/getdid", {
      "dopenid": wx.getStorageSync('dopenid'),
    }).then(res => {
      this.setData({
        "did": res.did.id
      })
      // 获取集团列表(更换方法!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!)
      app.postData("/docgroup/group/getmygroups", {
        "did": res.did.id,
      }).then(res => {
        var mycreategroup = new Array()
        var mygroup = new Array()
        for (var i = 0; i < res.data.length; i++) {
          // 处理列表，判断是否是该医生创建
          if ((res.data)[i].ismanager == 1) {
            var date = new Date(res.data[i].create_time.replace(/\-/g, "/"));
            //年
            var Y = date.getFullYear();
            //月
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
            //日
            var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

            res.data[i].create_time = Y + '-' + M + '-' + D

            mycreategroup.push((res.data)[i]);
          } else {
            mygroup.push((res.data)[i]);
          }
        }
        this.setData({
          "mycreategroup": mycreategroup,
          "mygroup": mygroup,
          "show": true
        })
        console.log(this.data.mygroup)
      })
      // 获取申请中的集团列表(更换方法!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!)
      app.postData("/docgroup/group/getmynopass", {
        "did": res.did.id
      }).then(res => {
        this.setData({
          myApplyGroup: res.data
        })
      })
    })
  },
  // 跳转创建页面
  bindEditView: function() {
    wx.navigateTo({
      url: '/pages/doctorGroup/createGroup/createGroup',
    })
  },
  // 跳转集团
  bindGroup: function(event) {
    wx.navigateTo({
      url: '/pages/doctorGroup/groupInfo/groupInfo?gid=' + event.currentTarget.dataset.id + '&isdoctor=' + this.data.isdoctor + '&did=' + this.data.did + '&dopenid=' + this.data.docopenid,
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
    app.postData("/docgroup/group/selectgroupbykeyword", {
      "keyword": that.data.searchValue,
      "did": that.data.did
    }).then(res => {
      that.setData({
        groupList: res.data,
        issearched: true
      })
    })
  },
  addGroup: function(e) {
    const that = this
    wx.showModal({
      title: '是否确认加入',
      content: '您是否确认加入该集团?',
      success: function(res) {
        if (res.confirm) {
          app.postData("/docgroup/Member/addMember", {
            "did": that.data.did,
            "gid": e.currentTarget.dataset.gid
          }).then(res => {
            if (res.status == 'ok') {
              wx.showToast({
                title: res.info,
              })
              that.setData({
                isin: !isin
              })
            }
          })
        }
      }
    })

  }
})