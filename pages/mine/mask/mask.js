// pages/mine/mask/mask.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:'',
    imgurl:'',
    maskmodelshow:false,
    num: '',
    isgreen:false,
    isred: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.height()
  },
  //获取页面高度
  height() {
    let ht = ""; var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        ht = res.windowHeight
        that.setData({
          height: ht
        })
      }
    })
  },
  selectimg(e){
    let num = e.currentTarget.dataset.num;
    this.setData({
      maskmodelshow: true,
      num:num,
      imgurl: "https://kaijin.zhoumc.cn/jeecg-boot/sys/common/view/files/wechat/mask" + num + ".jpg"
    })
  },
  exitmaskshow(){
    this.setData({
      maskmodelshow:!this.data.maskmodelshow,
      isgreen: false,
      isred: false,
    })
  },
  startmask(){
    let num=this.data.num;
    if(num==8){
      this.setData({
        isgreen:true,    imgurl:'https://kaijin.zhoumc.cn/jeecg-boot/sys/common/view/files/wechat/mask1.jpg'
      })
    }else if(num==3){
      this.setData({
        isgreen: true, 
        imgurl: 'https://kaijin.zhoumc.cn/jeecg-boot/sys/common/view/files/wechat/mask2.jpg'
      })
    } else if (num == 4) {
      this.setData({
        isred: true, 
        imgurl: 'https://kaijin.zhoumc.cn/jeecg-boot/sys/common/view/files/wechat/mask5.jpg'
      })
    } else if (num == 6) {
      this.setData({
        isgreen: true, 
        imgurl: 'https://kaijin.zhoumc.cn/jeecg-boot/sys/common/view/files/wechat/mask7.jpg'
      })
    }
  },
  previewimg(){
    let that=this;
    wx.previewImage({
      current: that.data.imgurl, // 当前显示图片的http链接
      urls: [that.data.imgurl],
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