const app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        video:'',
        show: false
    },

    onLoad: function (options) {
        const that = this
        this.setData({
            id: options.id,
            openid: app.getCache("userinfo").openid,   
        })
        // options.style == 1 ? (
        //     wx.setNavigationBarTitle({
        //         title: '视频审核详情'
        //     })
        // ) : (
        //     wx.setNavigationBarTitle({
        //         title: '播放视屏'
        //     })
        // )
        port.get("member/videos/get_detail", {
            param:{
                id: options.id,
                openid: app.getCache("userinfo").openid
            }
        }, function (res) {
            let url = res.list.videoinfo.transcodeInfo.transcodeList[res.list.videoinfo.transcodeInfo.transcodeList.length - 1].url
            if (res.error == 0) {
                that.setData({
                    video: res.list,
                    video2: {
                        url: url,
                        fileId: res.list.fileid,
                        coverUrl: res.list.videoinfo.snapshotByTimeOffsetInfo.snapshotByTimeOffsetList[0].picInfoList[0].url
                    },
                    show: true
                })
            }
        })
    },

    submit: function () {
        const that = this
        var param = { id: this.data.id, openid: this.data.openid }
        wx.showActionSheet({
            itemList: ['修改', '发布'],
            success: function (res) {
                if (res.tapIndex){
                    port.get("member/videos/enabled", {
                        param: param
                    }, function (res) {
                        console.log(res)
                        res.error == 0?(
                            wx.showToast({
                                title: '发布成功',
                                icon: 'success'
                            },  
                                wx.navigateBack({
                                    delta: 1
                                })
                            )
                        ):(
                            wx.showToast({
                                title: '发布失败',
                                icon: 'loading'
                            })
                        )
                    })
                }else{
                    wx.navigateTo({
                        url: '/pages/doctor/uploadingViewScreen/uploadingViewScreen?id=' + that.data.id
                    })
                }
                
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    },
    alter(){
        wx.navigateTo({
            url: '/pages/doctor/uploadingViewScreen/uploadingViewScreen?id=' + this.data.id
        })
    }
})