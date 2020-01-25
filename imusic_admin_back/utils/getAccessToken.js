const rp = require('request-promise')
const fs = require('fs')
const path = require('path')
const fileName = path.resolve(__dirname, './access_token.js')

const wxAppNum = require('./wxapp.js')
const {APPID, APPSECRET} = wxAppNum
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`

// wx token获取并存储
const updateAccessToken = async () => {
  const resStr = await rp(URL)
  const res = JSON.parse(resStr)
  if (res.access_token) {
    let writeInObj = {
      access_token: res.access_token,
      createTime: new Date()
    }
    fs.writeFileSync(fileName, JSON.stringify(writeInObj))
  } else {
    console.log("写入失败")
    await updateAccessToken()
  }
}
updateAccessToken()
// 本地取token, 如果过期了更新本地再取
const getAccessToken = async () => {
  try {
    const recordObj = JSON.parse(fs.readFileSync(fileName, 'utf8'))
    const recordTime = new Date(recordObj.createTime).getTime()
    const nowTime = new Date().getTime()
    if ((nowTime - recordTime < 60 * 60 * 2 * 1000) && (nowTime - recordTime > 0)) {
      return recordObj.access_token
    } else {
      console.log("查token")
      await updateAccessToken()
      await getAccessToken()  
    }
  } catch (error) {
    console.log(error)
    await updateAccessToken()
    await getAccessToken()
  }
}

// setInterval(async () => {
//   await updateAccessToken()
// }, 7000 * 1000)
module.exports = getAccessToken