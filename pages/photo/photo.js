// pages/photo/photo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:[],//标段位置
    type:[],//类型
    height:'',//底部高度
    ads_tp:0,//位置active为1，类型active为2
    addresstxt:'位置',
    typetxt:'类型',
    photolist:[],//页面内容list
    imgstyle:[],
    pageno:2,
    unsafetypeId: "0",
    bidsectionId: "0",
    datashow: 0,//内容数据是否显示，0都不显示，1显示数据，2显示没有数据图片
    imageupdate:true,//图片预览后页面不刷新
    nomoreshow:false,//没有更多是否显示

    isHide: true,//获取用户信息权限界面是否显示
    phoneshow: false,//绑定用户手机号码页面是否显示
    loginshow: false,//初始获取用户信息大悬浮框是否显示
    loading: false,//登录的loading是否显示
    userinfotxt: '',//后端获取的用户信息
    empowershow: false,//授权窗口是否显示
    openId: '',
    nologin:true,//没有登录标志
    yzm: '获取验证码',
    time: '60',
    yzmswitch: true,
    phonenum: '',
    isyzm: false,//是否成功获取验证码
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this;
    // 查看是否授权
    // wx.getSetting({
    //   success: function (res) {
    //     console.log(res)
    //     if (res.authSetting['scope.userInfo']) {
    //       wx.getUserInfo({
    //         success: function (res) {
    //           console.log(res)
    //           that.setData({
    //             userInfo: res.userInfo
    //           })
    //           that.getuserinfotxt()
    //           wx.setStorageSync('userInfo', res.userInfo)
    //           // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
    //           // 根据自己的需求有其他操作再补充
    //           // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
              
    //         }
    //       });
    //     } else {
    //       // 用户没有授权
    //       that.setData({
    //         nologin: true
    //       });
    //     }
    //   },
    //   fail: function (res) {
    //     console.log(res)
    //   }
    // });
  },
  //初始判断有无从后台获取的用户信息，做显示
  getuserinfotxt() {
    let userinfotxt = wx.getStorageSync('userinfotxt')
    if (userinfotxt) {
      this.setData({
        userinfotxt: userinfotxt,
        nologin: false,
        loginshow:false,//以防在其他页面登录了这个页面之前登录框出来了但没有登录，防止已登录了还显示登录框
      })
      this.start()
      console.log(this.data.nologin)
    } else {
      // 用户没有授权
      this.setData({
        nologin: true
      });
      console.log(this.data.nologin)
    }
  },
  //登录框显示
  loginshow() {
    this.setData({
      loginshow: !this.data.loginshow
    })
    console.log(this.data.loginshow)
  },
  nologinshow(){
    this.setData({
      nologin: !this.data.nologin
    })
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
        // userInfo: e.detail.userInfo,//这个页面不需要微信用户信息

        phoneshow: true
      });
    } else {
      //用户按了拒绝按钮
      this.setData({
        loginshow: false,
        // phoneshow: false,
        // isHide: true,
        // empowershow: true
      })
    }
  },
  phonetap(e) {
    console.log(e)
    this.setData({
      phonenum: e.detail.value
    })
  },
  //验证码点击函数
  getyzm() {
    let tel = this.data.phonenum, that = this;
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
              yzmswitch: false,//不允许再点击获取验证码了
              // yzm: yzm,
              isyzm: true//是否有获取验证码这个动作，为后面表单验证做准备
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
  //电话号码表单提交
  formSubmit: function (e) {
    console.log(e.detail.value)
    let phone = e.detail.value.phone, yzm = e.detail.value.yzm, that = this;
    let data = {
      openid: wx.getStorageSync('openId'),
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
    } else if (yzm == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    } else if (!(/^\d{6}$/.test(yzm))) {
      wx.showToast({
        title: '请输入6位数字验证码',
        icon: 'none'
      })

    } else {
      this.setData({ loading: true })
      app.questUrl('jeecg-boot/wechat/examinePhoneCode', 'post', data).then(function (res) {
        console.log(res)
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
        if (res.data.message === '验证成功') {
          that.setData({
            loading: false,
            loginshow: false,
            userinfotxt: res.data.result,
            nologin: false
          })
          that.start()
          wx.setStorageSync('userinfotxt', res.data.result)
        } else {
          that.setData({
            loading: false,
            loginshow: false,
            nologin: true
          })
        }
      })
    }
  },
  //开始获取位置和类型的数据们还有下拉的页面显示高度
  start(){
    var that=this;
    this.height();
    app.questUrl('jeecg-boot/wechat/unsafetype/getAll','get').then(function(res){
      console.log(res)
      that.setData({
        address: res.data.result.address,
        type: res.data.result.type
      })
      wx.setStorageSync('address', res.data.result.address)
      wx.setStorageSync('type', res.data.result.type)
    })
  },
  update(){
    var data = {
      unsafetypeId: this.data.unsafetypeId,
      bidsectionId: this.data.bidsectionId,
      pageNo: 1,
      pageSize: 10
    },that=this;
    app.questUrl('jeecg-boot/wechat/safeOrder/list', 'post',data).then(function (res) {
      console.log(res)
      //把list里面的image字符串转为数组，并为每一个图片地址加上域名前缀
      var list = res.data.result.records;
      list.forEach((value)=>{
        if (value.image){
          var images=value.image.split(',');
          for (let i = 0; i < images.length;i++){
            images[i] = app.globalData.imgurl + images[i]+''
          }
          console.log(images)
          value.image = images
        } 
      })
      console.log(list)
      //查看list的长度是否大于0，作为有无内容判断依据
      var datashow = that.data.datashow;
      list.length > 0 ? datashow = 1 : datashow=2
      that.setData({
        photolist: list,
        datashow: datashow,
        imageupdate: true
      })
      //回到顶部
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 400
      });
    })
  },
  //上拉加载
  pulldown(){
    var data = {
      unsafetypeId: this.data.unsafetypeId,
      bidsectionId: this.data.bidsectionId,
      pageNo: this.data.pageno,
      pageSize: 10
    }, that = this;
    app.questUrl('jeecg-boot/wechat/safeOrder/list', 'post', data).then(function (res) {
      console.log(res)
      var list = res.data.result.records;
      list.forEach((value) => {
        if (value.image) {
          var images = value.image.split(',');
          for (let i = 0; i < images.length; i++) {
            images[i] = app.globalData.imgurl + images[i] + ''
          }
          // console.log(images)
          value.image = images
        }
      })
      // console.log(list)
      var nomoreshow = that.data.nomoreshow
      console.log(list.length)
      if(list.length<10){
        nomoreshow=true
      }
      that.setData({
        photolist: that.data.photolist.concat(list) ,
        pageno:that.data.pageno + 1,
        nomoreshow: nomoreshow
      })
    })

  },
  height() {//获取底部高度
    let ht = "";
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        ht = res.windowHeight
      },
    })
    var query = wx.createSelectorQuery();
    var that = this;
    query.select('.nav').boundingClientRect(function (res) {
      console.log(res)
      that.setData({
        height: ht - res.height
      })
      console.log(that.data.height)
    }).exec();
    
  },
  //nav切换函数，做切换样式功能
  changenav(e){
    console.log(e)
    var idx = e.currentTarget.dataset.idx, ads_tp = this.data.ads_tp;
    if (ads_tp==idx){
      this.setData({
        ads_tp: 0
      })
    }else{
      this.setData({
        ads_tp: idx
      })
    }
    
  },
  //修改位置功能，并且切换nav样式
  changeaddress(e){
    var item= e.currentTarget.dataset.item;
    console.log(item)
    if(item.name=='全部'){
      this.setData({
        addresstxt: '位置',
        ads_tp: 0,//去掉active
        bidsectionId: item.id
      })
    }else{
      this.setData({
        addresstxt: item.name,
        ads_tp: 0,//去掉active
        bidsectionId: item.id
      })
    }
    this.update()
  },
   //修改类型功能，并且切换nav样式
  changetype(e) {
    var item = e.currentTarget.dataset.item;
    if (item.name == '全部') {
      this.setData({
        typetxt: '类型',
        ads_tp: 0,//去掉active
        unsafetypeId:item.id
      })
    } else {
      this.setData({
        typetxt: item.name,
        ads_tp: 0,//去掉active
        unsafetypeId: item.id
      })
    }
    this.update()
  },
  toputphoto(){
    wx.navigateTo({
      url: 'putphoto/putphoto',
    })
  },
  //nav模态框是否显示
  pullback(){
    this.setData({
      ads_tp:0
    })
  },
  pullbackson(){},
  //图片加载回调
  imageLoad(e) {
    // console.log(e)
    let originalWidth = e.detail.width;
    let originalHeight = e.detail.height;
    let idx = e.currentTarget.dataset.idx, imgarr = [];
    if (originalWidth <= originalHeight) {
      imgarr[idx] = true
    } else {
      imgarr[idx] = false
    }
    this.setData({
      imgstyle: imgarr
    })  
  },
  //点击预览图片
  previewimg(e) {
    let item = e.currentTarget.dataset.item, itempre = e.currentTarget.dataset.itempre, tempFilePaths = itempre.image;
    console.log(item)
    wx.previewImage({
      pageNo: item, // 当前显示图片的http链接
      urls: tempFilePaths, // 需要预览的图片http链接列表
      current: item
    })
    //预览后页面不刷新
    this.setData({
      imageupdate:false
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
    this.getuserinfotxt()
    //不是预览图片页面显示才刷新
    if (this.data.imageupdate){
      this.update()
    }
    
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
    this.update()
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(!this.data.nomoreshow)
    if (!this.data.nomoreshow){
      this.pulldown()
    }
   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})