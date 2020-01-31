const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router')
const router = new Router()

// 跨域
const cors = require('koa2-cors');
app.use(cors({
  origin: ['http://localhost:9528'],
  credentials: true,
}));

// 全局用环境参数
const ENV = "test-a6c0fc";
app.use(async (ctx, next)=>{
  ctx.state.env = ENV
  await next()
})

// post参数
const koaBody = require('koa-body')
app.use(koaBody({
  multipart: true,
}))

const playlist = require('./controller/playlist.js')
const swiper = require('./controller/swiper.js')
const blog = require('./controller/blog.js')
router.use('/playlist', playlist.routes())
router.use('/swiper', swiper.routes())
router.use('/blog', blog.routes())

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, ()=>{
  console.log('http://localhost:3000')
});