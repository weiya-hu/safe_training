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
    imgloadsuccess:[],
    isExamine:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.start()
  },
  //开始获取位置和类型的数据们还有下拉的页面显示高度
  start(){
    var that=this;
    this.height();
    app.questUrl('jeecg-boot/wechat/unsafetype/getAll','get').then(function(res){
      console.log(res)
      that.setData({
        address: res.data.result.address,
        type: res.data.result.type,
        isExamine: wx.getStorageSync('isExamine')
      })
      wx.setStorageSync('address', res.data.result.address)
      wx.setStorageSync('type', res.data.result.type)
    })
  },
  update(){
    var data = {
      openid:wx.getStorageSync('openId'),
      unsafetypeId: this.data.unsafetypeId,
      bidsectionId: this.data.bidsectionId,
      pageNo: 1,
      pageSize: 10
    },that=this;
    app.questUrl('jeecg-boot/wechat/safeOrder/list', 'post',data).then(function (res) {
      console.log(res)
      //把list里面的image字符串转为数组，并为每一个图片地址加上域名前缀
      if(res.data.code===200){
        var list = res.data.result.records;
        list.forEach((value) => {
          if (value.image) {
            console.log(value.image)
            var images = value.image.split(',');
            for (let i = 0; i < images.length; i++) {
              images[i] = app.globalData.imgurl + images[i] + ''
            }
            value.image = images
          }else{
            value.image = []
          }
        })
        console.log(list)
        //查看list的长度是否大于0，作为有无内容判断依据,datashow==1为list内容，2为没有内容
        var datashow = that.data.datashow;
        list.length > 0 ? datashow = 1 : datashow = 2;
        //设置默认图片显示
        var imgloadsuccess = that.data.imgloadsuccess;
        for (let i = 0; i < list.length; i++) {
          imgloadsuccess.push([])
          for (let j = 0; j < list[i].image.length;j++){
            imgloadsuccess[i][j] = true
          }
        }
        that.setData({
          photolist: list,
          datashow: datashow,
          imageupdate: true,
          noempowor: false,
          imgloadsuccess: imgloadsuccess
        })
        //回到顶部
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 400
        });

      } else if (res.data.code===403){
        that.setData({
          noempowor: true,
          message: res.data.message
        })
        
      }
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
  //图片加载回调,设置默认图片显示
  imageLoad(e) {
    console.log(e)
    var imgloadsuccess = this.data.imgloadsuccess, idxs = e.currentTarget.dataset;
    imgloadsuccess[idxs.idx][idxs.idex] = false
    this.setData({
      imgloadsuccess: imgloadsuccess
    })
  },
  //点击预览图片s
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