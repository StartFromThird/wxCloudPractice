// miniprogram/pages/player/player.js
// 背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgImgUrl: '',
    isPlay: false,
    index: 0,
    musiclist: [],
    musiclistLen: 0
  },
  // 歌曲音频地址
  getMusicSource (id) {
    return new Promise((res, rej) => {
      wx.showLoading({
        title: '歌曲加载中',
      })
      wx.cloud.callFunction({
        name: 'music',
        data: {
          '$url': 'musicSource',
          'id': id
        }
      }).then((r) => {
        wx.hideLoading()
        if (r.result && r.result.data && r.result.data.length > 0) {
          let source = r.result.data[0].url
          res(source)
        } else {
          res(false)
        }
      })
    })
  },
  // 播放音频
  playMusic (source, info) {
    if (source) {
      backgroundAudioManager.src = source
      backgroundAudioManager.title = info.name
      backgroundAudioManager.coverImgUrl = info.al.picUrl
      backgroundAudioManager.singer = info.ar[0].name
      backgroundAudioManager.epname = info.al.name
      this.setData({
        'bgImgUrl': info.al.picUrl,
        'isPlay': true
      })
    } else {
      wx.showToast({
        title: '暂无权限播放',
      })
    }
    
  },
  // 底部控制 暂停 播放
  togglePlay () {
    let isP = this.data.isPlay
    this.setData({
      'isPlay': !isP,
    })
    isP ? backgroundAudioManager.pause() : backgroundAudioManager.play() 
  },
  // 列表下一首
  async playNext () {
    let len = this.data.musiclistLen
    if (this.data.index === (len - 1)) {
      wx.showToast({
        title: '已经是最后一首了',
        icon: 'none',
      })
    } else {
      backgroundAudioManager.pause()
      let index = parseInt(this.data.index) + 1
      this.setData({
        index
      })
      let list = this.data.musiclist
      let info = list[index]
      let source = await this.getMusicSource(list[index].id)
      this.playMusic (source, info)
    }
  },
  // 列表上一首
  async playPrevious () {
    if (this.data.index == 0) {
      wx.showToast({
        title: '已经是第一首了',
        icon: 'none',
      })
    } else {
      backgroundAudioManager.pause()
      let index = parseInt(this.data.index) - 1
      this.setData({
        index
      })
      let list = this.data.musiclist
      let info = list[index]
      let source = await this.getMusicSource(list[index].id)
      this.playMusic (source, info)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 歌单附带歌曲信息
    const index = options.index
    const musiclist = wx.getStorageSync('musiclist')
    const musiclistLen = wx.getStorageSync('musiclist').length
    this.setData({
      index,
      musiclist,
      musiclistLen,
    })
    const curMusic = musiclist[index]
    // 歌曲音频地址
    const id = options.musicId
    let source = await this.getMusicSource(id)
    this.playMusic(source, curMusic)
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
