// miniprogram/pages/musiclist.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    coverImgUrl: '',
    tracks: [],
  },
  getPlaylistDetail(id) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        'id': id,
        '$url': 'playlistDetail'
      }
    }).then((res) => {
      wx.hideLoading()
      // console.log("歌单详情", res)
      const plDetail = res.result.playlist
      this.setData({
        name: plDetail.name,
        coverImgUrl: plDetail.coverImgUrl,
        tracks: plDetail.tracks
      })
      this.setStorage('musiclist', plDetail.tracks)
    })
  },
  setStorage(key, data) {
    wx.setStorageSync(key, data)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.playlistId) {
      this.getPlaylistDetail(options.playlistId)
    }
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