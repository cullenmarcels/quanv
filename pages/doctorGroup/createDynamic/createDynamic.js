const app = getApp();
var images=new Array()
var videos = new Array()
// pages/doctorGroup/createDynamic/createDynamic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noteMaxLen: 15, //标题限制长度
    actionSheetHidden: true,
    actionSheetItems: [
      { bindtap: 'chooseImage', txt: '上传图片' },
      { bindtap: 'chooseVideo', txt: '上传视频' }
    ], // 底部可选菜单
    images: [],
    videos: [],    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      gid: options.gid,
      did: options.did
    })
  },
  onUnload:function(){
    images = new Array()
    videos = new Array()
  },

  //字数限制
  bindWordLimit: function (e) {
    var value = e.detail.value, len = parseInt(value.length);
    if (len > this.data.noteMaxLen) return;
    this.setData({
      currentNoteLen: len //当前字数
    });
  },
  // 点击显示底部菜单
  clickImage: function () {
    var that = this;
    that.setData({
      actionSheetHidden: !that.data.actionSheetHidden
    })
  },
  // 点击其他区域 隐藏底部菜单
  actionSheetbindchange: function () {
    var that = this;
    that.setData({
      actionSheetHidden: !that.data.actionSheetHidden
    })
  },
  //上传媒体文件****************************************
  chooseImage: function(){
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        wx.showLoading({
          title: '上传中。。。',
          mark: true
        })
        that.setData({
          actionSheetHidden: !that.data.actionSheetHidden
        })
        //上传图片
        app.uploadFiles('/docgroup/index/upicon', this, res.tempFilePaths[0], 'file', {}, function (res) {
          if (res.split("|:|")[0] == "ok") {
            images.push(app.globalData.api2 + res.split("|:|")[1])
            that.setData({
              images: images
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
      }
    })
  },
  chooseVideo: function () {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      maxDuration: 60,
      success: (res) => {
        wx.showLoading({
          title: '上传中。。。',
          mark: true
        })
        that.setData({
          actionSheetHidden: !that.data.actionSheetHidden
        })
        app.uploadFiles('/docgroup/index/upfile', this, res.tempFilePath, 'file', {}, function (res) {
          if (res.split("|:|")[0] == "ok") {
            videos.push(app.globalData.api2 + res.split("|:|")[1])
            that.setData({
              videos: videos
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
      fail: (res) => {
      }
    })
  },
  removeImage:function (e){
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否要删除该图片?',
      success: function(res){
        if(res.confirm){
          var noteId = e.currentTarget.dataset.id;
          images = that.data.images
          images = delarray(images, noteId)
          that.setData({
            images: images
          })
        }
      }
    })
  },
  removeVideo: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否要删除该视频?',
      success: function (res) {
        if (res.confirm) {
          var noteId = e.currentTarget.dataset.id;
          videos = that.data.videos
          videos = delarray(videos, noteId)
          that.setData({
            videos: videos
          })
        }
      }
    })
  },
  //上传媒体文件****************************************

  //跳转*************************************************
  goToAgreement:function (){
      wx.navigateTo({
        url: '/pages/doctorGroup/agreement/agreement',
      })
  },
  //跳转*************************************************
  formSubmit: function (e) {
    if (e.detail.value.title.length == 0 || e.detail.value.content.length == 0) {
      wx.showToast({
        title: "不可以填空哦!",
        icon: 'none',
        duration: 4000
      })
      return ;
    }
    app.postData("/docgroup/note/addnote", {
      "title": e.detail.value.title,
      "content": e.detail.value.content,
      "imgs": arraytostring(this.data.images, this.data.videos),
      "gid": this.data.gid,
      "did": this.data.did
    }).then(res => {
      if(res.status == 'ok') {
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 4000
        })
        wx.navigateTo({
          url: '/pages/doctorGroup/groupInfo/groupInfo?did=' + this.data.did+'&gid='+this.data.gid+"&isdoctor=1",
        })
      }else{
        wx.showToast({
          title: "上传失败！请重试",
          icon: 'none',
          duration: 4000
        })
      }
    })

  }
})
//删除数组中的数组为i的项
function delarray(arr,i){
  var imgs=new Array();
  for(var j=0;j<arr.length;j++){
    if(j!=i){
      imgs.push(arr[j]);
    }
  }
  return imgs;
}
//删除数组中的数组为i的项
function arraytostring(arr,arr2) {
  var imgs = "";
  for (var j = 0; j < arr.length; j++) {
    if(j==0)
      imgs=imgs+arr[j];
    else
      imgs = imgs+'&:&' + arr[j];
  }
  imgs = imgs + '|:|';
  for (var j = 0; j < arr2.length; j++) {
    if (j == 0)
      imgs = imgs + arr2[j];
    else
      imgs = imgs + '&:&' + arr2[j];
  }
  return imgs;
}