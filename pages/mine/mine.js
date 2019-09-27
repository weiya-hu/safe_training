// pages/mine/mine.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    userinfotxt:{},
    height:'',
    integral:'',
    message:'暂无正在兑换的积分',
    phonenumber:'',
    exchangeshow:false,
    sus:[
      { money: 10, int: 1000 }, { money: 20, int: 2000 }, { money: 30, int: 3000 }, { money: 50, int: 5000 }, { money: 100, int: 10000 },{ money: 300, int: 30000 }
    ],

    isHide: true,//获取用户信息权限界面是否显示
    phoneshow: false,//绑定用户手机号码页面是否显示
    loginshow: false,//初始获取用户信息大悬浮框是否显示
    loading: false,//登录的loading是否显示
    userinfotxt: '',//后端获取的用户信息
    empowershow: false,//授权窗口是否显示
    openId: '',
    nologin: true,//没有登录标志
    yzm: '获取验证码',
    time: '60',
    yzmswitch: true,
    phonenum: '',
    isyzm: false,//是否成功获取验证码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.height();
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      userinfotxt :wx.getStorageSync('userinfotxt')
    })
    console.log(wx.getStorageSync('userinfotxt'))
  },
  height() {//获取底部高度
    let ht = ""; var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        ht = res.windowHeight
        that.setData({
          height: ht
        })
      }
    })
  },
  start(){
    var data={
      openid: wx.getStorageSync('openId')
    },that=this;
    app.questUrl('jeecg-boot/wechat/getUserIntegral', 'post', data).then(function (res) {
      console.log(res)
      that.setData({
        integral: res.data.result.surplus,
        phonenumber: res.data.result.phone,
        message: wx.getStorageSync('intmessage') ? wx.getStorageSync('intmessage') : '暂无正在兑换的积分'
      })
    })
  },
  //点击登录按钮切换登录是否显示
  loginshow(){
    this.setData({
      loginshow:!this.data.loginshow
    })
  },
  //获取微信用户信息
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      wx.setStorageSync('userInfo', e.detail.userInfo)
      that.setData({
        isHide: false,
        userInfo: e.detail.userInfo,//这个页面不需要微信用户信息
        phoneshow: true
      });
    } else {
      //用户按了拒绝按钮
      this.setData({
        loginshow: false,
        // phoneshow: false,
        // isHide: true,
        // empowershow: true
      })
    }
  },
  phonetap(e) {
    console.log(e)
    this.setData({
      phonenum: e.detail.value
    })
  },
  //验证码点击函数
  getyzm() {
    let tel = this.data.phonenum, that = this;
    console.log(tel)
    console.log(!(/^1[34578]\d{9}$/.test(tel)))
    if (tel == '') {
      wx.showToast({
        title: '请输入电话号码',
        icon: 'none'
      })
    } else if (!(/^1[34578]\d{9}$/.test(tel))) {
      wx.showToast({
        title: '请输入正确的电话号码',
        icon: 'none'
      })
    } else {
      let yzm = '重新发送(' + this.data.time + ')';
      if (this.data.yzmswitch) {
        let data = {
          openid: wx.getStorageSync('openId'),
          phone: tel,
          userimg: wx.getStorageSync('userInfo').avatarUrl
        }
        app.questUrl('jeecg-boot/wechat/getMessageCode', 'post', data).then(function (res) {
          console.log(res)
          if (res.data.code == 500) {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          } else if (res.data.code == 200) {
            that.setData({
              yzmswitch: false,//不允许再点击获取验证码了
              // yzm: yzm,
              isyzm: true//是否有获取验证码这个动作，为后面表单验证做准备
            })
            let timer = setInterval(function () {
              let time = that.data.time - 1;
              let yzm = '重新发送(' + time + ')';
              that.setData({
                time: time,
                yzm: yzm
              })
              if (that.data.time <= 0 || that.data.loginshow === false) {
                clearInterval(timer)
                that.setData({
                  yzm: '获取验证码',
                  time: '60',
                  yzmswitch: true
                })
              }
            }, 1000)
          }
        })
      }
    }
  },
  //电话号码表单提交
  formSubmit: function (e) {
    console.log(e.detail.value)
    let phone = e.detail.value.phone, yzm = e.detail.value.yzm, that = this;
    let data = {
      openid: wx.getStorageSync('openId'),
      phone: phone,
      phoneCode: yzm
    }
    console.log(data)
    if (phone == '') {
      wx.showToast({
        title: '请输入电话号码',
        icon: 'none'
      })
    } else if (!(/^1[34578]\d{9}$/.test(phone))) {
      wx.showToast({
        title: '请输入正确的电话号码',
        icon: 'none'
      })
    } else if (!this.data.isyzm) {
      wx.showToast({
        title: '请获取验证码',
        icon: 'none'
      })
    } else if (yzm == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    } else if (!(/^\d{6}$/.test(yzm))) {
      wx.showToast({
        title: '请输入6位数字验证码',
        icon: 'none'
      })

    } else {
      this.setData({ loading: true })
      app.questUrl('jeecg-boot/wechat/examinePhoneCode', 'post', data).then(function (res) {
        console.log(res)
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
        if (res.data.message === '验证成功') {
          that.setData({
            loading: false,
            loginshow: false,
            userinfotxt: res.data.result
          })
          that.start()
          wx.setStorageSync('userinfotxt', res.data.result)
        } else {
          that.setData({
            loading: false,
            loginshow: false,
            nologin: true
          })
        }
      })
    }
  },
  //初始判断有无从后台获取的用户信息，做显示
  getuserinfotxt() {
    let userinfotxt = wx.getStorageSync('userinfotxt')
    if (userinfotxt) {
      this.setData({
        userinfotxt: userinfotxt,
        userInfo: wx.getStorageSync('userInfo'),
        loginshow: false,//以防在其他页面登录了这个页面之前登录框出来了但没有登录，防止已登录了还显示登录框
      })
    }
  },
  change(){
    var that=this;
    wx.navigateTo({
      url: 'exchange/exchange',
    })
    // this.setData({
    //   exchangeshow: !this.data.exchangeshow
    // })
  },
  changee(){
    console.log(88)
  },
  exchange(e){
    console.log(e)
    var intitem = e.currentTarget.dataset.intitem, integral = this.data.integral,that=this;
    if (intitem.int <= integral){
      wx.showModal({
        title: '提示',
        content: '是否确认兑换' + intitem.money + '元话费',
        success(res) {
          if (res.confirm) {
            var data={
              openid: wx.getStorageSync('openId'),
              card_worth:intitem.money
              // card_worth: 1
            }
            app.questUrl('jeecg-boot/wechat/dhhf','post',data).then(function(res){
              console.log(res)
              that.change()
              if (res.data.success){
                wx.showModal({
                  content: res.data.message + '(具体到账时间以实际为准)'
                })
              }else{
                wx.showModal({
                  content: res.data.message
                })
              }
              that.start()
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content:'您的积分不足以兑换'+intitem.money+'元话费'
      })
    }
  },
  showint(){
    var that=this
    wx.showModal({
      title: '提示',
      content: that.data.message ,
      success(res) {
        if (res.confirm) {
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  toscoreDetail(){
    wx.navigateTo({
      url: 'scoreDetail/scoreDetail',
    })
  },
  toexchangeDetail() {
    wx.navigateTo({
      url: 'exchangeDetail/exchangeDetail',
    })
  },
  togetscore() {
    wx.navigateTo({
      url: 'getscore/getscore',
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
    this.start()
    this.getuserinfotxt() 
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})