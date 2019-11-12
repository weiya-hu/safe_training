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
    selectkey:5,//每一题的正确答案下标
    totalnum:'',//总共有多少道题目
    titles: [],//题目
    checkanswerFlag:true,//答题开关
    isFocus: true,    //聚焦
    Value: "",        //输入的内容
    ispassword: true, //是否密文显示 true为密文， false为明文。
    disabled: true,
    tipblockshow:false,//提示是否显示
    nexttxt:'',//下一题的文字，可能没有文字，可能是确定
    isFillinRight: 3,//填空题答案没提交，1是正确，2是错误
    sureflag:true,//点击确定按钮的开关，在请求接口过程中不允许再次点击
    
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
    let data = { questionTypeId: id, openid: wx.getStorageSync('openId')}
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
    console.log(e)
    var idx = this.data.idx + 1, length = this.data.titles.length, that = this;
    var num = e.currentTarget.dataset.answer
    if (this.data.nexttxt!=='下一题'){
      this.setData({
        answernum: num,
        nexttxt: '确定'
      })
    }
    
  },
  //点击确定或下一题
  tonext(){
    var idx = this.data.idx + 1, length = this.data.titles.length, that = this;
    //点击确定按钮的时候，请求接口看答案是否正确
    if(this.data.nexttxt==='确定'){
      if(that.data.sureflag){
        that.setData({
          sureflag:false
        })
        //如果这道题的填空题的时候
        if (this.data.titles[this.data.idx].belong === 1) {
          var data = {
            questionTypeId: this.data.questionTypeId,
            questionId: this.data.titles[this.data.idx].id,
            openid: wx.getStorageSync('openId'),
            answerResult: this.data.Value
          };
          app.questUrl_noloading('jeecg-boot/wechat/question/getUserAnswer', 'post', data).then(function (res) {
            console.log(res)
            that.setData({ sureflag:true})
            //如果答案正确
            if (res.data.message === 'true') {
              that.setData({
                isFillinRight: 1,//填空题答案正确
              })
              setTimeout(() => {
                if (idx < length) {
                  that.setData({
                    idx: that.data.idx + 1,//跳到下一题
                    Value: '',//设置下一题填空题内容为空
                    nexttxt: '',//下一题刚开始确定按钮不显示
                    isFillinRight: 3//填空题答案初始没提交，1是正确，2是错误
                  })
                } else {
                  that.toscore()
                }
              }, 500)
              //如果答案错误
            } else if (res.data.message === 'false') {
              if (idx < length) {
                that.setData({
                  isFillinRight: 2,//填空题答案错误
                  nexttxt: '下一题'//下一题刚开始确定按钮不显示
                })
              } else if (idx = length) {
                that.setData({
                  isFillinRight: 2,//填空题答案错误
                  nexttxt: '交卷'//最后一道题显示交卷
                })
              }
            }
          })
           //如果这道题是选择题的时候
        } else if (this.data.titles[this.data.idx].belong === 0) {
          var data = {
            questionTypeId: that.data.questionTypeId,
            questionId: that.data.titles[this.data.idx].id,
            openid: wx.getStorageSync('openId'),
            answerResult: that.data.answernum
          };
          app.questUrl_noloading('jeecg-boot/wechat/question/getUserAnswer', 'post', data).then(function (res) {
            console.log(res)
            that.setData({ sureflag: true })
            if (res.data.message === 'true') {
              that.setData({
                selectkey: that.data.titles[that.data.idx].result,//正确答案为用户选择答案
                isFillinRight: 1//选择题答案正确
              })
              setTimeout(() => {
                if (idx < length) {
                  that.setData({
                    idx: that.data.idx + 1,//跳到下一题
                    answernum: 5,//设置为5，选择项没有样式，初始样式
                    selectkey: 5,//答案初始值，没有样式
                    nexttxt: '',//下一题刚开始确定按钮不显示
                    isFillinRight: 3//填空题答案初始没提交，1是正确，2是错误
                  })
                } else {
                  that.toscore()
                }
              }, 500)
            } else if (res.data.message === 'false') {
              if (idx < length) {
                that.setData({
                  nexttxt: '下一题',//下一题按钮显示下一题
                  isFillinRight: 2,//选择题答案错误
                  selectkey: that.data.titles[that.data.idx].result//正确答案为用户选择答案

                })
              } else if (idx = length) {
                that.setData({
                  isFillinRight: 2,//选择题答案错误
                  selectkey: that.data.titles[that.data.idx].result,//正确答案为用户选择答案
                  nexttxt: '交卷'//最后一道题显示交卷
                })
              }

            }
          })
        }
      }
     
      // 选择下一题
    } else if (this.data.nexttxt === '下一题'){
      if (this.data.titles[this.data.idx].belong === 1){
        if (idx < length) {
          that.setData({
            idx: that.data.idx + 1,//跳到下一题
            Value: '',//设置下一题填空题内容为空
            nexttxt: '',//下一题刚开始确定按钮不显示
            isFillinRight: 3//填空题答案初始没提交，1是正确，2是错误
          })
        } else {
          that.toscore()
        }
      } else if (this.data.titles[this.data.idx].belong === 0){
        if (idx < length) {
          that.setData({
            idx: that.data.idx + 1,//跳到下一题
            answernum: 5,//设置为5，选择项没有样式，初始样式
            selectkey: 5,//答案初始值，没有样式
            nexttxt: '',//下一题刚开始确定按钮不显示
            isFillinRight: 3//填空题答案初始没提交，1是正确，2是错误
          })
        } else {
          that.toscore()
        }
      }
      
    } else if (this.data.nexttxt === '交卷'){
      that.toscore()
    }
    
    
  },
  toscore(){
    var that=this,idx=this.data.idx,url='';
    console.log(idx)

    if (idx) {
      url = '../score/score?questionTypeId=' + that.data.questionTypeId
    } else {
      console.log(idx)
      url = '../score/score?questionTypeId=' + that.data.questionTypeId + '&num=' + that.data.totalnum
    }
    wx.navigateTo({
      url: url,
    })  
  },
  //真实的输入框的输入改变事件
  Focus(e) {
    var that = this;
    let length = e.currentTarget.dataset.length;
    var inputValue = e.detail.value;
    console.log(inputValue)
    console.log('pppppppppppp')
    var ilen = inputValue.length;
    if (ilen == 6) {
      that.setData({
        disabled: false,
      })
    } else {
      that.setData({
        disabled: true,
      })
    }
    console.log(inputValue)
    if (inputValue.length>0){
      that.setData({
        Value: inputValue,
        nexttxt:'确定'
      })
    }else{
      that.setData({
        Value: inputValue,
        nexttxt: ''
      })
    }
    
    
  },
  //真实输入框是去焦点事件
  blur() {
    this.setData({
      isFocus: false,
    })
  },
  //作为显示的输入框的点击事件
  Tap() {
    this.setData({
      isFocus: true,
    })
  },
  //提示框是否显示
  tipblockshow(){
    this.setData({
      tipblockshow: !this.data.tipblockshow
    })
  },
  cha(){},
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