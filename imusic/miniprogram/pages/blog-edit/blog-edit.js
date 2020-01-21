// miniprogram/pages/blog-edit/blog-edit.js
const MAX_WORDS_NUM = 140
let userInfo = {}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    blogWordsTip: '',
    footerBottom: 0,
    images: [],
    blogWords: '',
    maxImagesNum: 9,
  },
  // 发布动态
  send() {
    let w = this.data.blogWords
    if (w.trim() === '') {
      wx.showModal({
        title: '文字内容不得为空',
        content: '',
      })
      return
    }
    let imgsPromiseArr = []
    // 上传图片
    let arr = this.data.images
    arr.forEach((v, i) => {
      let p = new Promise((res, rej) => {
        let suffix = /\.\w+$/.exec(v)[0]
        // console.log("后缀", suffix)
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + parseInt(Math.random() * 10e6) + suffix,
          filePath: v,
          success: (r) => {
            console.log("上传成功", r)
            if (r.statusCode === 200) {
              res(r.fileID)  
            } else {
              res('')
            }
          },
          fail: (e) => {
            rej(e)
          }
        })
      })
      imgsPromiseArr.push(p)
    })
    // 依据图片返回id 存入blog数据库 collection 操作不在云函数？？
    Promise.all(imgsPromiseArr)
      .then(res => {
        let db = wx.cloud.database()
        db.collection('blog').add({
          data: {
            userInfo,
            content: this.data.blogWords,
            img: res,
            createTime: db.serverDate(),
          }
        }).then(res => {
          // console.log("存整个数据", res)
          if (res.errMsg === "collection.add:ok") {
            wx.showToast({
              title: '发布成功',
              icon: 'none'
            })
            wx.navigateBack()
            this.prevPageReload()
          } else {
            wx.showToast({
              title: '发布失败',
            })
          }
        })
      })
  },
  prevPageReload() {
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    prevPage.onPullDownRefresh()
  },
  // 点击图片预览
  onPreviewImage(e) {
    let i = e.currentTarget.dataset.img
    wx.previewImage({
      urls: this.data.images,
      current: i,
    })
  },
  // 删除已选图片
  onDelImage(e) {
    let i = e.currentTarget.dataset.index
    this.data.images.splice(i, 1)
    this.setData({
      'images': this.data.images
    })
  },
  // 选择图片
  onChooseImage() {
    let imgs = this.data.images
    wx.chooseImage({
      count: this.data.maxImagesNum - imgs.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // console.log("选择图片", res)
        this.setData({
          images: imgs.concat(res.tempFilePaths)
        })
      },
    })
  },
  // 字数提示
  onInput(e) {
    let w = e.detail.value
    let n = e.detail.value.length
    if (n >= MAX_WORDS_NUM) {
      n = `最多输入${MAX_WORDS_NUM}字`
    } else {
      n = `已输入${n}字`
    }
    this.setData({
      'blogWordsTip': n,
      'blogWords': w
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
    userInfo = options
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