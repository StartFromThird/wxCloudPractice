// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');
const URL = 'http://musicapi.xiecheng.live/personalized'
const MAX_LIMIT = 100
cloud.init()
const db = cloud.database()
const playlistCollection = db.collection('playlist')

// 单个歌单存入
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
// 歌单数组存入
const addPlaylistArr = async (arr) => {
  for (let i = 0, len = arr.length; i < len; i++) {
    await addPlaylist(arr[i])
  }
}
// 获取wx数据库所有列表数据
const getAllCollectionList = async (collectionName) => {
  const collection = db.collection(collectionName)
  const batchTimes = await collection.count().then((res) => {
    return Math.ceil(res.total / MAX_LIMIT)
  }).catch((err) => {
    return 0
  })
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = collection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}
// 比较新n旧o数组，依据属性attrN选出新加数据
const getNewData = (o, n, attrN) => {
  let oAttrNArr = []
  let newData = []
  o.forEach(ele => {
    if (ele[attrN]) {
      oAttrNArr.push(ele[attrN])
    }
  })
  n.forEach(ele => {
    if (ele[attrN] && (oAttrNArr.indexOf(ele[attrN]) == -1)) {
      newData.push(ele)
    }
  })
  return newData
}
// 云函数入口函数
exports.main = async (event, context) => {
  // wx数据库所有数据
  const playlistCol_wx = (await getAllCollectionList('playlist')).data
  // 外部接口数据
  const playlistCol_url = await rp(URL).then((res) => {
    return JSON.parse(res).result
  });
  // 存入外部接口新增数据
  const newPlaylist = getNewData(playlistCol_wx, playlistCol_url, 'id')
  await addPlaylistArr(newPlaylist)
}
