// components/musiclist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeId: -1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    musiclistSelect (e) {
      let id = e.currentTarget.dataset.activeid
      let index = e.currentTarget.dataset.activeindex
      this.setData({
        activeId: id
      })
      wx.navigateTo({
        url: `/pages/player/player?musicId=${id}&index=${index}`,
      })
    }
  }
})
