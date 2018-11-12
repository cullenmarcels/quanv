const app = getApp()
// pages/doctorGroup/dynamicInfo/dynamicInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShow: false,
    focus: false,
    placeholder: "回复帖子:",
    value: "",
    haveto:0,
    show: 0,
    commiteCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    // 获取传参，包含医生id，动态id
    var did = options.did
    var nid = options.nid
    this.setData({
      did: did,
      nid: nid
    })
    // 通过动态id获取动态信息
    app.postData("/docgroup/note/getnotebyid", {
      "nid": nid,
      "udid": did
    }).then(res => {
      var images = []
      var videos = []
      for (var i = 0; i < res.data.length; i++) {
        // 处理动态的图片url信息和视频url信息
        if (res.data[i].imgs != '') {
          if (res.data[i].imgs.split("|:|")[0] != undefined && res.data[i].imgs.split("|:|")[0] != '') {
            images = res.data[i].imgs.split("|:|")[0].split("&:&");
          }
          if (res.data[i].imgs.split("|:|")[1] != undefined && res.data[i].imgs.split("|:|")[1] != '') {
            videos = res.data[i].imgs.split("|:|")[1].split("&:&");
          }
        }
        res.data[i].images = images;
        res.data[i].videos = videos;
      }
      // 处理评论的时间信息
      for (var i = 0; i < res.data[0].comment.length; i++) {
        var t1 = new Date(res.data[0].comment[0].create_time.replace(/\-/g, "/"))
        var t2 = new Date()
        var t = new Date(t2 - t1 + 1 * 3600 * 1000)

        var d = parseInt(t.getTime() / 1000 / 3600 / 24)
        res.data[0].comment[i].t = d + '天之前'
        if (d < 1) {
          var m = parseInt(t.getTime() / 1000 / 3600)
          res.data[0].comment[i].t = m + '分钟之前'
        }
      }
      this.setData({
        data: res.data,
        show: 1,
        commiteCount: res.data[0].commentcount
      })
    })

  },
  // 添加收藏
  addstar: function(e) {
    var did = e.currentTarget.dataset.did
    var nid = e.currentTarget.dataset.nid
    var key = e.currentTarget.dataset.key
    app.postData("/docgroup/star/addstar", {
      "did": did,
      "nid": nid
    }).then(res => {
      if (res.status == "ok" && res.info == "收藏成功！") {
        var data = this.data.data;
        data[key].istar = 1;
        this.setData({
          data: data
        })
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 4000
        })
      } else if (res.status == "ok" && res.info == "取消成功！") {
        var data = this.data.data;
        data[key].istar = 0;
        this.setData({
          data: data
        })
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 4000
        })
      } else {
        wx.showToast({
          title: "失败了！",
          icon: 'none',
          duration: 4000
        })
      }
      // var mynotes=this.data.mynotes;
      // mynotes.data[key].starcount = mynotes.data[key].starcount+1;
      // this.setData({
      //   mynotes: mynotes
      // })
    })
  },
  // 添加点赞
  addlike: function(e) {
    var did = e.currentTarget.dataset.did
    var nid = e.currentTarget.dataset.nid
    var key = e.currentTarget.dataset.key

    app.postData("/docgroup/like/addlike", {
      "did": did,
      "nid": nid
    }).then(res => {
      if (res.status == "ok" && res.info == "点赞成功！") {
        var data = this.data.data;
        data[key].likecount = data[key].likecount + 1;
        data[key].islike = 1;
        this.setData({
          data: data
        })
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 4000
        })
      } else if (res.status == "ok" && res.info == "取消成功！") {
        var data = this.data.data;
        data[key].likecount = data[key].likecount - 1;
        data[key].islike = 0;
        this.setData({
          data: data
        })
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 4000
        })
      } else {
        wx.showToast({
          title: "失败了！",
          icon: 'none',
          duration: 4000
        })
      }
    })
  },
  // 预览图片
  viewImage: function(e) {
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.urls] // 需要预览的图片http链接列表
    })
  },
  // 评论
  comment: function(e) {
    const that = this
    var toname="帖子"
    var haveto=e.currentTarget.dataset.haveto;
    if (e.currentTarget.dataset.toname!=""){
      toname = e.currentTarget.dataset.toname
    }
      that.setData({
        inputShow: !that.data.inputShow,
        focus: !that.data.inputShow,
        placeholder: "回复：" +toname,
        haveto: haveto,
      })
   
  },
  
  bindinput: function(e) {
    const that = this
    that.setData({
      value: e.detail.value
    })
  },
  // 评论提交
  publish: function(e) {
    var toid = e.currentTarget.dataset.toid;
    var value = this.data.value;
    var nid = e.currentTarget.dataset.nid;
    var did = e.currentTarget.dataset.did;
    if (value==""){
      wx.showToast({
        title: "评论不可以为空哦!",
        icon: 'none',
        duration: 4000
      })
      return ;
    }
    app.postData("/docgroup/comment/addcomment", {
      "did": did,
      "nid": nid,
      "toid": toid,
      "content": value
    }).then(res => {
      if (res.status == "ok") {
        var t1 = new Date(res.comment[0].create_time.replace(/\-/g, "/"))
        var t2 = new Date()
        var t = new Date(t2 - t1 + 1 * 3600 * 1000)

        var d = parseInt(t.getTime() / 1000 / 3600 / 24)
        res.comment[0].t = d + '天之前'
        if (d < 1) {
          var m = parseInt(t.getTime() / 1000 / 3600)
          res.comment[0].t = m + '分钟之前'
        }
        var data = this.data.data;
        data[0].comment.push(res.comment[0]);
        this.setData({
          data:data,
          inputShow: !this.data.inputShow,
          focus: !this.data.inputShow,
          commiteCount: this.data.commiteCount + 1,
          value: "",
        })

      }
    })
  },
  // 取消评论
  addcommentlike: function(e){
    var cid = e.currentTarget.dataset.cid;
    var index = e.currentTarget.dataset.index;
    if (this.data.data[0].comment[index].islike==0){
      app.postData("/docgroup/comment/addcommentlike", {
        "cid": cid
      }).then(res => {
          if(res.status=="ok"){
            var data=this.data.data
            data[0].comment[index].likenum+=1
            data[0].comment[index].islike=1
            this.setData({
              data:data
            })
          }
      })
    }else{
      return
    }
    
    
  }
})