const Sequelize = require("sequelize");
const connection = require("../database/database");

const Architect = connection.define('architects', {
    image: {
        type: Sequelize.STRING,
        allowNull: false
    }, name: {
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    }, role: {
        type: Sequelize.STRING,
        allowNull: true
    }, whatsappLink: {
        type: Sequelize.STRING,
        allowNull: true
    }, instagramLink: {
        type: Sequelize.STRING,
        allowNull: true
    }, facebookLink: {
        type: Sequelize.STRING,
        allowNull: true
    },  description: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Architect.sync({force: true}); // força a criação da tabela no banco de dados no primeiro contato

module.exports = Architect;