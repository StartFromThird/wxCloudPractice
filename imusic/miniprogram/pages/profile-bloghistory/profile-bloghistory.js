// pages/profile-bloghistory/profile-bloghistory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isModalHidden: true,
    blogList: [],
    isTipHidden: true
  },
  goComment(e) {
    let id = e.target.dataset.blogid
    wx.navigateTo({
      url: '/pages/blog-comment/blog-comment?id=' + id,
    })
  },
  getBlogList(start = 0) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'getListByOpenid',
        start,
        count: 10,
      }
    }).then((res) => {
      wx.hideLoading()
      if (res.result.errMsg === "collection.get:ok" && res.result.data) {
        if (res.result.data.length) {
          this.setData({
            blogList: this.data.blogList.concat(res.result.data),
            isTipHidden: true
          })
        } else {
          this.setData({
            isTipHidden: false
          })
        }
        wx.stopPullDownRefresh()
      }
    }).catch(() => {
      wx.hideLoading()
    })
  },
  loginsuccess(d) {
    // 外部传来 要d.detail
    wx.navigateTo({
      url: `/pages/blog-edit/blog-edit?nickName=${d.detail.nickName}&avatarUrl=${d.detail.avatarUrl}`
    })
  },
  loginfail(e) {
    wx.showModal({
      title: '授权用户才能发布信息',
      content: '',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBlogList(0)
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
    this.setData({
      blogList: [],
      isTipHidden: true
    })
    this.getBlogList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})