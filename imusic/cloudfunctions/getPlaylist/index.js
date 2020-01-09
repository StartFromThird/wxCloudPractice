// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');
const URL = 'http://musicapi.xiecheng.live/personalized'
cloud.init()
const db = cloud.database()
const playlistCollection = db.collection('playlist')

const addPlaylist = async (d) => {
  await playlistCollection.add({
    data: {
      ...d,
      createTime: db.serverDate(),
    }
  }).then((res) => {
    console.log('插入成功')
  }).catch((err) => {
    console.error('插入失败')
  })
}
// 云函数入口函数
exports.main = async (event, context) => {
  const playlist = await rp(URL).then((res) => {
    return JSON.parse(res).result
  });
  // playlist.map((ele) => {
  //   await addPlaylist(ele)
  // });
  for (let i = 0, len = playlist.length; i < len; i++) {
    await addPlaylist(playlist[i])
  }
}
