//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    let islogin=wx.getStorageSync('islogin')
    if(!islogin){
      wx.setStorageSync('islogin', false)
    }
  },
  questUrl(url,method, data) {
    wx.showLoading({
      title: '',
    })
    //返回一个Promise对象
    return new Promise(function (resolve, reject) {
      wx.request({
        url: 'https://kaijin.zhoumc.cn/'+url,
        // url: 'http://192.168.100.134:8080/'+url,
        method: method,
        data: data,
        //在header中统一封装报文头，这样不用每个接口都写一样的报文头定义的代码
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          wx.hideLoading();
          //这里可以根据自己项目服务端定义的正确的返回码来进行，接口请求成功后的处理，当然也可以在这里进行报文加解密的统一处理
          if (res.data) {
            resolve(res);
          } else {
            //如果出现异常则弹出dialog
            wx.showModal({
              title: '提示',
              content: res.data.errCode + '系统异常',
              confirmColor: '#118EDE',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                }
              }
            });
          }
        },
        fail: function (res) {
          wx.hideLoading();
          wx.showToast({
            title: '服务器暂时无法连接',
            icon: 'loading',
            duration: 2000
          })
          reject(res);
        }
      });
    });
  },
  questUrl_noloading(url, method, data) {
    
    //返回一个Promise对象
    return new Promise(function (resolve, reject) {
      wx.request({
        url: 'https://kaijin.zhoumc.cn/'+url,
        // url: 'http://192.168.100.134:8080/' + url,
        method: method,
        data: data,
        //在header中统一封装报文头，这样不用每个接口都写一样的报文头定义的代码
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          //这里可以根据自己项目服务端定义的正确的返回码来进行，接口请求成功后的处理，当然也可以在这里进行报文加解密的统一处理
          if (res.data) {
            resolve(res);
          } else {
            //如果出现异常则弹出dialog
            wx.showModal({
              title: '提示',
              content: res.data.errCode + '系统异常',
              confirmColor: '#118EDE',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                }
              }
            });
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '服务器暂时无法连接',
            icon: 'loading',
            duration: 2000
          })
          reject(res);
        }
      });
    });
  },
  
  globalData: {
    exercisePostPaperFlag:true,//答题交卷开关，避免接口还没有返回多次点击交卷生效
    // url:'http://192.168.100.134:8080/',
    // imgurl:'http://192.168.100.134:8080/jeecg-boot/sys/common/view/',
    url:'https://kaijin.zhoumc.cn/',
    imgurl:'https://kaijin.zhoumc.cn/jeecg-boot/sys/common/view/'
  }
})