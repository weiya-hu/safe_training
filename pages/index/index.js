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
    var that = this;
    this.gettitle()
    this.start()
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              that.setData({
                userInfo: res.userInfo
                // userinfotxt: wx.getStorageSync('userinfotxt')
              })
              that.getuserinfotxt()
              wx.setStorageSync('userInfo', res.userInfo)
              // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
              // 根据自己的需求有其他操作再补充
            }
          });
        } else {
          // 用户没有授权
          that.setData({
            empowershow:true
          });
        }
      },
      fail:function(res){
        console.log(res)
      }
    });
  },

  //授权弹窗
  power(e){
    console.log(e)
    let type = e.currentTarget.dataset.type
    this.setData({
      isHide: true,
      loginshow: true,
      type:type
    })
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
  //获取微信用户信息
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      wx.setStorageSync('userInfo', e.detail.userInfo)
      that.setData({
        isHide: false,
        userInfo: e.detail.userInfo,
        phoneshow: true
      });
    } else {
      //用户按了拒绝按钮
      this.setData({
        loginshow: false,
        phoneshow: false,
        isHide: true,
        empowershow: true
      })
    }
  },
  //手机号登录点击取消时
  quxiao(){
    this.setData({
      phoneshow: !this.data.phoneshow,
      loginshow: !this.data.loginshow
    })
  },
  //验证码点击函数
  getyzm() {
    let tel = this.data.phonenum,that = this;
    console.log(tel)
    console.log(!(/^1[34578]\d{9}$/.test(tel)))
    if (tel == '') {
      wx.showToast({
        title: '请输入电话号码',
        icon: 'none'
      })
    } else if (!(/^1[34578]\d{9}$/.test(tel))) {
      wx.showToast({
        title: '请输入正确的电话号码',
        icon: 'none'
      })
    } else {
      let yzm = '重新发送(' + this.data.time + ')';
      if (this.data.yzmswitch) {

        let data = {
          openid: wx.getStorageSync('openId'),
          phone: tel,
          userimg: wx.getStorageSync('userInfo').avatarUrl
        }
        app.questUrl('jeecg-boot/wechat/getMessageCode', 'post', data).then(function (res) {
          console.log(res)
          if (res.data.code == 500) {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          } else if (res.data.code == 200) {
            that.setData({
              yzmswitch: false,
              yzm: yzm,
              isyzm:true
            })
            let timer = setInterval(function () {
              let time = that.data.time - 1;
              let yzm = '重新发送(' + time + ')';
              that.setData({
                time: time,
                yzm: yzm
              })
              if (that.data.time <= 0 || that.data.loginshow === false) {
                clearInterval(timer)
                that.setData({
                  yzm: '获取验证码',
                  time: '60',
                  yzmswitch: true
                })
              }
            }, 1000)
          }
        })
      }
    }
  },
  phonetap(e) {
    console.log(e)
    this.setData({
      phonenum: e.detail.value
    })
  },
  //电话号码表单提交
  formSubmit: function (e) {
    console.log(e.detail.value)
    let phone = e.detail.value.phone, yzm = e.detail.value.yzm, that = this;
    let data = {
      openid: this.data.openId,
      phone: phone,
      phoneCode: yzm
    }
    console.log(data)
    if (phone == '') {
      wx.showToast({
        title: '请输入电话号码',
        icon: 'none'
      })
    } else if (!(/^1[34578]\d{9}$/.test(phone))) {
      wx.showToast({
        title: '请输入正确的电话号码',
        icon: 'none'
      })
    } else if (!this.data.isyzm) {
      wx.showToast({
        title: '请获取验证码',
        icon: 'none'
      })
    }else if (yzm == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    } else if (!(/^\d{6}$/.test(yzm))) {
      wx.showToast({
        title: '请输入6位数字验证码',
        icon: 'none'
      }) 
    
    }else {
      this.setData({ loading: true })
      app.questUrl('jeecg-boot/wechat/examinePhoneCode','post',data).then(function (res) {
        console.log(res)
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        }) 
        if(res.data.message==='验证成功'){
          that.setData({
            loading: false,
            loginshow: false,
            userinfotxt: res.data.result,
            empowershow:false
          })
          wx.setStorageSync('userinfotxt', res.data.result) 
        } else{
          that.setData({
            loading: false,
            loginshow: false,
            empowershow:true
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
        userinfotxt: userinfotxt,
        loginshow: false,//以防在其他页面登录了这个页面之前登录框出来了但没有登录，防止已登录了还显示登录框
        empowershow:false//在其他页面已登录，首页悬浮的授权view隐藏
      })
    }else{
      this.setData({
        empowershow: true
      });
    }
  },
  //规则显示函数
  ruleshow(){
    this.setData({
      ruleshow: !this.data.ruleshow
    })
  },
  gettitle(){
    var that=this;
    app.questUrl('jeecg-boot/wechat/questionType/list', 'get').then(function (res) {
      app.questUrl('jeecg-boot/wechat/learningmaterials/getFatherList', 'get').then(function (res){
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
      var title=[];
      for (var i in res.data.result.records) {
        title.push(res.data.result.records[i].name)
      }
      that.setData({
        title:title,
        titleres: res.data.result.records
      })
    })
  },
  loginshow_no(){
    this.setData({
      loginshow: false
    })
    console.log(this.data.loginshow)
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
