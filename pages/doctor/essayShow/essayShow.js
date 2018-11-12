var app = getApp(),
    port = app.requirejs("core")
Page({

    data: {
        show: false,
        click: '查看图片'
    },

    onLoad: function (options) {
        const that = this
        this.setData({
            id: options.id,
            openid: app.getCache("userinfo").openid
        })
        
        port.post("articles/article_detail", {
            param:{
                id: options.id,
                openid: app.getCache("userinfo").openid
            }
        }, function (res) {
            if (res.error == 0) {
                that.setData({
                    essay: res.res,
                    article_content: res.res.article_content,
                    show: true
                })
            }
        })
    },

    submit: function(){
        const that = this
        var state
        wx.showModal({
            title: '提示',
            content: '确认发布？？？',
            confirmText:'确认',
            confirmColor: '#02c6dc',
            success: (res)=>{
                if(res.confirm){
                    port.get("articles/release_article", {
                        id: that.data.id
                    }, function (res) {
                        if (res.res == "success") {
                            wx.showToast({
                                title: '发布成功',
                                icon: 'success',
                                duration: 2000,
                            },
                                wx.navigateBack({
                                    delta: 1
                                })
                            )
                        }
                    })
                }
            }
        })
       
        // wx.showActionSheet({
        //     itemList: ['修改', '发布'],
        //     success: function (res) {
        //         res.tapIndex?(  //发布
        //             // 发布的接口
        //             port.get("articles/release_article", {
        //                 id: that.data.id
        //             }, function (res) {
        //                 console.log(res, '发布转态')
        //                 if (res.error == 0) {
        //                    wx.showToast({
        //                        title: '发布成功',
        //                        icon: 'success',
        //                        duration: 2000
        //                    },
        //                        wx.navigateBack({
        //                            delta: 1
        //                        })
        //                    )
        //                 }
        //             })
        //         ):(
        //             wx.navigateTo({
        //                 url: '/pages/doctor/uploadingEssay/uploadingEssay?id=' + that.data.id,
        //             })
        //         )
        //     },
        //     fail: function (res) {
        //         console.log(res.errMsg)
        //     }
        // })
    },
    imgShow(e) {
        let newEssey = this.data.article_content
        let click
        if (newEssey[e.currentTarget.dataset.imgshowindex].tactful == 1) {
            newEssey[e.currentTarget.dataset.imgshowindex].tactful = 0
            click = '隐藏此图片'
        } else {
            newEssey[e.currentTarget.dataset.imgshowindex].tactful = 1
            click = '查看图片'
        }
        this.setData({
            article_content: newEssey,
            click: click
        })
    },

    amend: function(){
        const that = this
        wx.navigateTo({
            url: '/pages/doctor/uploadingEssay/uploadingEssay?id=' + that.data.id,
        })
    }

})