// pages/exercise/exercise.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:'',//页面总高度
    idx:0,//初始答题第几题
    answernum:5,//用户所给答案下标
    key:5,//每一题的正确答案下标
    totalnum:'',//总共有多少道题目
    titles: [],//题目
    checkanswerFlag:true,//答题开关
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.start()
    this.setData({
      totalnum: this.data.titles.length
    })  
  },
  start(){
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        var ht = res.windowHeight
        that.setData({
          height:ht
        })
      },
    })
    var pages = getCurrentPages()    //获取加载的页面
    var id = pages[pages.length - 1].options.id    //获取当前页面的对象
    console.log(id)
    let data={questionTypeId:id}
    app.questUrl('jeecg-boot/wechat/question/getQuestionByQuestionTypeId', 'post',data).then(function (res) {
      console.log(res)
      that.setData({
        titles:res.data.result,
        totalnum: res.data.result.length,
        questionTypeId:id
      })
    })
  },
  checkanswer(e){
    if (this.data.checkanswerFlag){
      console.log(e)
      var idx = this.data.idx + 1, length = this.data.titles.length, that = this;
      var num = e.currentTarget.dataset.answer
      this.setData({
        answernum: num,
        key: this.data.titles[this.data.idx].result,
        checkanswerFlag: false
      })
      var data = {
        questionTypeId: this.data.questionTypeId,
        questionId: this.data.titles[this.data.idx].id,
        openid: wx.getStorageSync('openId'),
        answerResult: num
      }
      app.questUrl_noloading('jeecg-boot/wechat/question/getUserAnswer', 'post', data).then(function (res) {
        console.log(res)
        if (res.data.success == true) {
          if (idx < length) {
            setTimeout(() => {
              that.setData({
                answernum: 5,
                key: 5,
                idx: that.data.idx + 1,
                checkanswerFlag: true
              })
            }, 800)
          } else {
            setTimeout(() => {
              // that.setData({
              //   idx: that.data.idx + 1
              // })
              that.toscore()
              that.setData({
                checkanswerFlag: true
              })
            }, 800)
            // that.toscore(that.data.questionTypeId)
          }
        }
      })
    }
    
  },
  toscore(){
    var that=this,idx=this.data.idx,url='';
    
    if(idx){
      url='../score/score?questionTypeId=' + this.data.questionTypeId
    }else{
      console.log(idx)
      url= '../score/score?questionTypeId=' + this.data.questionTypeId + '&num=' + this.data.totalnum
    }
    wx.navigateTo({
      url: url,
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
    var data={
      questionTypeId: this.data.questionTypeId,
      openid: wx.getStorageSync('openId')
    }
    app.questUrl('jeecg-boot/wechat/question/rollBack', 'post',data).then(function (res) {
      console.log(res)
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