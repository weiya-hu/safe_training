//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    userInfo: {},
    isHide:false,//获取用户信息权限界面是否显示
    phoneshow:false,//绑定用户手机号码页面是否显示
    loginshow:false,//初始获取用户信息大悬浮框是否显示
    loading: false,//登录的loading是否显示
    userinfotxt:'',//后端获取的用户信息
    empowershow:false,//授权窗口是否显示
    openId:'',
    ruleshow:false,//规则详情是否显示
    title: [],
    titleres:[],
    study: [],
    studyres: '',
    type:'',//选择答题还是学习
    yzm:'获取验证码',
    time: '60',
    yzmswitch: true,
    phonenum: '',
    isyzm:false,//是否成功获取验证码

  },
  onLoad: function () {
    this.gettitle();
    this.start()
  },


  //调用wx.login获取oppenid
  start(){
    let openId = wx.getStorageSync('openId'),that=this;
    console.log(openId)
    if (openId){
      this.setData({
        openId: openId
      })
    }else{
      wx.login({
        success: function (res) {
          console.log(res)
          console.log(res.code)
          var url = "jeecg-boot/wechat/wxLogin?code=" + res.code
          app.questUrl(url,'post').then(function (res) {
            console.log(res)
            wx.setStorageSync('openId', res.data.result.openid)
            that.setData({
              openId: res.data.result.openid
            })
          })
        }
      })
    }
    
  },
  //初始判断有无从后台获取的用户信息，做显示
  getuserinfotxt(){
    let userinfotxt = wx.getStorageSync('userinfotxt')
    if(userinfotxt){
      this.setData({
        userinfotxt: userinfotxt
      })
    }
  },
  //规则显示函数
  ruleshow(){
    this.setData({
      ruleshow: !this.data.ruleshow
    })
  },
  ruleshows(){},
  //获取题目和学习类目
  gettitle(){
    var that=this;
    app.questUrl('jeecg-boot/wechat/questionType/list', 'get').then(function (res) {
      app.questUrl('jeecg-boot/wechat/learningmaterials/getFatherList', 'get').then(function (res) {
        console.log(res)
        var study = [];
        for (var i in res.data.result) {
          study.push(res.data.result[i].name)
        }
        that.setData({
          study: study,
          studyres: res.data.result
        })
      })
      console.log(res)
      var title = [];
      for (var i in res.data.result.records) {
        title.push(res.data.result.records[i].name)
      }
      that.setData({
        title: title,
        titleres: res.data.result.records
      })
    })
   
  },

  bindexerciseChange(e){
    console.log(e)
    let val=e.detail.value;
    wx.navigateTo({
      url: '../exercise/exercise?id='+this.data.titleres[val].id,
    })
  },
  bindstudyChange(e) {
    console.log(e)
    let val = e.detail.value;
    if(val==0){
      wx.navigateTo({
        url: '../video/video?id=' + this.data.studyres[val].id,
      })
    }else if(val==1){
      wx.navigateTo({
        url: '../study/study?id=' + this.data.studyres[val].id,
      })
    }
    
  },
  tomine(){
    wx.switchTab({
      url: '../mine/mine',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getuserinfotxt()
  },
})
