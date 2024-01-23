const Sequelize = require("sequelize");
const connection = new Sequelize('xuyiwh_jaarq','xuyiwh_userbd','tBz5WRkOe2', {
    host: 'mysql-ag-br1-11.conteige.cloud',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;