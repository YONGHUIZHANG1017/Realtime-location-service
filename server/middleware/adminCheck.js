const { getJWTPayload } = require("../config/token");

module.exports = async function adminCheck(ctx, next) {
  const { authorization } = ctx.request.header;
  const payload = getJWTPayload(authorization);
  const { role } = payload;
  if (role !== "admin") {
    return (ctx.body = {
      code: 401,
      msg: "无权限",
    });
  }
  await next();
};
