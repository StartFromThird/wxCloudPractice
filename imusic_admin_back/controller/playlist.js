const Router = require("koa-router");
const router = new Router();
const rp = require('request-promise')
const getAccessToken = require("../utils/getAccessToken.js");
const ENV = "test-a6c0fc";

router.get("/list", async (ctx, next) => {
  const FUNCTION_NAME = 'music'
  const ACCESS_TOKEN = await getAccessToken();
  const url = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${ACCESS_TOKEN}&env=${ENV}&name=${FUNCTION_NAME}`;
  var options = {
    method: "POST",
    uri: url,
    body: {
      $url: 'playlist',
      start: 0,
      count: 50
    },
    json: true
  }
  ctx.body = await rp(options)
    .then((res) => {
      return res.resp_data
    })
    .catch((err) => {
      return err
    });
});
module.exports = router;
