// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
// const rp = require('request-promise')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event });
  app.router('list', async (ctx, next) => {
    const k = event.keyword
    let kw = {}
    if (k.trim() != '') {
      kw = {
        content: new db.RegExp({
          regexp: k,
          options: 'i'
        })
      }
    }
    ctx.body = await db.collection('blog')
      .where(kw)
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res
      })
  })
  return app.serve()
}