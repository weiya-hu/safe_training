// pages/photo/putphoto/putphoto.js
let app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    height: '',//屏幕高度
    width: '',//屏幕宽度
    addresstxtlist:[],
    typetxtlist:[],
    typetxt: '请选择类型',
    addresstxt:'请选择位置',
    address: [],//带有地址所有信息的arr
    type: [],//带有类型所有信息的arr
    tempFilePathss: [],//页面显示的添加图片的预览
    productInfo: [],//上报的图片名列表
    imgstyle: [],//图片预览宽高以谁为100%
    count: 5,//图片能上传的数量
    disabled: false,//设置是否能点击 false可以 true不能点击
    titlevalue: '',
    contentvalue: '',//内容值
    checkboxval: [],//指定用户加载更多被选值的id集合
    checkedarr: [],//指定用户加载更多的checkbox是否被选boolean值
    id: '',//地址id
    max:400,//content最大数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.start()
  },
  start: function () {
    var address = wx.getStorageSync('address'); address.shift();
    var type = wx.getStorageSync('type'); type.shift();
    var addresstxtlist = address.map((value) => {return value.name});
    var typetxtlist = type.map((value) => { return value.name });
    console.log(addresstxtlist)
    this.setData({
      addresstxtlist: addresstxtlist,
      typetxtlist: typetxtlist,
      address: address,
      type: type
    })
  },
  //类型选择函数
  bindtypeChange: function (e) {
    console.log(e.detail.value)
    var idx = e.detail.value,type=this.data.type;
    this.setData({
      typetxt: type[idx].name,
      unsafetypeId: type[idx].id
    })
  },
  //位置选择函数
  bindaddressChange: function (e) {
    console.log(e.detail.value)
    var idx = e.detail.value, address = this.data.address;
    this.setData({
      addresstxt: address[idx].name,
      bidsectionId: address[idx].id
    })
  },
  //内容输入函数
  contentinp(e) {
    this.setData({
      contentvalue: e.detail.value,
      currentWordNumber: parseInt(e.detail.value.length)
    })
  },
  //通告对象选择函数
  // bindtargetChange: function (e) {
  //   console.log(e.detail.value)
  //   let target = '', token = wx.getStorageSync('token'), that = this;
  //   e.detail.value == 0 ? target = '全部用户' : target = '指定用户'
  //   this.setData({
  //     targetvalue: target,
  //     targetuservalue: ''
  //   })

  //   if (e.detail.value == 1) {
  //     let data = {
  //       column: 'createTime',
  //       order: 'desc',
  //       pageNo: that.data.pageNo,
  //       pageSize: 15,
  //       id: that.data.id
  //     }
  //     app.questUrl('jeecg-boot/sys/user/findByEngineeringId', 'get', token, data).then(function (res) {
  //       console.log(res)
  //       if (res.data.code == 0) {
  //         if (res.data.result.records.length < 15) {
  //           that.setData({
  //             jumploadmore: true,
  //             checkitems: res.data.result.records,
  //           })
  //         } else {
  //           that.setData({
  //             checkitems: res.data.result.records,
  //             pageNo: that.data.pageNo + 1
  //           })
  //         }

  //       }
  //     })
  //   }
  // },
  //指定用户加载更多
  // loadmore() {
  //   if (this.data.jumploadmore) {
  //     console.log(this.data.jumploadmore)

  //     return
  //   } else {
  //     let token = wx.getStorageSync('token'), that = this;
  //     let data = {
  //       column: 'createTime',
  //       order: 'desc',
  //       pageNo: this.data.pageNo,
  //       pageSize: 15,
  //       id: this.data.id
  //     }
  //     app.questUrl('jeecg-boot/sys/user/findByEngineeringId', 'get', token, data).then(function (res) {
  //       console.log(res)
  //       if (res.data.code == 0) {
  //         if (res.data.result.records.length < 15) {
  //           that.setData({
  //             jumploadmore: true,
  //             checkitems: that.data.checkitems.concat(res.data.result.records)
  //           })
  //         } else {
  //           that.setData({
  //             checkitems: that.data.checkitems.concat(res.data.result.records),
  //             pageNo: that.data.pageNo + 1
  //           })
  //         }

  //       }
  //     })
  //   }

  // },
  //获取加载更多checkbox被选值列表
  // checked(checkitems, checkboxval) {
  //   console.log(checkitems)
  //   console.log(checkboxval)
  //   let arr = []
  //   for (let i = 0, l = checkitems.length; i < l; i++) {
  //     let flg = checkboxval.find(m => m == checkitems[i].id)
  //     if (flg) {
  //       arr.push(true)
  //     } else {
  //       arr.push(false)
  //     }
  //   }
  //   console.log(arr)
  //   this.setData({
  //     checkedarr: arr
  //   })
  // },
  //添加图片
  addimg() {
    var that = this, token = wx.getStorageSync('token'), tempFilePathss = this.data.tempFilePathss;
    wx.chooseImage({
      count: this.data.count,  //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths;
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        var uploadImgCount = 0;
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {
          let m = tempFilePaths[i]
          wx.uploadFile({
            url: app.globalData.url + 'jeecg-boot/sys/common/upload',
            filePath: tempFilePaths[i],
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data",
              "X-Requested-With": "XMLHttpRequest"
            },
            success: function (res) {
              tempFilePathss.push(m)
              that.setData({
                tempFilePathss: tempFilePathss,
                count: that.data.count - 1
              })
              console.log(res)
              uploadImgCount++;
              var data = JSON.parse(res.data);
              //服务器返回格式: { "Catalog": "testFolder", "FileName": "1.jpg", "Url": "https://test.com/1.jpg" }  
              var productInfo = that.data.productInfo;
              productInfo.push(data.message);
              that.setData({
                productInfo: productInfo
              });
              console.log(that.data.productInfo)
              console.log(that.data.tempFilePathss);
              //如果是最后一张,则隐藏等待中  
              if (uploadImgCount == tempFilePaths.length) {
                wx.hideToast();
              }
            },
            fail: function (res) {
              console.log(res)
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function (res) { }
              })
            }
          });
        }
      }
    });
  },
  //图片加载回调
  imageLoad(e) {
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
  //图片删除
  deletee(e) {
    let item = e.currentTarget.dataset.item, tempFilePathss = this.data.tempFilePathss, productInfo = this.data.productInfo;
    for (let i = 0, length = tempFilePathss.length; i < length; i++) {
      if (tempFilePathss[i] == item) {
        tempFilePathss.splice(i, 1);
        productInfo.splice(i, 1);
      }
    }
    this.setData({
      tempFilePathss: tempFilePathss,
      count: this.data.count + 1,
      productInfo: productInfo
    })
    console.log(this.data.productInfo);
    console.log(this.data.tempFilePathss);
  },
  //点击预览图片
  previewimg(e) {
    let item = e.currentTarget.dataset.item, tempFilePaths = this.data.tempFilePathss;
    let indx = e.currentTarget.dataset.indx
    console.log(indx)
    wx.previewImage({
      pageNo: item, // 当前显示图片的http链接
      urls: tempFilePaths, // 需要预览的图片http链接列表
      current: item
    })
  },
  //上报函数
  formSubmit(e) {
    console.log(e)
    let that = this;
    let data = {
      openid: wx.getStorageSync('openId'),
      unsafetypeId: this.data.unsafetypeId,
      bidsectionId: this.data.bidsectionId,
      content: e.detail.value.content,
      image: this.data.productInfo.length > 0 ? this.data.productInfo.join(',') : null  
    }
    if (e.detail.value.address == '') {
      wx.showToast({
        title: '请选择位置',
        icon: 'none'
      })
    } else if (e.detail.value.type =='') {
      wx.showToast({
        title: '请选择类型',
        icon: 'none'
      })
    } else if (e.detail.value.content == '') {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none'
      })
    }else {
      wx.showToast({
        title: '正在发送...',
        icon: 'loading',
        mask: true,
        duration: 10000
      })
      app.questUrl('jeecg-boot/wechat/safeOrder/addOrder', 'post',data).then(function (res) {
        console.log(res)
        wx.hideToast();
        if (res.data.code === 200) {
          wx.showToast({
            title: '发送成功',
            icon: 'none'
          })
          that.setData({
            typevalue: '请选择消息类型',
            targetvalue: '请选择通告对象',
            targetuservalue: '请选择通告对象',
            tempFilePathss: [],//页面显示的添加图片的预览
            productInfo: [],
            userIds: [],
            titlevalue: '',
            contentvalue: '',
            count: 5
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 2000)
        } else if (res.data.code === 201){
          wx.showModal({
            title: '错误提示',
            content: res.data.message,
            showCancel: false,
            success: function (res) { }
          })
        } else {
          wx.showModal({
            title: '错误提示',
            content: '发送失败，不属于项目组工作人员的不能发送随手拍',
            showCancel: false,
            success: function (res) { }
          })
        }
      })
    }
  },
  formReset(e) {
    let that=this;
    wx.showModal({
      content: '确定退出此次编辑',
      success(res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1,
          })
          that.setData({
            typevalue: '请选择消息类型',
            targetvalue: '请选择通告对象',
            targetuservalue: '请选择通告对象',
            tempFilePathss: [],//页面显示的添加图片的预览
            productInfo: [],
            userIds: [],
            titlevalue: '',
            contentvalue: ''
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //开始时间函数
  // onPickerChangestart(e) {
  //   let enddate = parseInt(this.data.enddate.split("-").join('').split(" ").join('').split(":").join(''));
  //   let startdate = parseInt(e.detail.dateString.split("-").join('').split(" ").join('').split(":").join(''));
  //   console.log(enddate)
  //   console.log(startdate)
  //   if (enddate > 201901010000) {
  //     console.log(222)
  //     if (startdate < enddate) {
  //       this.setData({
  //         startdate: e.detail.dateString,
  //         datetipstart: false,
  //         datetipend: false,
  //       })
  //     } else {
  //       this.setData({
  //         datetipstart: true,
  //       })
  //     }
  //   } else {
  //     this.setData({
  //       enddate: e.detail.dateString,
  //       datetipend: false,
  //       datetipstart: false,
  //     })
  //   }
  // },
  //结束时间函数
  // onPickerChangeend(e) {
  //   let startdate = parseInt(this.data.startdate.split("-").join('').split(" ").join('').split(":").join(''));
  //   let enddate = parseInt(e.detail.dateString.split("-").join('').split(" ").join('').split(":").join(''));
  //   console.log(enddate)
  //   console.log(startdate)

  //   if (enddate > startdate) {
  //     this.setData({
  //       enddate: e.detail.dateString,
  //       datetipend: false,
  //       datetipstart: false,
  //     })
  //   } else {
  //     this.setData({
  //       datetipend: true,
  //     })
  //   }
  // },
  //选择指定用户显示
  // selectusershow(event) {
  //   if (event.currentTarget.dataset.sure == 'sure') {
  //     this.setData({
  //       selectusershow: false,
  //       contentvalue: this.data.contentvalue
  //     })
  //   } else {
  //     this.setData({
  //       selectusershow: true
  //     })
  //     this.checked(this.data.checkitems, this.data.checkboxval)
  //   }
  //   console.log(this.data.userIds)
  // },
  //选择指定用户显示隐藏，并且userids为空
  // checkshow() {
  //   this.setData({
  //     selectusershow: false,
  //     userIds: []
  //   })
  // },
  //指定用户函数
  // checkboxChange(e) {
  //   let val = e.detail.value;
  //   console.log(val)
  //   let targetuservalue = val.map(m => m.split(',')[1])
  //   let userIds = val.map(m => m.split(',')[0])
  //   console.log(targetuservalue)
  //   this.setData({
  //     userIds: userIds,
  //     targetuservalue: targetuservalue,
  //     checkboxval: userIds
  //   })
  // },
  
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