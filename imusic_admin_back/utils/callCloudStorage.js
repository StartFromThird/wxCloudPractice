const getAccessToken = require("../utils/getAccessToken.js");
const rp = require("request-promise");
const fs = require('fs')
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
    const url = `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${ACCESS_TOKEN}`;
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
  },
  async upload(ctx) {
    // 获取文件上传链接
    const ACCESS_TOKEN = await getAccessToken();
    const url = `https://api.weixin.qq.com/tcb/uploadfile?access_token=${ACCESS_TOKEN}`;
    const file = ctx.request.files.file;
    const path = `swiper/${Date.now()}-${Math.random()}-${file.name}`;
    const options = {
      method: "POST",
      uri: url,
      body: {
        env: ctx.state.env,
        path
      },
      json: true
    };
    const info = await rp(options)
      .then(res => {
        return res;
      })
      .catch(err => {
        return err;
      });
    // 文件上传
    const options1 = {
      method: "POST",
      uri: info.url,
      formData: {
        'key': path,
        'Signature': info.authorization,
        'x-cos-security-token': info.token,
        'x-cos-meta-fileid': info.cos_file_id,
        'file': fs.createReadStream(file.path)
      },
      headers: {
        'content-type': 'multipart/form-data'
      },
      json: true
    };
    await rp(options1)
      .then(res => {
        return res;
      })
      .catch(err => {
        console.log(err)
        return err;
      });
    return info.file_id
  }
};

module.exports = callCloudStorage;
