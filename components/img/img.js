// component/img/img.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: String,
    mode: String,
    lazy: Boolean,
    default: String,
    defaultColor:String,
    defaultWidth: String,
    defaultHeight: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    showDefault: true,
 
    dColor: "f4f4f4"

  },
  methods: {
    load: function(e) {
      // console.log(e)
      this.setData({
        showDefault: false
      })
      console.log(e,'load')
      this.triggerEvent('onloaded', e, e)
    },
    error: function(e) {
      console.log(e,'error')
      this.setData({
        showDefault: true
      })
      console.log(this.data.showDefault)
    },
  },

})