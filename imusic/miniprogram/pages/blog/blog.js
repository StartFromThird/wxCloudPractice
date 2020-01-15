// pages/blog/blog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isModalHidden: true,
  },
  loginsuccess(d) {
    // console.log("授权数据", d)
    wx.navigateTo({
      url: `/pages/blog-edit/blog-edit?nickName=${d.nickName}&avatarUrl=${d.avatarUrl}`
    })
  },
  loginfail(e) {
    wx.showModal({
      title: '授权用户才能发布信息',
      content: '',
    })
  },
  newBlog() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              console.log("已给信息", res)
              let o = {
                'nickName': res.rawData.nickName,
                'avatarUrl': res.rawData.avatarUrl
              }
              this.loginsuccess(o)
            }
          })
        } else {
          console.log('没授权')
          this.setData({
            isModalHidden: false
          })
        }
      }
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