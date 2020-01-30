const Router = require("koa-router");
const router = new Router();
const callCloudDB = require("../utils/callCloudDB.js");
const cloudStorage = require("../utils/callCloudStorage.js");

router.get("/list", async (ctx, next) => {
  // swiper DB 取fileid
  const DB_FN_NAME = "databasequery";
  const sql_query = `db.collection('swiper').get()`;
  const res = await callCloudDB(ctx, DB_FN_NAME, sql_query);
  // 依据 fileid 取 download url
  let file_list = [];
  res.data.forEach(ele => {
    file_list.push({
      fileid: JSON.parse(ele).file_id,
      max_age: 7200
    });
  });
  const dlURL = await cloudStorage.download(ctx, file_list);
  let swiper_list = [];
  if (dlURL.errcode === 0 && dlURL.file_list.length > 0) {
    dlURL.file_list.forEach((ele, i) => {
      swiper_list.push({
        file_id: ele.fileid,
        download_url: ele.download_url,
        _id: JSON.parse(res.data[i])._id
      });
    });
  }
  ctx.body = {
    data: swiper_list,
    code: 20000
  };
});

router.get("/del", async (ctx, next) => {
  const query = ctx.request.query
  // 数据库 删除记录
  const DB_FN_NAME = 'databasedelete'
  const sql_query =  `db.collection('swiper').doc('${query._id}').remove()`
  const delDB = await callCloudDB(ctx, DB_FN_NAME, sql_query)
                  .then((res) => {
                    return res
                  })
                  .catch((err) => {
                    return err
                  });
  // 存储 删文件 
  const delST = await cloudStorage.delete(ctx, [query.file_id])
                  .then(res => {
                    return res
                  }).catch((err) => {
                    return err
                  });
  ctx.body = {
    code: 20000,
    data: {
      delDB,
      delST
    }
  }

})

router.post("/upload", async(ctx, next) => {
  // 上传文件
  const fileid = await cloudStorage.upload(ctx);
  // 存入数据库
  const query = `
    db.collection('swiper').add({
        data: {
            file_id: '${fileid}'
        }
    })`
  const res = await callCloudDB(ctx, 'databaseadd', query)
  ctx.body = {
    code: 20000,
    id_list: res.id_list
  }
})
module.exports = router;
