const Router = require("koa-router");
const router = new Router();
const callCloudFn = require("../utils/callCloudFn.js");
const callCloudDB = require('../utils/callCloudDB.js')

router.get("/list", async (ctx, next) => {
  const FUNCTION_NAME = 'music'
  const query = ctx.request.query
  const params =  {
    $url: 'playlist',
    start: parseInt(query.start),
    count: parseInt(query.count)
  }
  ctx.body = await callCloudFn(ctx, FUNCTION_NAME, params)
    .then((res) => {
      return {
        data: JSON.parse(res.resp_data).data,
        code: 20000
      }
    })
    .catch((err) => {
      console.log(err)
      return err
    });
});
router.get("/del", async (ctx, next) => {
  const DB_FN_NAME = 'databasedelete'
  const query = ctx.request.query
  const sql_query =  `db.collection('playlist').doc('${query.id}').remove()`
  ctx.body = await callCloudDB(ctx, DB_FN_NAME, sql_query)
    .then((res) => {
      return {
        data: res,
        code: 20000
      }
    })
    .catch((err) => {
      return err
    });
});
router.post("/update", async (ctx, next) => {
  const DB_FN_NAME = 'databaseupdate'
  const params = ctx.request.body
  const sql_query =  `
    db.collection('playlist').doc('${params._id}')
      .update({
        data: {
          name: '${params.name}',
          copywrite: '${params.copywriter}',
        }
      })`
  ctx.body = await callCloudDB(ctx, DB_FN_NAME, sql_query)
    .then((res) => {
      return {
        data: res,
        code: 20000
      }
    })
    .catch((err) => {
      return err
    });
});
module.exports = router;
