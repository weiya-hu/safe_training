// pages/mine/exchangeDetail/exchangeDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exchangelist: [],
    // isupdate: null,//是否可以更新
    page: null,//当前页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.start()
  },
  //下拉刷新和初始数据
  start() {
    let that = this;
    let data = {
      openid: wx.getStorageSync('openId'),
      pageNo: 1,
      pageSize: 12
    }
    app.questUrl('jeecg-boot/wechat/integralData/getUsedIntegralData', 'post', data).then(function (res) {
      console.log(res)
      if (res.data.code === 200) {
        that.setData({
          exchangelist: res.data.result.records,
          isupdate: !(res.data.result.pages - res.data.result.current),
          page: res.data.result.current + 1
        })
      }
    })
  },
  //上拉加载
  update() {
    this.setData({
      loadingshow: true
    })
    let data = {
      openid: wx.getStorageSync('openId'),
      pageNo: this.data.page,
      pageSize: 12
    };
    let exchangelist = this.data.exchangelist, that = this;
    app.questUrl('jeecg-boot/wechat/integralData/getUserIntegralData', 'post', data).then(function (res) {
      console.log(res)
      if (res.data.code === 200) {
        that.setData({
          exchangelist: exchangelist.concat(res.data.result.records),
          isupdate: !(res.data.result.pages - res.data.result.current),
          page: res.data.result.current + 1,
          loadingshow: false
        })
      } else {
        that.setData({
          loadingshow: false
        })
      }
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
    this.start()
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.isupdate) {
      this.update()
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})