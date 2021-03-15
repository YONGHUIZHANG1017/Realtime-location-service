const Sequelize = require("sequelize");
const sequelize = require("../config/sequelize");

const User = sequelize.define("user", {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }, // 邮箱
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }, // 密码
  name: {
    type: Sequelize.STRING(20),
    allowNull: false
  }, // 昵称
  sex: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }, // 性别 男（0）、女（1）
  address: {
    type: Sequelize.STRING
  }
});

module.exports = User;
