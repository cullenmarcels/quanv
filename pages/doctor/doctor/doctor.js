// pages/doctor/doctor/doctor.js
Page({

    data: {
        item: {
            index: 0,
            nav: ['讨论区', '小V组', '中v组','大v组']
        },
    },

    // 栏目切换
    nav: function (event) {
        console.log(event.currentTarget.dataset.id)
        this.data.item.index = event.currentTarget.dataset.id
        this.setData({
            item: this.data.item
        })
    },
})