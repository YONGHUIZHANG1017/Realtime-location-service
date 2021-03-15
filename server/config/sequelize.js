const Sequelize = require('sequelize');

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "myproject",
};

const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  charset: 'utf8',
  collate: 'utf8_general_ci', 
  host: dbConfig.host,
  dialect: 'mysql',
});

module.exports = sequelize;
