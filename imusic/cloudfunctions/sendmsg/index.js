// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openId,
      page: `pages/blog-comment/blog-comment?blogId=${event.blogId}`,
      lang: "zh_CN",
      data: {
        thing1: {
          value: `★`
        },
        thing2: {
          value: event.content
        }
      },
      templateId: "Ov95BhBF_DNqTvxvaMteoX084JmRks5fZnQFRmEZ2Jw"
      // miniprogramState: "developer"
    });
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};
