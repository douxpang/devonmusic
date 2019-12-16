// 云函数入口文件
const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const app = new TcbRouter({event})

    app.use(async(ctx,next) => {
      console.log('进入全局中间件')
      ctx.data = {}
      ctx.data.openId = event.userInfo.openId
      await next()
      console.log('退出全局中间件')
    })

    app.router('music',async(ctx,next) => {
      console.log('进入音乐名称中间件')
      ctx.data.musicName = '数鸭子'
      await next()
      console.log('退出音乐名称中间件')
    }, async (ctx, next) => {
      ctx.data.musicType = '二哥'
      ctx.body = {
        data: ctx.data
      }
    })

  app.router('movie', async (ctx, next) => {
    ctx.data.musicName = '千与千寻'
    await next()
  }, async (ctx, next) => {
    ctx.data.musicType = '电影动漫'
    ctx.body = {
      data: ctx.data
    }
  })


    return app.serve()

}