import * as echarts from '../../../template/ec-canvas/echarts'
import geoJson from './mapData.js'
const app = getApp()
var gid = 0
Page({
  data: {
    item: {
      index: 0,
      tab3: ['动态', '成员', '我的']
    },
    ec: {
      onInit: initChart
    },
    drop: false,
    show: false,
    havemembers: 0,
    havemynotes: 0,
    page: 0,
    nohave0: false,
    nohave2: false,
    notes: [],
    mynotes: [],
    mynotepages: 0,
    searchList: [],
    searched: false
  },
  onLoad: function(options) {
    const that = this
    // 获取是否是医生的信息和集团id
    var isdoctor = options.isdoctor
     gid = options.gid
    var did = options.did
    that.setData({
      isdoctor: isdoctor,
      gid: gid,
      did: options.did,
      dopenid: options.dopenid

    })
    // 新消息条数清零
    app.postData("/docgroup/member/clearnewnum", {
      "gid": gid,
      "did": did
    }).then(res => {})
    // ajax通过集团id获取集团信息
    app.postData("/docgroup/group/getgroupbyid", {
      "gid": gid,
    }).then(res => {
      if (res.status == 'ok') {
        var date = new Date(res.data.create_time.replace(/\-/g, "/"));
        //年
        var Y = date.getFullYear();
        //月
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        //日
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        // 绑定数据到模板 处理创建时间
        that.setData({
          group: res.data,
          create_time: Y + '-' + M + '-' + D
        })
        //通过集团id获取公告信息
        app.postData("/docgroup/notice/getnoticebygid", {
          "gid": gid,
        }).then(res => {
          
          if (isdoctor == 1) {
            this.getnotebygid()
          }
          else{
            var item =this.data.item
            item.index=1
            this.setData({
              item:item
            })
            // ajax获取成员信息
            app.postData("/docgroup/member/getpassmember", {
              "gid": this.data.gid,
            }).then(res => {
              this.setData({
                members: res.data,
                show: 1,
                havemembers: 1
              })
            })
          }
          
          that.setData({
            notice: res.data.notice
          })
        })
        // 获取ismanager
        app.postData("/docgroup/member/getismanager", {
          "gid": gid,
          "did": this.data.did
        }).then(res => {
          if(res.status =='ok'){
            if(res.info =='nohave'){
              this.setData({
                isRelationship: 0
              })
            }else{
              this.setData({
                isRelationship: 1,
                ismanager: res.info[0].ismanager
              })
            }
          }
        })
      }
    })

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.item.index == 0) {
      if (this.data.nohave) {
        return
      }
      this.getnotebygid()
    }
    if (this.data.item.index == 2) {
      if (this.data.nohave2) {
        return
      }
      this.getnotebydidandgid()
    }
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },
  // tab 切换
  tab: function(event) {
    const that = this
    let date = Date.parse(new Date())
    if (this.data.item.index != event.currentTarget.dataset.id) {
      this.data.item.index = event.currentTarget.dataset.id
      //如果是成员页
      if (this.data.item.index == 1) {
        //如果没有数据
        if (this.data.havemembers == 0) {
          this.setData({
            show: 0
          })
          // ajax获取成员信息
          app.postData("/docgroup/member/getpassmember", {
            "gid": this.data.gid,
          }).then(res => {
            this.setData({
              members: res.data,
              show: 1,
              havemembers: 1
            })
          })
        }
      }
      //如果是我的动态页
      if (this.data.item.index == 2) {
        //如果没有数据
        if (this.data.havemynotes == 0) {
          this.setData({
            show: 0
          })
          this.getnotebydidandgid()
        }
      }
      this.setData({
        item: this.data.item,
      })
    }
  },
  // 预览图片
  viewImage: function(e) {
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.urls] // 需要预览的图片http链接列表
    })
  },
  // 动态页收藏
  addstar: function(e) {
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
        var mynotes = this.data.mynotes;
        mynotes.data[key].istar = 1;
        this.setData({
          mynotes: mynotes
        })
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 4000
        })
      } else if (res.status == "ok" && res.info == "取消成功！") {
        var mynotes = this.data.mynotes;

        mynotes.data[key].istar = 0;
        this.setData({
          mynotes: mynotes
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
  // 动态页点赞
  addlike: function(e) {
    var did = e.currentTarget.dataset.did
    var nid = e.currentTarget.dataset.nid
    var key = e.currentTarget.dataset.key
    console.log(nid);
    app.postData("/docgroup/like/addlike", {
      "did": did,
      "nid": nid
    }).then(res => {
      if (res.status == "ok" && res.info == "点赞成功！") {
        var mynotes = this.data.mynotes;
        mynotes.data[key].likecount = mynotes.data[key].likecount + 1;
        mynotes.data[key].islike = 1;
        this.setData({
          mynotes: mynotes
        })
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 4000
        })
      } else if (res.status == "ok" && res.info == "取消成功！") {
        var mynotes = this.data.mynotes;
        mynotes.data[key].likecount = mynotes.data[key].likecount - 1;
        mynotes.data[key].islike = 0;
        this.setData({
          mynotes: mynotes
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
  }, // 我的动态页收藏
  addstar1: function(e) {
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
        var notes = this.data.notes;
        notes[key].istar = 1;
        this.setData({
          notes: notes
        })
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 4000
        })
      } else if (res.status == "ok" && res.info == "取消成功！") {
        var notes = this.data.notes;

        notes[key].istar = 0;
        this.setData({
          notes: notes
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
  // 我的动态点赞
  addlike1: function(e) {
    var did = e.currentTarget.dataset.did
    var nid = e.currentTarget.dataset.nid
    var key = e.currentTarget.dataset.key
    console.log(nid);
    console.log(key);
    app.postData("/docgroup/like/addlike", {
      "did": did,
      "nid": nid
    }).then(res => {
      if (res.status == "ok" && res.info == "点赞成功！") {
        var notes = this.data.notes;
        console.log(this.data.notes)
        notes[key].likecount = notes[key].likecount + 1;
        notes[key].islike = 1;
        this.setData({
          notes: notes
        })
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 4000
        })
      } else if (res.status == "ok" && res.info == "取消成功！") {
        var notes = this.data.notes;
        notes[key].likecount = notes[key].likecount - 1;
        notes[key].islike = 0;
        this.setData({
          notes: notes
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
  // 跳转成员信息
  bindPeople: function() {
    wx.navigateTo({
      url: '/pages/doctorGroup/index/index',
    })
  },
  // 跳转创建动态页
  bindCreateDynamic: function() {
    wx.navigateTo({
      url: '/pages/doctorGroup/createDynamic/createDynamic',
    })
  },
  // 跳转动态详情页
  bindDynamicInfo: function() {
    wx.navigateTo({
      url: '/pages/doctorGroup/dynamicInfo/dynamicInfo',
    })
  },
  navigators: function(e) {
    var did = e.currentTarget.dataset.did,
      id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/doctorGroup/dynamicInfo/dynamicInfo?did=' + did + '&nid=' + id,
    })
  },
  //通过集团id获取动态信息
  getnotebygid: function() {
    app.postData("/docgroup/note/getnotemorebygid", {
      "gid": this.data.gid,
      "did": this.data.did,
      "page": this.data.page //页数
    }).then(res => {
      this.setData({
        page: this.data.page + 1
      })
      if (res.data.length < 5) {
        this.setData({
          nohave: true
        })
      }
      for (var i = 0; i < res.data.length; i++) {

        var images = []
        var videos = []
        //  处理发布时间，更改为几分钟或者几天之前
        var t1 = new Date(res.data[i].create_time.replace(/\-/g, "/"))
        var t2 = new Date();
        var t = new Date(t2 - t1 + 1 * 3600 * 1000)

        var d = parseInt(t.getTime() / 1000 / 3600 / 24)
        res.data[i].t = d + '天之前'
        if (d < 1) {
          var m = parseInt(t.getTime() / 1000 / 3600)
          res.data[i].t = m + '分钟之前'
        }

        // 处理imageurl和videourl
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
      var list = this.data.notes.concat(res.data)
      this.setData({
        notes: list,
        show: 1
      })
    })
  },
  // 获取自己的动态信息
  getnotebydidandgid: function() {
    app.postData("/docgroup/note/getnotemorebydidandgid", {
      "did": this.data.did,
      "gid": this.data.gid,
      "page": this.data.mynotepages
    }).then(res => {
      if (res.data.length < 5) {
        this.setData({
          nohave2: true
        })
      }
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
      if (this.data.mynotepages == 0)
        this.setData({
          mynotes: res,
          mynotepages: this.data.mynotepages + 1,
          havemynotes: 1,
          show: 1
        })
      else {
        var list = this.data.mynotes.data.concat(res.data)
        var mynotes = this.data.mynotes;
        mynotes.data = list;
        this.setData({
          mynotes: mynotes,
          mynotepages: this.data.mynotepages + 1,
          havemynotes: 1,
          show: 1
        })
      }
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
    let memberList = that.data.members,
      name = that.data.searchValue
    let searchList = []
    for (let i = 0; i < memberList.length; i++) {
      if (memberList[i].docinfo.realname.indexOf(name) != -1){
        searchList.push(memberList[i])
      } else if (name.indexOf(memberList[i].docinfo.realname) != -1){
        searchList.push(memberList[i])
      }
      that.setData({
        searchList: searchList,
        searched: true
      })
    }
  },
  dochome: function(){
    const that = this
    wx.navigateToMiniProgram({
      appId: 'wxb8155eccd3eaeda4',
      path: '/pages/patient/doctor/doctor?openid=' + that.data.dopenid,
      extraData: {
      },
      envVersion: 'trial',
      success(res) {
        console.log('成功')
      }
    })
  }
})
// echarts 代码********************************************************************************
function initChart(canvas, width, height) {
  var that = this
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  echarts.registerMap('china', geoJson);
  const option = {
    tooltip: {
      trigger: 'item'
    },
    visualMap: {
      min: 0,
      max: 100,
      color: ['#00467F', '#A5CC82'],
      show: false
    },
    series: [{
      type: 'map',
      mapType: 'china',
      label: {
        normal: {
          show: false
        },
        emphasis: {
          textStyle: {
            color: '#fff'
          }
        }
      },
      itemStyle: {
        normal: {
          borderColor: '#389BB7',
          areaColor: '#fff',
        },
        emphasis: {
          areaColor: '#389BB7',
          borderWidth: 0
        }
      },
      animation: false,
      data: [{
          name: "北京",
          value: 177
        },
        {
          name: "天津",
          value: 42
        },
        {
          name: "河北",
          value: 102
        },
        {
          name: "山西",
          value: 81
        },
        {
          name: "内蒙古",
          value: 47
        },
        {
          name: "辽宁",
          value: 67
        },
        {
          name: "吉林",
          value: 82
        },
        {
          name: "黑龙江",
          value: 66
        },
        {
          name: "上海",
          value: 24
        },
        {
          name: "江苏",
          value: 92
        },
        {
          name: "浙江",
          value: 114
        },
        {
          name: "安徽",
          value: 109
        },
        {
          name: "福建",
          value: 116
        },
        {
          name: "江西",
          value: 91
        },
        {
          name: "山东",
          value: 119
        },
        {
          name: "河南",
          value: 137
        },
        {
          name: "湖北",
          value: 116
        },
        {
          name: "湖南",
          value: 114
        },
        {
          name: "重庆",
          value: 91
        },
        {
          name: "四川",
          value: 125
        },
        {
          name: "贵州",
          value: 62
        },
        {
          name: "云南",
          value: 83
        },
        {
          name: "西藏",
          value: 9
        },
        {
          name: "陕西",
          value: 80
        },
        {
          name: "甘肃",
          value: 56
        },
        {
          name: "青海",
          value: 10
        },
        {
          name: "宁夏",
          value: 18
        },
        {
          name: "新疆",
          value: 67
        },
        {
          name: "广东",
          value: 123
        },
        {
          name: "广西",
          value: 59
        },
        {
          name: "海南",
          value: 14
        },
      ],
      markPoint: {
        symbol: 'circle',
        symbolSize: 5,
        data: []
      }
    }],
  };

  chart.setOption(option);
  // 封装在app.js下的post请求，请求数据，
  app.postData("/docgroup/member/getpassmember", {
    "gid": gid,
  }).then(res => {
    // 数据处理开始
    var doc = res.data
    var dataobj = new Array();
    for (var i = 0; i < (geoJson.features).length; i++) {
      for (var j = 0; j < doc.length; j++) {
        if (doc[j].docinfo.province.indexOf((geoJson.features)[i].properties.name) != -1 || (geoJson.features)[i].properties.name.indexOf(doc[j].docinfo.province) != -1) {
          var b = {
            "name": (geoJson.features)[i].properties.name,
            "coord": (geoJson.features)[i].properties.cp
          }
          dataobj.push(b);
          break;
        }
      }
    }
    //数据处理完毕
    var option = chart.getOption();
    option.series[0].markPoint.data = dataobj;
    chart.setOption(option);
  })
  // post请求结束
  return chart;
}