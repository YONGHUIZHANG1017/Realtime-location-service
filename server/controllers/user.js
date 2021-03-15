const { Op } = require("sequelize");
const User = require("../models/users");
const { generateHash, vertify } = require("../config/bcrypt");
const { getToken, getJWTPayload } = require("../config/token");

// 注册
exports.register = async (ctx) => {
  let { email, password, name, sex, address } = ctx.request.body;
  try {
    const isRegister = await User.findOne({
      where: {
        email,
      },
    });

    if (isRegister) {
      return (ctx.body = {
        code: 400,
        msg: "该邮箱已注册",
      });
    }
    password = generateHash(password);
    await User.create({
      email,
      password,
      address,
      name,
      sex,
    });
    ctx.body = {
      code: 200,
      msg: "注册成功",
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      code: 500,
      msg: "注册失败",
    };
  }
};

// 登录
exports.login = async (ctx) => {
  const { email, password } = ctx.request.body;

  if (!email || !password) {
    return (ctx.body = {
      code: 400,
      msg: "参数不合法",
    });
  }
  try {
    let user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return (ctx.body = {
        code: 400,
        msg: "用户名或密码错误",
      });
    }
    // 验证密码
    if (!vertify(password, user.password)) {
      return (ctx.body = {
        code: 400,
        msg: "用户名或密码错误",
      });
    }
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      sex: user.sex,
      address: user.address
    };
    const token = getToken(payload);
    return (ctx.body = {
      code: 200,
      result: { token },
      msg: "登录成功",
    });
  } catch (error) {
    console.log(error);
    return (ctx.body = {
      code: 500,
      msg: "错误",
    });
  }
};

// 获取用户信息
exports.getUserInfo = async (ctx) => {
  try {
    const id = _getUserId(ctx);
    const result = await User.findOne({
      attributes: ["id", "email", "name", "sex", "address"],
      where: {
        id,
      },
    });
    ctx.body = {
      code: 200,
      msg: "",
      result,
    };
  } catch (error) {
    ctx.body = {
      code: 500,
      msg: "查询失败",
    };
  }
};

// 修改个人信息
exports.editUser = async (ctx) => {
  let { name, sex, avatar } = ctx.request.body;
  const data = {};
  if (name) {
    data.name = name;
  }
  if (sex) {
    data.sex = sex;
  }
  if (avatar) {
    data.avatar = avatar;
  }
  try {
    const id = _getUserId(ctx);
    await User.update(data, {
      where: {
        id,
      },
    });
    ctx.body = {
      code: 200,
      msg: "修改成功",
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      code: 500,
      msg: "修改失败",
    };
  }
};

// 修改密码
exports.editUserPwd = async (ctx) => {
  let { oldPwd, newPwd } = ctx.request.body;
  try {
    const id = _getUserId(ctx);
    // 先判断旧密码是否正确
    let user = await User.findOne({
      where: {
        id,
      },
    });
    if (!vertify(oldPwd, user.password)) {
      return (ctx.body = {
        code: 400,
        msg: "旧密码错误",
      });
    }

    // 修改密码
    let password = generateHash(newPwd);
    await User.update(
      {
        password,
      },
      {
        where: {
          id,
        },
      }
    );
    ctx.body = {
      code: 200,
      msg: "修改成功",
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      code: 500,
      msg: "修改失败",
    };
  }
};

function _getUserId(ctx) {
  const { authorization } = ctx.request.header;
  const payload = getJWTPayload(authorization);
  const { id } = payload;
  return id;
}
