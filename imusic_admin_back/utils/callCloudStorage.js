const getAccessToken = require("../utils/getAccessToken.js");
const rp = require("request-promise");
const callCloudStorage = {
  async download(ctx, file_list) {
    const ACCESS_TOKEN = await getAccessToken();
    const ST_FN_NAME = "batchdownloadfile";
    const url = `https://api.weixin.qq.com/tcb/${ST_FN_NAME}?access_token=${ACCESS_TOKEN}`;
    const options = {
      method: "POST",
      uri: url,
      body: {
        env: ctx.state.env,
        file_list
      },
      json: true
    };
    return await rp(options)
      .then(res => {
        return res;
      })
      .catch(err => {
        return err;
      });
  },
  async delete(ctx, fileid_list) {
    const ACCESS_TOKEN = await getAccessToken();
    const url = `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${ACCESS_TOKEN}`
    const options = {
      method: "POST",
      uri: url,
      body: {
        env: ctx.state.env,
        fileid_list
      },
      json: true
    };
    return await rp(options)
      .then(res => {
        return res;
      })
      .catch(err => {
        return err;
      });
  }
};

module.exports = callCloudStorage;
