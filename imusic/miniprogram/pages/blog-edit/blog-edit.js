// miniprogram/pages/blog-edit/blog-edit.js
const MAX_WORDS_NUM = 140;
let userInfo = {};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    blogWordsTip: "",
    footerBottom: 0,
    images: [],
    blogWords: "",
    maxImagesNum: 9
  },
  backBlog() {
    var timeOut = setTimeout(() => {
      wx.navigateBack();
      this.prevPageReload();
      clearTimeout(timeOut);
    }, 2000);
  },
  // 发布动态
  send() {
    let w = this.data.blogWords;
    if (w.trim() === "") {
      wx.showModal({
        title: "文字内容不得为空",
        content: ""
      });
      return;
    }
    let imgsPromiseArr = [];
    // 上传图片
    let arr = this.data.images;
    arr.forEach((v, i) => {
      let p = new Promise((res, rej) => {
        let suffix = /\.\w+$/.exec(v)[0];
        // console.log("后缀", suffix)
        wx.cloud.uploadFile({
          cloudPath:
            "blog/" +
            Date.now() +
            "-" +
            parseInt(Math.random() * 10e6) +
            suffix,
          filePath: v,
          success: r => {
            console.log("上传成功", r);
            if (r.statusCode === 200) {
              res(r.fileID);
            } else {
              res("");
            }
          },
          fail: e => {
            rej(e);
          }
        });
      });
      imgsPromiseArr.push(p);
    });
    // 依据图片返回id 存入blog数据库 collection 操作不在云函数？？
    Promise.all(imgsPromiseArr).then(res => {
      console.log("测试2");
      let db = wx.cloud.database();
      db.collection("blog")
        .add({
          data: {
            userInfo,
            content: this.data.blogWords,
            img: res,
            createTime: db.serverDate()
          }
        })
        .then(res => {
          // console.log("存整个数据", res)
          if (res.errMsg === "collection.add:ok") {
            console.log("测试3");
            wx.showToast({
              title: "发布成功",
              icon: "none"
            });
            wx.showModal({
              title: "订阅评论消息吗？",
              content: "",
              success: res => {
                if (res.confirm) {
                  this.setReminder();
                } else if (res.cancel) {
                  this.backBlog();
                }
              }
            });
          } else {
            wx.showToast({
              title: "发布失败"
            });
          }
        });
    });
  },
  // 引导用户手动开启订阅
  guideOpenSubscribeMessage() {
    wx.showModal({
      title: "检测到您没有开启订阅消息的权限，是否去设置？",
      content: "",
      success: res => {
        if (res.confirm) {
          // 用户确定，跳转设置页
          wx.openSetting({
            success: res => {
              this.guidSubscribeMessageAuthAfter();
            }
          });
        } else if (res.cancel) {
          wx.showToast({
            title: `您已拒绝订阅消息授权`,
            icon: "none"
          });
          this.backBlog();
        }
      }
    });
  },
  // 用户手动开订阅
  guidSubscribeMessageAuthAfter() {
    const tmplId = "Ov95BhBF_DNqTvxvaMteoX084JmRks5fZnQFRmEZ2Jw";
    wx.getSetting({
      withSubscriptions: true,
      success: res => {
        // console.log("引导用户2=====", res);
        let {
          authSetting = {},
          subscriptionsSetting: { mainSwitch = false, itemSettings = {} } = {}
        } = res;
        if (
          (authSetting["scope.subscribeMessage"] || mainSwitch) &&
          itemSettings[tmplId] === "accept"
        ) {
          wx.showToast({
            title: `您已订阅成功`
          });
          this.backBlog();
        } else {
          wx.showToast({
            title: `您已拒绝订阅消息授权`,
            icon: "none"
          });
          this.backBlog();
        }
      }
    });
  },
  // 订阅评论提醒授权
  setReminder() {
    const tmplId = "Ov95BhBF_DNqTvxvaMteoX084JmRks5fZnQFRmEZ2Jw";
    if (wx.requestSubscribeMessage) {
      console.log("请求模板授权");
      wx.requestSubscribeMessage({
        tmplIds: [tmplId],
        success: res => {
          console.log("模板授权", res);
          if (res[tmplId] === "accept") {
            wx.showToast({
              title: `您已订阅成功`
            });
            this.backBlog();
          } else if (res[tmplId] === "reject") {
            // 用户历史操作有设置了拒绝 or 关闭了订阅消息的主（总）开关，导致无法推送
            this.guideOpenSubscribeMessage();
          }
        },
        fail: res => {
          // 关闭了订阅主开关，提醒 setting 修改
          if (res.errCode == 20004) {
            this.guideOpenSubscribeMessage();
          }
        }
      });
    } else {
      wx.showToast({
        title: "请更新您微信版本，以获取订阅消息",
        icon: "none"
      });
    }
  },
  prevPageReload() {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    prevPage.onPullDownRefresh();
  },
  // 点击图片预览
  onPreviewImage(e) {
    let i = e.currentTarget.dataset.img;
    wx.previewImage({
      urls: this.data.images,
      current: i
    });
  },
  // 删除已选图片
  onDelImage(e) {
    let i = e.currentTarget.dataset.index;
    this.data.images.splice(i, 1);
    this.setData({
      images: this.data.images
    });
  },
  // 选择图片
  onChooseImage() {
    let imgs = this.data.images;
    wx.chooseImage({
      count: this.data.maxImagesNum - imgs.length,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: res => {
        // console.log("选择图片", res)
        this.setData({
          images: imgs.concat(res.tempFilePaths)
        });
      }
    });
  },
  // 字数提示
  onInput(e) {
    let w = e.detail.value;
    let n = e.detail.value.length;
    if (n >= MAX_WORDS_NUM) {
      n = `最多输入${MAX_WORDS_NUM}字`;
    } else {
      n = `已输入${n}字`;
    }
    this.setData({
      blogWordsTip: n,
      blogWords: w
    });
  },
  // 底部发布按钮位置
  onFocus(event) {
    this.setData({
      footerBottom: event.detail.height
    });
  },
  onBlur() {
    this.setData({
      footerBottom: 0
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    userInfo = options;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
