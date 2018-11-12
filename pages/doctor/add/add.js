var app = getApp(),
    port = app.requirejs("core"),
    util = require('../../../utils/util'); 
Page({

    data: {
        mode: false,
        address: '',
        id: '',
        addcon: 0,
        setaddress: ''
    },

    onLoad: function (options) {
        this.setData({
            openid: app.getCache("userinfo").openid
        })
        this.list()
    },

    list(){
        const that = this
        port.post("member/doctors/get_address", {
            param: {openid:that.data.openid}
        }, function (res) {
            that.setData({
                list: res.list
            })
        })
    },

    accretion(e){
        this.setData({
            mode: true,
            addcon: 1
        })
    },

    hidmode(){
        this.setData({
            mode: false,
            address: '',
            addcon: 0,
            setaddress: '',
            id: ''
        })
    },

    abolish(){
        this.setData({
            mode: false,
            address: '',
            addcon: 0,
            setaddress: '',
            id: ''
        })
    },

    removemode(){},

    bindinput(e){
        this.setData({
            address: e.detail.value
        })
    },
    setbindinput(e){
        this.setData({
            setaddress: e.detail.value
        })
    },

    determine(){
        const that = this
        if (this.data.address){
            wx.showModal({
                title: '提示',
                content: '再次确认地址：' + that.data.address,
                confirmColor: '#02c6dc',
                success: (res) => {
                    if (res.confirm) {
                        port.get("member/doctors/save_address", {
                            param: { 
                                openid: that.data.openid,
                                address: that.data.address,
                                id: that.data.id
                             }
                        }, function (res) {
                            if (res.status==1){
                                wx.showToast({
                                    title: '添加成功',
                                    icon: 'success'
                                })
                                that.setData({
                                    mode: false,
                                    address: '',
                                    addcon: 0,
                                    setaddress: '',
                                    id: ''
                                })
                                that.list()
                            } else {
                                wx.showToast({
                                    title: '添加失败',
                                    icon: 'loading'
                                })
                            }
                        })
                    } else if (res.cancel) {

                    }
                }
            })
        }else{
            wx.showToast({
                title: '请先输入地址',
                icon: 'loading'
            })
        }
    },

    setdetermine(){
        const that = this
        if (this.data.setaddress) {
            wx.showModal({
                title: '提示',
                content: '再次确认地址：' + that.data.setaddress,
                confirmColor: '#02c6dc',
                success: (res) => {
                    if (res.confirm) {
                        port.get("member/doctors/save_address", {
                            param: {
                                openid: that.data.openid,
                                address: that.data.setaddress,
                                id: that.data.id
                            }
                        }, function (res) {
                            if (res.status == 1) {
                                wx.showToast({
                                    title: '修改成功',
                                    icon: 'success'
                                })
                                that.setData({
                                    mode: false,
                                    address: '',
                                    addcon: 0,
                                    setaddress: '',
                                    id: ''
                                })
                                that.list()
                            }else{
                                wx.showToast({
                                    title: '修改失败',
                                    icon: 'loading'
                                })
                            }
                        })
                    } else if (res.cancel) {

                    }
                }
            })
        } else {
            wx.showToast({
                title: '请先输入地址',
                icon: 'loading'
            })
        }
    },

    setadd(e){
        const that = this
        wx.showActionSheet({
            itemList: ['修改', '删除'],
            success: function (res) {
                if (res.tapIndex==0){
                    that.setData({
                        mode: true,
                        addcon: 2,
                        id: e.currentTarget.dataset.id,
                        setaddress: e.currentTarget.dataset.setaddress
                    })
                } else if (res.tapIndex == 1){
                    wx.showModal({
                        title: '提示',
                        content: '确定删除地址：' + e.currentTarget.dataset.setaddress,
                        confirmColor: '#02c6dc',
                        success:(res)=>{
                            if(res.confirm){
                                port.get("member/doctors/delete_address", {
                                    id: e.currentTarget.dataset.id
                                }, function (res) {
                                    if (res.status == 1) {
                                        wx.showToast({
                                            title: '删除成功',
                                            icon: 'success'
                                        })
                                        that.list()
                                    }
                                })
                            }else if(res.cancel){

                            }
                        }
                    })
                   
                }
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    },

    click(e){
        const that = this
        wx.showModal({
            title: '提示',
            content: '确定选择此地址：' + e.currentTarget.dataset.address,
            confirmColor: '#02c6dc',
            success: (res)=>{
                if(res.confirm){
                    let address = e.currentTarget.dataset.address;
                    let pages = getCurrentPages();
                    let prevPage = pages[pages.length - 2]; //上一个页面
                    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
                    prevPage.setData({
                        address: address
                    })
                    wx.navigateBack({
                        delta: 1, // 回退前 delta(默认为1) 页面
                    })
                }else if(res.cancel){

                }
            }
        })
    }

})