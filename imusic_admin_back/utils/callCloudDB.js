const getAccessToken = require("../utils/getAccessToken.js")
const rp = require('request-promise')
const callCloudDB = async(ctx, DB_FN_NAME, query) => {
  const ACCESS_TOKEN = await getAccessToken();
  const url = `https://api.weixin.qq.com/tcb/${DB_FN_NAME}?access_token=${ACCESS_TOKEN}`;
  const options = {
    method: "POST",
    uri: url,
    body: {
      "query": query,
      "env": ctx.state.env,
    },
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
module.exports = callCloudDB