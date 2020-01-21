// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isModalHidden: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindGetUserInfo(e) {
      let approve = e.detail.userInfo
      if (approve) {
        this.setData({
          isModalHidden: true
        })
        this.triggerEvent('loginsuccess', e.detail.userInfo)
      } else {
        this.triggerEvent('loginfail')
        console.log("不要")
      }
    }
  }
})
