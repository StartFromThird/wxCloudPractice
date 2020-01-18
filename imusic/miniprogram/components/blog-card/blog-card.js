// components/blog-card/blog-card.js
import formatTime from '../../utils/formatTime.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object
  },
  observers: {
    ['blog.createTime'](n) {
      if (n) {
        this.setData({
          'createTime': formatTime(new Date(n))
        })
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    createTime: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPreviewImage(e) {
      wx.previewImage({
        urls: this.properties.blog.img,
        current: e.currentTarget.dataset.imgsrc
      })
    }
  }
})
