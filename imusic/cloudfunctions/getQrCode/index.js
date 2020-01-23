// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数   
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const result = await cloud.openapi.wxacode.getUnlimited({
    scene: wxContext.OPENID,
    // 默认首页
    // page: "pages/music/music"
  })
  // 二进制存储为图片返回id
  const upload = await cloud.uploadFile({
    cloudPath: 'qrcode/' + Date.now() + '-' + Math.random() + '.png',
    fileContent: result.buffer
  })
  return upload.fileID
}