// pages/score/score.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score:'',
    scores:'',
    totlescore:'',
    // questionsize: '',
    pointsusshow:true,
    getpointshow:false,
    nopointshow:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.start()
  },
  start(){
    var pages = getCurrentPages(),that=this    //获取加载的页面
    var id = pages[pages.length - 1].options.questionTypeId   //获取当前页面的对象
    var num =pages[pages.length - 1].options.num
    if(num){
      var scores=[]
      for (var i = 0; i < num;i++){scores.push(2)}
      this.setData({
        score:0,
        scores: scores,
        totlescore: num*10,
        nopointshow: true,

      })
    }else{
      if (app.globalData.exercisePostPaperFlag===false){
        var data = { questionTypeId: id, openid: wx.getStorageSync('openId') }
        app.questUrl('jeecg-boot/wechat/question/postPaper', 'post', data).then(function (res) {
          console.log(res)
          app.globalData.exercisePostPaperFlag = true;
          if (res.data.success == true) {
            wx.showModal({
              content: res.data.message
            })
            var scores = [], resscores = res.data.result.tureAndFalseArr.split(',');
            for (var i = 0, lth = res.data.result.questionSize; i < lth; i++) {
              if (resscores[i]) {
                scores.push(resscores[i])
              } else {
                scores.push(2)
              }
            }
            console.log(scores)
            var getpointshow = false, nopointshow = false;
            if (res.data.result.getJF > 0) {
              getpointshow = true;
            } else {
              nopointshow = true;
            }
            that.setData({
              score: res.data.result.userScore,
              scorejf: res.data.result.getJF,
              scores: scores,
              totlescore: res.data.result.totalScore,
              getpointshow: getpointshow,
              nopointshow: nopointshow
            })
          }
        })
      }
      
    }
    
  },
  pointsusshow(){
    this.setData({
      pointsusshow:false
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
    wx.switchTab({
      url: '../index/index'
    })
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