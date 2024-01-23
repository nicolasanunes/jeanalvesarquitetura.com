const Sequelize = require("sequelize");
const connection = new Sequelize('xuyiwh_jaarq','xuyiwh_userbd','tBz5WRkOe2', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;