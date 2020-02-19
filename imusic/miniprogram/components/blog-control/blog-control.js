// components/blog-control/blog-control.js
let userInfo = {};
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object
  },
  externalClasses: ["iconfont", "iconcomment", "iconshare"],
  /**
   * 组件的初始数据
   */
  data: {
    isLoginModalHidden: true,
    isComModalHidden: true,
    comment: "",
    footerBottom: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onFocus(event) {
      if (event.detail.height > 60) {
        this.setData({
          footerBottom: event.detail.height - 194
        });
      }
    },
    onBlur() {
      this.setData({
        footerBottom: 0
      });
    },
    onSend(e) {
      // console.log(e)
      // this.data.comment 不会跟着变
      let content = e.detail.value.content;
      if (content.trim() == "") {
        wx.showModal({
          title: "评论内容不能为空",
          content: ""
        });
        return false;
      }
      wx.showLoading({
        title: "评论中",
        mask: true
      });
      const db = wx.cloud.database();
      db.collection("blog-comment")
        .add({
          data: {
            content,
            createTime: db.serverDate(),
            blogId: this.data.blog._id,
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl
          }
        })
        .then(res => {
          wx.hideLoading();
          wx.showToast({
            title: "评论成功"
          });
          this.setData({
            isComModalHidden: true,
            comment: ""
          });
          this.triggerEvent("refreshComList");
        })
        .then(() => {
          // 调用订阅模板
          wx.cloud
            .callFunction({
              name: "sendmsg",
              data: {
                blogId: this.data.blog._id,
                openId: this.data.blog._openid,
                content
              }
            })
            .then(res1 => {
              console.log("调模板返回值", res1);
              if (res1.result.errCode === 0) {
                wx.showToast({
                  title: "评论已通知"
                });
              }
            });
        });
    },
    loginfail() {
      wx.showModal({
        title: "授权用户才能进行评价",
        content: ""
      });
    },
    loginsuccess(e) {
      userInfo = e.detail;
      this.setData(
        {
          isLoginModalHidden: true
        },
        () => {
          this.setData({
            isComModalHidden: false
          });
        }
      );
    },
    // 确定有授权后评论
    onComment() {
      wx.getSetting({
        success: res => {
          if (res.authSetting["scope.userInfo"]) {
            wx.getUserInfo({
              success: res => {
                userInfo = res.userInfo;
                this.setData({
                  isComModalHidden: false
                });
              }
            });
          } else {
            console.log("没授权");
            this.setData({
              isLoginModalHidden: false
            });
          }
        }
      });
    }
  }
});
