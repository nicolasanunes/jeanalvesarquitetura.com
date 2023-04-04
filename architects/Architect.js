const Sequelize = require("sequelize");
const connection = require("../database/database");

const Architect = connection.define('architects', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    }, image: {
        type: Sequelize.STRING,
        allowNull: false
    }, description: {
        type: Sequelize.STRING,
        allowNull: false
    }, address: { 
        type: Sequelize.STRING,
        allowNull: true
    }, phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true
    }, instagramLink: {
        type: Sequelize.STRING,
        allowNull: true
    }, facebookLink: {
        type: Sequelize.STRING,
        allowNull: true
    }, twitterLink: {
        type: Sequelize.STRING,
        allowNull: true
    }, whatsappLink: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

// Architect.sync({force: true}); // força a criação da tabela no banco de dados no primeiro contato

module.exports = Architect;