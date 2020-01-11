// components/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist: {
      type: Object
    },
  },
  // 监听
  observers: {
    ['playlist.playCount'](c) {
      this.setData({
        showCount: this.transformPlayCount(c)
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    showCount: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 数字转亿万
    transformPlayCount(c) {
      let pointLen = 2
      let cStr = c.toString().split('.')[0]
      let cLen = cStr.length
      if (cLen < 6) {
        return cStr
      } else if (cLen > 5 && cLen < 9) {
        let integer = parseInt(c / 10000)
        let decimal = cStr.substring(cStr.length - 4, cStr.length - 4 + pointLen)
        return `${integer}.${decimal}万`
      } else if (cLen > 8) {
        let integer = parseInt(c / 100000000)
        let decimal = cStr.substring(cStr.length - 8, cStr.length - 8 + pointLen)
        return `${integer}.${decimal}亿`
      }
    },
    toPlaylistDetail () {
      wx.navigateTo({
        url: `/pages/musiclist/musiclist?playlistId=${this.properties.playlist.id}`,
      })
    }
  }
})
