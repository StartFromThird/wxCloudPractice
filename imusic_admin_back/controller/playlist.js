const Router = require("koa-router");
const router = new Router();
const rp = require('request-promise')
const getAccessToken = require("../utils/getAccessToken.js");
const ENV = "test-a6c0fc";

router.get("/list", async (ctx, next) => {
  const FUNCTION_NAME = 'music'
  const ACCESS_TOKEN = await getAccessToken();
  const url = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${ACCESS_TOKEN}&env=${ENV}&name=${FUNCTION_NAME}`;
  const query = ctx.request.query
  var options = {
    method: "POST",
    uri: url,
    body: {
      $url: 'playlist',
      start: parseInt(query.start),
      count: parseInt(query.count)
    },
    json: true
  }
  ctx.body = await rp(options)
    .then((res) => {
      return {
        data: JSON.parse(res.resp_data).data,
        code: 20000
      }
    })
    .catch((err) => {
      return err
    });
});
module.exports = router;
