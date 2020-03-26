// pages/mine/exchange/exchange.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'',
    height:'',
    isover:false,//可兑换金额是否超过可兑换
    ischange:false,//是否可兑换
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.start()
  },
  start(){
    this.height()
    var data = {
      openid: wx.getStorageSync('openId')
    }, that = this;
    app.questUrl('jeecg-boot/wechat/getUserIntegral', 'post', data).then(function (res) {
      console.log(res)
      that.setData({
        money: res.data.result.money
      })
      console.log(that.data.money)

    })
  },
  //获取页面高度
  height() {
    let that=this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      },
    })
  },
  //输入金额函数
  inputchange(e){
    let money = this.data.money - 0, val = e.detail.value - 0, valu = e.detail.value
    if(money<10){
      this.setData({
        value: valu,
        ischange: false
      })
    }else if(money>=10 && val<=money && val>=10){
      this.setData({
        value: valu,
        isover: false,
        ischange: true
      })
    } else if (money >= 10 && val <= money && val <10) {
      this.setData({
        value: valu,
        isover: false,
        ischange: false
      })
    } else if (money >= 10 && val>money){
      console.log(val)
      console.log(money)
      this.setData({
        value: valu,
        isover: true,
        ischange: false
      })
    }
    console.log(this.data.ischange)
  },
  //兑换
  exchange(){
    let that=this
    wx.showModal({
      title: '提示',
      content: '是否确认提现',
      success(res) {
        if (res.confirm) {
          let value = that.data.value + '';
          let data = {
            openid: wx.getStorageSync('openId'),
            amount: value
          }
          app.questUrl('jeecg-boot/wechat/pay', 'post', data).then(function (res) {
            console.log(res)
            if (res.data.code == 200) {
              wx.showModal({
                content: res.data.message,
              })
            }
            if (res.data.success == true) {
              that.setData({
                money: that.data.money - value,
                value: ''
              })
            }
          })
        } else if (res.cancel) {

        }
      }
    })
    
  },
  //全部兑换
  allexchange() {
    let money=this.data.money;
    if(money>=10){
      this.setData({
        value: this.data.money,
        ischange:true
      })
    }else{
      wx.showModal({
        content: '您可兑换的余额少于￥10，低于最小兑换额',
      })
      this.setData({
        ischange: false
      })
    }
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