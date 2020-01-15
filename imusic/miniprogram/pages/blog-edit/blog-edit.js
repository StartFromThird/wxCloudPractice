// miniprogram/pages/blog-edit/blog-edit.js
const MAX_WORDS_NUM = 140
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogWordsTip: 0,
    footerBottom: 0
  },
  // 字数提示
  onInput(e) {
    let n = e.detail.value.length
    if (n >= MAX_WORDS_NUM) {
      n = `最多输入${MAX_WORDS_NUM}字`
    } else {
      n = `已输入${n}字`
    }
    this.setData({
      'blogWordsTip': n
    })
  },
  // 底部发布按钮位置
  onFocus(event) {
    this.setData({
      footerBottom: event.detail.height,
    })
  },
  onBlur() {
    this.setData({
      footerBottom: 0,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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