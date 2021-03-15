const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const jwtKoa = require("koa-jwt");
var cors = require("koa2-cors");
const { secret } = require("./config/token");

const users = require("./routes/users");
const upload = require("./routes/upload");

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(cors());
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "ejs",
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

/* 当token验证异常时候的处理，如token过期、token错误 */
app.use((ctx, next) => {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        msg: "未登录认证",
      };
    } else {
      throw err;
    }
  });
});
// 登录状态校验
app.use(
  jwtKoa({ secret: secret }).unless({
    // 以下接口不需要认证访问
    path: [
      /\/login/,
      /\/register/,
      /\/upload\/(image)/,
      /\/room\/(list|query)/,
    ],
  })
);

// routes
app.use(users.routes(), users.allowedMethods());
app.use(upload.routes(), upload.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
