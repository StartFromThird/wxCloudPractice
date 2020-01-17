// components/blog-card/blog-card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object
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
    onPreviewImage(e) {
      wx.previewImage({
        urls: this.properties.blog.img,
        current: e.currentTarget.dataset.imgsrc
      })
    }
  }
})
