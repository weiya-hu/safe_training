// pages/study/studydetail/studydetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pdfitem:'',
    timer:''
  },
                                        
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages()    //获取加载的页面
    var address = pages[pages.length - 1].options.address   //获取当前页面的对象
    this.setData({
      pdfitem: wx.getStorageSync('pdfitem')
    })
  },

  //页面加载完后开始计时
  loaded(){
    var data = {
      openid: wx.getStorageSync('openId'),
      materialId: this.data.pdfitem.id
    }
    this.setData({
      timer: setTimeout(() => {
        app.questUrl('jeecg-boot/wechat/addUserIntegral', 'post', data).then(function (res) {
          console.log(res)
          if (res.data.success == true) {
            wx.showModal({
              content: res.data.message
            })
          }
        })
      }, 40000)
    })
  },
  looked(e){
    console.log('hhh')
    console.log(e.detail.data)
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
    clearTimeout(this.data.timer)
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
    console.log('909090')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})