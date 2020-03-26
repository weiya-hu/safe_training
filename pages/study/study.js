// pages/study/study.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studylist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
  },
  start(){
    var that = this;
    var pages = getCurrentPages()    //获取加载的页面
    var id = pages[pages.length - 1].options.id    //获取当前页面的对象
    var data = { id: id, openid: wx.getStorageSync('openId')};
    app.questUrl('jeecg-boot/wechat/learningmaterials/getByPid', 'post', data).then(function (res) {
      console.log(res)
      that.setData({
        studylist: res.data.result
      })
    })
  },
  tostudydetail(e){
    console.log(e)
    var pdfitem = e.currentTarget.dataset.pdfitem
    wx.setStorageSync('pdfitem', pdfitem)
    wx.navigateTo({
      url: 'studydetail/studydetail',
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