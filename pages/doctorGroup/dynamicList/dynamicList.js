const app = getApp()
// pages/doctorGroup/dynamicList/dynamicList.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mynotepages:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var did=options.did
    var udid = options.udid
      this.setData({
        udid:udid,
        did:did
      })
    // ajax获取自己的动态信息
    app.postData("/docgroup/note/getnotemorebydid", {
      "did": this.data.did,
      "udid": this.data.udid,
      "page": this.data.mynotepages
    }).then(res => {
      this.setData({
        mynotpages: this.data.mynotpages + 1
      })

      for (var i = 0; i < res.data.length; i++) {
        // 处理imageurl和videourl
        var images = []
        var videos = []
        var t1 = new Date(res.data[i].create_time)
        var t2 = new Date()
        var t = new Date(t2 - t1 + 1 * 3600 * 1000)

        var d = parseInt(t.getTime() / 1000 / 3600 / 24)
        res.data[i].t = d + '天之前'
        if (d < 1) {
          var m = parseInt(t.getTime() / 1000 / 3600)
          res.data[i].t = m + '分钟之前'
        }
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

      this.setData({
        mynotes: res,
        havemynotes: 1,
        show: 1
      })
      console.log(this.data.mynotes)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  // 添加收藏
  addstar: function (e) {
    console.log(this.data.mynotes.data);
    var did = e.currentTarget.dataset.did
    var nid = e.currentTarget.dataset.nid
    var key = e.currentTarget.dataset.key
    console.log(key);
    console.log(nid);
    app.postData("/docgroup/star/addstar", {
      "did": did,
      "nid": nid
    }).then(res => {
      if (res.status == "ok" && res.info == "收藏成功！") {
        var data = this.data.mynotes;
        data.data[key].istar = 1;
        this.setData({
          mynotes: data
        })
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 4000
        })
      } else if (res.status == "ok" && res.info == "取消成功！") {
        var data = this.data.mynotes;
        data.data[key].istar = 0;
        this.setData({
          mynotes: data
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
  addlike: function (e) {
    var did = e.currentTarget.dataset.did
    var nid = e.currentTarget.dataset.nid
    var key = e.currentTarget.dataset.key
    app.postData("/docgroup/like/addlike", {
      "did": did,
      "nid": nid
    }).then(res => {
      if (res.status == "ok" && res.info == "点赞成功！") {
        var data = this.data.mynotes;
        data.data[key].likecount = data.data[key].likecount + 1;
        data.data[key].islike = 1;
        this.setData({
          mynotes: data
        })
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 4000
        })
      } else if (res.status == "ok" && res.info == "取消成功！") {
        var data = this.data.mynotes;
        data.data[key].likecount = data.data[key].likecount - 1;
        data.data[key].islike = 0;
        this.setData({
          mynotes: data
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
  }

  
})