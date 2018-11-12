
// var a = getApp(),
//     e = a.requirejs("core"),
//     t = a.requirejs("foxui"),
//     n = a.requirejs("jquery");
// Page({
//     data: {
//         loading: true,
//         objectArray: [],
//         checkedIndex: 1,
//         checked: {},
//         bankChecked: {},
//         money: 0,
//         chargeShow: false,
//         disabled: true,
//         info: {},
//         realInfo: {}

//     },
//     onShow: function (e) {
//         this.getInfo(),
//         this.setData({
//             isSubmit: false
//         })
//     },
//     onPullDownRefresh: function () {
//         wx.stopPullDownRefresh()
//     },
//     getInfo: function () {
//         var a = this;
//         e.get("member/withdraw", {}, function (e) {
//         var t = {
//             info: e,
//             objectArray: [],
//             show: true
//         };
//         n.isEmptyObject(e.last_data) || (t.realInfo = {
//             alipay: e.last_data.alipay,
//             alipay1: e.last_data.alipay,
//             bankcard: e.last_data.bankcard,
//             bankcard1: e.last_data.bankcard,
//             bankname: e.last_data.bankname,
//             realname: e.last_data.realname
//         }),
//             e.type_array && n.each(e.type_array, function (a, e) {
//             t.objectArray.push({
//                 id: e.type,
//                 name: e.title
//             }),
//                 e.checked && (t.checked || (t.checked = {
//                 id: e.type,
//                 name: e.title
//                 }), t.checkedIndex = a)
//             }),
//             t.checked || (t.checked = t.objectArray[0], t.checkedIndex = 0),
//             t.bankCheckedIndex = e.lastbankindex || 0,
//             a.setData(t),
//             e.withdrawmoney > 0 && e.credit >= e.withdrawmoney && (t.money = e.withdrawmoney, a.moneyChange({
//                 detail: {
//                     value: e.withdrawmoney
//                 }
//             })),

            
//             3 == t.checked.id && a.bankChange({
//                 detail: {
//                     value: e.lastbankindex || 0
//                 }
//             }),
            
//             wx.setNavigationBarTitle({
//                 title: e.moneytext + "提现"
//             })
//         })
//     },
//     bindAll: function (a) {
//         this.data.info.credit <= 0 || (this.setData({
//         money: this.data.info.credit
//         }), this.allow(), this.moneyChange({
//         detail: {
//             value: this.data.info.credit
//         }
//         }))
//     },
//     allow: function () {
//         var a = this.data.info,
//         e = parseFloat(this.data.money);
//         if (e <= 0 || isNaN(e))
//         return false;
//         if (a.withdrawmoney > 0 && e < a.withdrawmoney)
//         return false;
//         if (e > a.credit)
//         return false;
//         if (n.isEmptyObject(this.data.checked))
//         return false;
//         if (a.withdrawcharge > 0 && e > 0) {
//         var t = e / 100 * a.withdrawcharge;
//         t = Math.round(100 * t) / 100,
//             t >= a.withdrawbegin && t <= a.withdrawend && (t = 0);
//         var i = e - t;
//         i = Math.round(100 * i) / 100,
//             this.setData({
//             deductionmoney: t,
//             realmoney: i,
//             chargeShow: true
//             })
//         }
//         return true
//     },
//     moneyChange: function (a) {
//         var e = a.detail.value;
//         (e < 0 || isNaN(e)) && (e = 0),
//         this.setData({
//             money: e
//         }),
//         this.setData({
//             disabled: !this.allow()
//         })
//     },
//     pickerChange: function (a) {
//         var e = {},
//         t = a.detail.value;
//         e.checked = this.data.objectArray[t],
        
//         3 == e.
//             checked.id && (e.bankChecked = this.data.info.banklist[0], e.bankCheckedIndex = 0),
//         this.setData(e)
//     },
//     inputChange: function (a) {
//         var e = this.data.realInfo,
//         t = a.currentTarget.dataset.type,
//         i = n.trim(a.detail.value);
//         e[t] = i,
//         this.setData({
//             realInfo: e
//         })
//     },
//     bankChange: function (a) {
//         var e = n.trim(a.detail.value),
//         t = this.data.info.banklist[e];
//         this.setData({
//         bankChecked: t
//         })
//     },
//     submit: function (a) {
//         var i = this,
//         r = this.data;
//         if (!r.disabled && !r.isSubmit) {
//         if (r.money <= 0)
//             return void t.toast(i, "请填写提现金额");
//         if (n.isEmptyObject(r.checked))
//             return void t.toast(i, "请选择提现方式");
//         var o = r.checked.name,
//             d = {
//             applytype: r.checked.id,
//             money: r.money
//             };
//         if (2 == r.checked.id) {
//             if (!r.realInfo.realname)
//             return void t.toast(i, "请填写姓名");
//             if (!r.realInfo.alipay)
//             return void t.toast(i, "请填写支付宝帐号");
//             if (!r.realInfo.alipay1)
//             return void t.toast(i, "请确认支付宝帐号");
//             if (r.realInfo.alipay != r.realInfo.alipay1)
//             return void t.toast(i, "两次填写的支付宝不一致");
//             o += "？姓名:" + r.realInfo.realname + " 支付宝帐号:" + r.realInfo.alipay,
//             d.realname = r.realInfo.realname,
//             d.alipay = r.realInfo.alipay,
//             d.alipay1 = r.realInfo.alipay1
//         } else if (3 == r.checked.id) {
//             if (n.isEmptyObject(r.bankChecked))
//             return void t.toast(i, "请选择提现银行");
//             if (!r.realInfo.realname)
//             return void t.toast(i, "请填写姓名");
//             if (!r.realInfo.bankcard)
//             return void t.toast(i, "请填写银行卡号");
//             if (!r.realInfo.bankcard1)
//             return void t.toast(i, "请确认银行卡号");
//             if (r.realInfo.bankcard != r.realInfo.bankcard1)
//             return void t.toast(i, "两次填写的银行卡号不一致");
//             o += "？姓名:" + r.realInfo.realname + " 银行:" + r.bankChecked.bankname + " 卡号:" + r.realInfo.bankcard,
//             d.realname = r.realInfo.realname,
//             d.bankname = r.realInfo.bankname,
//             d.bankcard = r.realInfo.bankcard,
//             d.bankcard1 = r.realInfo.bankcard1
//         }
//         if (r.checked.id < 2)
//             var l = "确认要" + o + "？";
//         else
//             var l = "确认要" + o;
//         r.info.withdrawcharge > 0 && (l += " 扣除手续费 " + r.deductionmoney + " 元,实际到账金额 " + r.realmoney + " 元"),
//             e.confirm(l, function () {
//             i.setData({
//                 isSubmit: true
//             }),
//             d.bankname = r.bankChecked.bankname || ''
//                 e.post("member/withdraw/submit", d, function (a) {
//                 if (a.error)
//                     return t.toast(i, a.message), void i.setData({
//                         isSubmit: false
//                     });
//                 t.toast(i, "提现申请成功，请等待审核"),
//                     setTimeout(function () {
//                         wx.navigateTo({
//                             url: "/pages/doctor/my/my"
//                         })
//                     }, 500)
//                 })
//             })
//         }
//     }
// })

var app = getApp(),
    port = app.requirejs("core")

Page({
    data:{
        modeShow:false,
        id: '',
        bank: '',
        card: '',
        totalprice:0,
        username:'',
        bankname: '',
        bankcard: '',
        show: false
    },

    onLoad(){
        this.setData({
            openid: app.getCache("userinfo").openid
        })
        this.look()
    },

    // 获取我的银行卡信息
    look(){
        const that = this
        port.post("member/bankcard/my_bankcard", {
            param: { openid: that.data.openid }
        }, function (res) {
            if(res.list.length!=0){
                that.setData({
                    card: res.list[0].bankcard.substr(res.list[0].bankcard.length - 4),
                    bank: res.list[0].bankname,
                    username: res.list[0].username,
                    bankname: res.list[0].bankname,
                    bankcard: res.list[0].bankcard,
                    id: res.list[0].id,
                    show: true
                })
            }
        })

        port.post("member/doctors/doctors_bill", {
            param: { openid: that.data.openid }
        }, function (res) {
            console.log(res,'是手打')
            that.setData({
                list: res.list,
                totalprice: res.totalprice[0].totalprice,
                show: true
            })
        })
    },

    bound(){
        this.setData({
            modeShow: true
        })
        // console.log('卡号验证')
        // let bankno = '6217003320014837432'
        // if (luhnCheck(bankno)){
        //     console.log('正确')
        // }else{
        //     console.log('错误')
        // }
    },

    // 点击确定
    formSubmit: function (e) {
        const that = this
        e.detail.value.openid = that.data.openid
        e.detail.value.id = ''
        if (e.detail.target.dataset.type==1){
            wx.showModal({
                title: '提示',
                content: '确定解绑该银行卡 ？？？',
                success: function (res) {
                    if (res.confirm) {
                        port.post("member/bankcard/del_bankcard", {
                            param: {
                                openid: that.data.openid,
                                id: that.data.id
                            }
                        }, function (res) {
                            console.log(res)
                            if (res.status == 1) {
                                wx.showToast({
                                    title: '解绑成功',
                                    icon: 'success'
                                }, that.look())
                            }
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
           
        }else{
            if (!e.detail.value.username) {
                wx.showToast({
                    title: '请输入持卡人',
                    icon: 'loading'
                })
            } else if (e.detail.value.username.indexOf(" ") >= 0) {
                wx.showToast({
                    title: '持卡人有空格',
                    icon: 'loading'
                })
            } else if (!e.detail.value.bankname) {
                wx.showToast({
                    title: '请输入所属银行',
                    icon: 'loading'
                })
            } else if (e.detail.value.bankname.indexOf(" ") >= 0) {
                wx.showToast({
                    title: '所属银行有空格',
                    icon: 'loading'
                })
            } else if (!e.detail.value.bankcard) {
                wx.showToast({
                    title: '请输入卡号',
                    icon: 'loading'
                })
            } else if (!luhnCheck(e.detail.value.bankcard)) {
                wx.showToast({
                    title: '卡号错误',
                    icon: 'loading'
                })
            } else {
                console.log('form发生了submit事件，携带数据为：', e.detail.value)
                port.post("member/bankcard/add_bankcard", {
                    param: e.detail.value
                }, function (res) {
                    console.log(res)
                    if (res.status == 1) {
                        wx.showToast({
                            title: '绑定成功',
                            icon: 'success'
                        },
                            that.setData({
                                modeShow: false
                            },
                                that.look()
                            )
                        )
                    }
                })
            }
        }
       
    },

    // 删除银行卡接口member/bankcard/del_bankcard        参数 param { openid，id }

    cancel(){
        this.setData({
            modeShow: false
        })
    },

    /**
     * 弹出框蒙层截断touchmove事件
     */
    preventTouchMove: function () { },
})


//银行卡号码检测
function luhnCheck(bankno) {
    var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhn进行比较）
    var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
    var newArr = new Array();
    for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
        newArr.push(first15Num.substr(i, 1));
    }
    var arrJiShu = new Array(); //奇数位*2的积 <9
    var arrJiShu2 = new Array(); //奇数位*2的积 >9
    var arrOuShu = new Array(); //偶数位数组
    for (var j = 0; j < newArr.length; j++) {
        if ((j + 1) % 2 == 1) { //奇数位
            if (parseInt(newArr[j]) * 2 < 9) arrJiShu.push(parseInt(newArr[j]) * 2);
            else arrJiShu2.push(parseInt(newArr[j]) * 2);
        } else //偶数位
            arrOuShu.push(newArr[j]);
    }

    var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
    for (var h = 0; h < arrJiShu2.length; h++) {
        jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
        jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
    }

    var sumJiShu = 0; //奇数位*2 < 9 的数组之和
    var sumOuShu = 0; //偶数位数组之和
    var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal = 0;
    for (var m = 0; m < arrJiShu.length; m++) {
        sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
    }

    for (var n = 0; n < arrOuShu.length; n++) {
        sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
    }

    for (var p = 0; p < jishu_child1.length; p++) {
        sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
        sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
    }
    //计算总和
    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

    //计算luhn值
    var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
    var luhn = 10 - k;

    if (lastNum == luhn) {
        // $("#banknoInfo").html("luhn验证通过");
        return true;
    } else {
        // $("#banknoInfo").html("银行卡号必须符合luhn校验");
        return false;
    }
}