// pages/mine/uptitle/uptitle.js
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typelist:{},//题目工种类型和题目选择填空类型
    worktxt:'请选择题目所属工种',
    titletxt:'请选择题目类型',
    height: '',//页面总高度
    tipblockshow: false,//提示是否显示
    type: null,//idx=0是选择题，1是填空题
    selectnum:0,//选择题添加的答案选项
    selectAnswerRange:['A'],//选择题答案选项
    selectanswer:'',//选择题答案初始显示
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.start()
  },
  start() {
    let that=this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        var ht = res.windowHeight
        that.setData({
          height: ht
        })
      },
    })
    app.questUrl('jeecg-boot/wechat/question/getAllQuestionType', 'get').then((res) => {
      console.log(res)
      that.setData({
        typelist: res.data.result
      })
    })
  },
  bindworkChange(e){
    console.log(e)
    let idx = e.detail.value, worklist = this.data.typelist.nameType;
    this.setData({
      worktxt: worklist[idx].name
    })
  },
  bindtitleChange(e) {
    console.log(e)
    let idx = e.detail.value, titlelist = this.data.typelist.questionType;
    this.setData({
      titletxt: titlelist[idx].name,
      type:idx//idx=0是选择题，1是填空题
    })
  },
  selectanswerChange(e) {
    console.log(e)
    let idx = e.detail.value, selectAnswerRange = this.data.selectAnswerRange;
    this.setData({
      selectanswer: selectAnswerRange[idx]
    })

  },
  //提示框是否显示
  tipblockshow() {
    this.setData({
      tipblockshow: !this.data.tipblockshow
    })
  },
  cha() { },
  contentinp(e) {
    this.setData({
      contentvalue: e.detail.value,
      currenttitleNumber: parseInt(e.detail.value.length)
    })
  },
  answerinp(e) {
    console.log(e)
    this.setData({
      answervalue: e.detail.value,
      currentanswerNumber: parseInt(e.detail.value.length)
    })
  },
  addselect(){
    let selectnum = this.data.selectnum
    if (selectnum==0){
      this.setData({
        selectnum:selectnum+1,
        selectAnswerRange: ['A','B']
      })
    }else if (selectnum == 1) {
      this.setData({
        selectnum: selectnum + 1,
        selectAnswerRange: ['A', 'B','C']
      })
    } else if (selectnum == 2) {
      this.setData({
        selectnum: selectnum + 1,
        selectAnswerRange: ['A', 'B', 'C','D']
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '选择题答案选项最多不超过4个',
      })
    }
  },
  seletedelete(){
    let selectnum = this.data.selectnum
    if (selectnum ==1) {
      this.setData({
        selectnum: selectnum -1,
        selectAnswerRange: ['A']
      })
    } else if (selectnum == 2) {
      this.setData({
        selectnum: selectnum - 1,
        selectAnswerRange: ['A', 'B']
      })
    } else if (selectnum == 3) {
      this.setData({
        selectnum: selectnum - 1,
        selectAnswerRange: ['A', 'B', 'C']
      })
    }
  },
  // 提交上传
  formSubmit(e){
    console.log(e)
    let val=e.detail.value,that=this;
    if (val.worktype===''){
      wx.showModal({
        title: '提示',
        content: '请选择题目所属工种',
      })
    } else if (val.titletype === '') {
      wx.showModal({
        title: '提示',
        content: '请选择题目类型',
      })
    } else if (val.title === '') {
      wx.showModal({
        title: '提示',
        content: '请输入题目',
      })
       // 当是选择题时选项和答案和上传请求接口的处理
    } else if (val.titletype === '0') {
      if (val.answerB == undefined) {
        wx.showModal({
          title: '提示',
          content: '选择题至少要有两个答案选项',
        })
      } else if (val.answerA == '' || val.answerB == '' || val.answerC == '' || val.answerD == '') {
        wx.showModal({
          title: '提示',
          content: '有答案选项是空白',
        })
      } else if (val.selectanswer == '') {
        wx.showModal({
          title: '提示',
          content: '未选择正确答案选项',
        })
      }else{
        let selectanswers = []
        selectanswers.push('A、' + val.answerA)
        selectanswers.push('B、' + val.answerB)
        if (val.answerC) {
          selectanswers.push('C、' + val.answerC)
        }
        if (val.answerD) {
          selectanswers.push('D、' + val.answerD)
        }
        selectanswers=selectanswers.join(',')
        console.log(selectanswers)
        let data = {
          titletype: val.titletype,
          worktype: this.data.typelist.nameType[val.worktype].id,
          title: val.title,
          selectanswers: selectanswers,
          selectanswer: val.selectanswer,
          openid: wx.getStorageSync('openId')
        }
        console.log(data)
        app.questUrl('jeecg-boot/wechat/question/addQuestionByWorker','post',data).then((res)=>{
          console.log(res)
          if(res.data.success){
            wx.showToast({
              title: res.data.message
            })
            that.setData({
              worktxt: '请选择题目所属工种',
              titletxt: '请选择题目类型',  
              worktypevalue: '',//工种picker的value
              titletypevalue: '',//题目类型picker的value
              selectanswervalue: '',//选择题答案picker的value   
              contentvalue:'',
              answervalue: '',
              answerA:'',
              answerB:'',
              answerC:'',
              answerD:'',
              selectanswer: '',//选择题答案初始显示
              currenttitleNumber: 0,//题目处显示的字数为0
              currentanswerNumber: 0//填空题答案处显示的字数为0
            })
          }else{
            wx.showToast({
              title: res.data.message,
              icon:'none'
            })
          }
        })
      }
       // 当是填空题时答案和上传请求接口的处理
    } else if (val.titletype === '1') {
      if (val.fillanswer == '') {
        wx.showModal({
          title: '提示',
          content: '未输入正确答案',
        })
      } else {
        let data = {
          titletype: val.titletype,
          worktype: this.data.typelist.nameType[val.worktype].id,
          title: val.title,
          fillanswer: val.fillanswer
        }
        console.log(data)
        app.questUrl('jeecg-boot/wechat/question/addQuestionByWorker', 'post', data).then((res) => {
          console.log(res)
          if (res.data.success) {
            wx.showToast({
              title: res.data.message
            })
            that.setData({
              worktxt: '请选择题目所属工种',
              titletxt: '请选择题目类型', 
              worktypevalue:'',//工种picker的value
              titletypevalue: '',//题目类型picker的value
              selectanswervalue: '',//选择题答案picker的value
              answervalue: '',
              contentvalue: '',
              answerA: '',
              answerB: '',
              answerC: '',
              answerD: '',
              selectanswer: '',//选择题答案初始显示 
              currenttitleNumber: 0,//题目处显示的字数为0 
              currentanswerNumber: 0//填空题答案处显示的字数为0            
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        })
      }    
    }
  },
  //取消上传
  formReset(){
    wx.showModal({
      title: '提示',
      content: '是否确认取消上传',
      success(res){
        console.log(res)
        if(res.confirm){
          wx.navigateBack({
            delta:1
          })
        }
      }
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