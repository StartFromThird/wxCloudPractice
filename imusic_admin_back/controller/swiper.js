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
      fileid: JSON.parse(ele).fieldId,
      max_age: 7200
    });
  });
  const dlURL = await cloudStorage.download(ctx, file_list);
  let swiper_list = [];
  if (dlURL.errcode === 0 && dlURL.file_list.length > 0) {
    dlURL.file_list.forEach((ele, i) => {
      swiper_list.push({
        fileid: ele.fileid,
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
module.exports = router;
