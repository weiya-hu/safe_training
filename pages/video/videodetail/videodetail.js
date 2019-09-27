// pages/video/videodetail/videodetail.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoitem:{},
    idx:'',
    videos:[],
    ee:'',
    height:'',
    timer: '',//计时器
    timeendflag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.height();
    var pages = getCurrentPages()    //获取加载的页面
    var idx = pages[pages.length - 1].options.idx   //获取当前页面的对象
    var videos = wx.getStorageSync('videos')
    this.timer(videos[idx])
    this.setData({
      videoitem: videos[idx],
      idx:idx,
      videos:videos
    })
    setInterval(()=>{
      console.log(this.data.timeendflag)
    },1000)
  },
  timer(videoitem){
    this.setData({
      timeendflag: false,
      timer: setTimeout(() => {
        this.setData({
          timeendflag: true
        })
      }, videoitem.duration)
    })
  },
  changevideo(e){
    var idex = e.currentTarget.dataset.idex
    this.timer(this.data.videos[idex])
    this.setData({
      idx:idex,
      videoitem: this.data.videos[idex]
    })
  },
  binderrorvido(e) {
    console.log(JSON.stringify(e))
    var ee = JSON.stringify(e)
    this.setData({
      ee: ee
    })
    wx.showModal({
      title: '提示',
      content: '播放出错了，请稍后再试',
    })
  },
  height() {//获取底部高度
    var ht = "";
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        ht = res.windowHeight
      },
    })
    var query = wx.createSelectorQuery();
    var that = this;
    query.select('.video').boundingClientRect(function (res) {
      console.log(res)
      that.setData({
        height: ht - res.height
      })
    }).exec();
  }, 
  videoend(e){
    console.log('视频播放完了')
    console.log(e)
    console.log(JSON.stringify(e))
    if(this.data.timeendflag){
      var data = {
        openid: wx.getStorageSync('openId'),
        materialId: this.data.videoitem.id
      }
      app.questUrl('jeecg-boot/wechat/addUserIntegral', 'post', data).then(function (res) {
        console.log(res)
        if (res.data.success == true) {
          wx.showModal({
            content: res.data.message
          })
        }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
