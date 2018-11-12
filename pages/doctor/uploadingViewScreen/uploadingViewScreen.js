var app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        charge: 0,
        tempFilePaths: "",
        video: '',
        videoname:'',
        content:'',
        money:'',
        tag:'',
        show: false
    },

    onLoad: function (options) {
        const that = this
        options.id?(
            port.get("member/videos/get_detail", {
                param:{
                    id: options.id,
                    openid: app.getCache("userinfo").openid
                }
            }, function (res) {
                if (res.error == 0) {
                    let charge
                    if (res.list.money == 0){
                        charge = 0
                    }else{
                        charge = res.list.money
                    }
                    that.setData({
                        charge: charge,
                        id: options.id,
                        videoname: res.list.videoname,
                        frontImgs: res.list.img_url,
                        content: res.list.content,
                        video: { 
                            url: res.list.videoinfo.transcodeInfo.transcodeList[res.list.videoinfo.transcodeInfo.transcodeList.length - 1].url, 
                            fileId: res.list.fileid, 
                            coverUrl: res.list.videoinfo.basicInfo.coverUrl },
                        money: res.list.money,
                        tag: res.list.tag
                    })
                }
            })
        ):(
            console.log()
        )
        this.setData({
            openid: app.getCache("userinfo").openid,
            show: true
        })
        
    },

    // 上传视频
    video: function () {
        const that = this
        port.video(function (t) {
            let newfileId = t.fileId
            //这里改了
            port.post("member/videos/set_videoImage", {
                param: { fileId: newfileId }
            }, function (res) {
                wx.hideToast()
                wx.showLoading({
                    title: '截取封面中...',
                })
                //原来的
                setTimeout(function () {
                   
                    if (newfileId) {
                        wx.showToast({
                            title: '上传成功',
                        })
                        that.videoInfo(newfileId)
                    }
                }, 10000)
            })
        })
    }, 

    videoInfo(newfileId){
        var that = this
        port.post("member/videos/videoInfo", {
            param: { fileId: newfileId } 
        }, function (res) {
            wx.hideToast()
            if (res.result.code == 0) {
                let video = {}
                video.url = res.result.transcodeInfo.transcodeList[res.result.transcodeInfo.transcodeList.length - 1].url
                
                if (res.result.snapshotByTimeOffsetInfo.snapshotByTimeOffsetList[0].picInfoList[0].url){
                    wx.showToast({
                        title: '截取成功',
                        icon: 'success'
                    })
                    video.coverUrl = res.result.snapshotByTimeOffsetInfo.snapshotByTimeOffsetList[0].picInfoList[0].url
                }else{
                    wx.showToast({
                        title: '暂未生成封面',
                        icon: 'success'
                    })
                    video.coverUrl = ''
                }
                
                video.fileId = newfileId
                that.setData({
                    video: video
                })
            } else {
                wx.showToast({
                    title: '请求失败',
                    icon: 'loading'
                })
            }
        })
    },

    // 是否收费选中
    charge: function(e){
        e.currentTarget.dataset.chargestate == 'yes'?(
            this.setData({
                charge: 1
            })
        ):(
            this.setData({
                charge: 0
            })
        )
    },

    formSubmit: function (e) {
        e.detail.value.video_url = this.data.video.url,
        e.detail.value.fileid = this.data.video.fileId,
        e.detail.value.state = this.data.charge,
        e.detail.value.openid = this.data.openid,
        !e.detail.value.videoname || !e.detail.value.content || (this.data.charge && !e.detail.value.money) || !e.detail.value.video_url || !e.detail.value.fileid ?(
            wx.showToast({
                title: '请完善，再提交',
                icon: 'none',
            })
        ):(
            this.data.id?(
                e.detail.value.id = this.data.id,
                port.post("member/videos/edit", {
                    param: e.detail.value
                }, function (res) {
                    if (res.error == 0) {
                        wx.showToast({
                            title: '修改成功',
                            icon: 'success'
                        },
                            wx.navigateBack({
                                delta: 2
                            })
                        )
                    }
                })
            ):(
                port.post("member/videos/add", {
                    param: e.detail.value
                }, function (res) {
                    if(res.error == 0){
                        wx.showToast({
                            title: '提交成功',
                            icon: 'success' 
                        },
                            wx.navigateBack({
                                delta: 1
                            })
                        )
                    }
                })
            )
        )
    },

    closeVideo: function(){
        this.setData({
            video: ''
        })
    }
})