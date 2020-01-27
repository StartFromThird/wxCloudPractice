const getAccessToken = require("../utils/getAccessToken.js")
const rp = require('request-promise')
const callCloudFn = async (ctx, FUNCTION_NAME, params) => {
  const ACCESS_TOKEN = await getAccessToken();
  const url = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${ACCESS_TOKEN}&env=${ctx.state.env}&name=${FUNCTION_NAME}`;
  const query = ctx.request.query
  var options = {
    method: "POST",
    uri: url,
    body: params,
    json: true
  }
  return await rp(options)
    .then((res) => {
      return res
    })
    .catch((err) => {
      return err
    });
}
module.exports = callCloudFn