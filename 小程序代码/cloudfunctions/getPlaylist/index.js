// 云函数入口文件
const cloud = require('wx-server-sdk')



cloud.init()

const db = cloud.database()

const rp = require('request-promise')
const URL = 'http://musicapi.xiecheng.live/personalized'
// 云函数入口函数

const playlistCollection = db.collection('playlist')

const MAX_LIMIT = 100

exports.main = async (event, context) => {
  //const list = await playlistCollection.get()

  const countResult = await playlistCollection.count();
  const total = countResult.total

  const batcjTimes = Math.ceil(total/MAX_LIMIT)
  const tasks = [];
  for (let i = 0;i< batchTimes;i++) {
   let promise =  playlistCollection.skip(i*MAX_LIMIT).limit(MAX_LIMIT).get()
    task.push(promise)
  }

let list = {
  data:[]
}
if(task.lenght>0) {
  (await Promise.all(task)).reduce((acc,cur) => {
    return {
      data: acc.data.concat(cur.data)
    }
  })
}


  const playlist = await rp(URL).then((res) => {
    return JSON.parse(res).result
  })
  const newData = []
  for(let i = 0, len1 = playlist.length;i<len1;i++) {
    let flag = true
    for(let j = 0,len2 = list.data.length;i<len2;j++) {
      if(playlist[i].id === list.data[j].id) {
        flag = false;
        break
      }
    }
    if(flag) {
      newData.push(playlist[i])
    }
  }

  for(let i =0 , len = newData.length;i<len;i++) {
    await playlistCollection.add({
      data: {
        ...newData[i],
        createTime: db.serverDate(),

      }
    }).then((res) => {
      console.log('插入成功')
    }).catch((err)=>{
      console.error('插入失败')
    })
  }
  
  return newData.length
}