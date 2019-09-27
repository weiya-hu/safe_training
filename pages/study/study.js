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
  onLoad: function (options) {
    var that=this;
    this.start()
    // wx.downloadFile({ 
    //   url: 'https://kaijin.zhoumc.cn/jeecg-boot/generic/web/viewer.html?file=https://kaijin.zhoumc.cn/jeecg-boot/sys/common/view/files/20190725/%E9%9A%A7%E9%81%93%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E8%B5%84%E6%96%99_1564037943780.pdf', 
    //   success: function (res) { 
    //     console.log(res)
    //     var filePath = res.tempFilePath  
    //     that.setData({
    //       filePath: filePath
    //     })      
    //     wx.openDocument({ 
    //       filePath: filePath,
    //       fileType: 'pdf', 
    //       success: function (res) { 
    //         console.log('打开文档成功') 
    //       },
    //       fail: function (res) {
    //         console.log(res)
    //       }
    //     }) 
    //   } 
    // })

  },
  start(){
    var that = this;
    var pages = getCurrentPages()    //获取加载的页面
    var id = pages[pages.length - 1].options.id    //获取当前页面的对象
    var data = { id: id };
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