const Router = require("koa-router");
const router = new Router();
const callCloudDB = require("../utils/callCloudDB.js");
const cloudStorage = require("../utils/callCloudStorage.js");

router.get("/list", async (ctx, next) => {
  // swiper DB 取fileid
  const query = ctx.request.query
  const DB_FN_NAME = "databasequery";
  const sql_query = `db.collection('blog').skip(${query.start}).limit(${query.count}).orderBy('createTime', 'desc').get()`;
  const res = await callCloudDB(ctx, DB_FN_NAME, sql_query);
  let list = []
  if (res.data && res.data.length > 0) {
    res.data.forEach(ele => {
      list.push(JSON.parse(ele))
    });
  }
  ctx.body = {
    data: list,
    code: 20000
  };
});

router.post("/del", async (ctx, next) => {
  const query = ctx.request.body
  // 数据库 删除博客记录
  const DB_FN_NAME = 'databasedelete'
  const sql_query =  `db.collection('blog').doc('${query._id}').remove()`
  const delDB = await callCloudDB(ctx, DB_FN_NAME, sql_query)
                  .then((res) => {
                    return res
                  })
                  .catch((err) => {
                    return err
                  });
  // 数据库 删除评论记录
  const sql_query_com =  `db.collection('blog-comment').where({blogId: '${query._id}'}).remove()`
  const delDB_com = await callCloudDB(ctx, DB_FN_NAME, sql_query_com)
                  .then((res) => {
                    return res
                  })
                  .catch((err) => {
                    return err
                  });
  // 存储 删文件 
  let delST = []
  if (query.img && query.img.length > 0) {
    delST = await cloudStorage.delete(ctx, query.img)
                  .then(res => {
                    return res
                  }).catch((err) => {
                    return err
                  });
  }
  ctx.body = {
    code: 20000,
    data: {
      delDB,
      delDB_com,
      delST
    }
  }

})
module.exports = router;
