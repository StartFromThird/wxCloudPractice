// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
// const rp = require('request-promise')
cloud.init()
const db = cloud.database()
// 获取wx数据库所有列表数据
const MAX_LIMIT = 100
const getAllCollectionList = async (collectionName, wo) => {
  const collection = db.collection(collectionName)
  const batchTimes = await collection.count().then((res) => {
    return Math.ceil(res.total / MAX_LIMIT)
  }).catch((err) => {
    return 0
  })
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = collection.skip(i * MAX_LIMIT)
                      .limit(MAX_LIMIT)
                      .where(wo)
                      .orderBy('createTime', 'desc')
                      .get()  
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event });
  const wxContext = cloud.getWXContext()
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
  app.router('detail', async (ctx, next) => {
    const blogId = event.blogId
    // blog 数据
    let detail = await db.collection('blog')
      .where({
        _id: blogId
      })
      .get()
      .then((res) => {
        return res
      })
    // 查 blog 评论数据
    let o = { blogId }
    const commentList = (await getAllCollectionList('blog-comment', o)).data
    ctx.body = {
      detail,
      commentList
    }
  })
  app.router('getListByOpenid', async (ctx, next) => {
    ctx.body = await db.collection('blog').where({
      _openid: wxContext.OPENID
    }).skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res
      })
  })
  return app.serve()
}