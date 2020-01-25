const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router')
const router = new Router()

const playlist = require('./controller/playlist.js')
router.use('/playlist', playlist.routes())

app.use(router.routes())
app.use(router.allowedMethods())

app.use(async (ctx, next)=>{
  console.log('全局中间件')
  ctx.body = 'Hello Wolrd'
  // ctx.state.env = ENV
  // await next()
})

app.listen(3000, ()=>{
  console.log('http://localhost:3000/list')
}); 