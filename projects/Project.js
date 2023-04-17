const Sequelize = require("sequelize");
const connection = require("../database/database");

const Project = connection.define('projects', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, capeImage: {
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    }, location: {
        type: Sequelize.STRING,
        allowNull: false
    }, year: {
        type: Sequelize.STRING,
        allowNull: true
    }, area: {
        type: Sequelize.STRING,
        allowNull: true
    }, description: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

// Category.hasMany(Project); // 1 categoria tem muitos projetos (Relacionamento 1 para muitos no Sequelize)
// Project.belongsTo(Category); // 1 projeto pertence a 1 categoria (Relacionamento 1 para 1 no Sequelize)

// Project.sync({force: true}); // força a criação da tabela no banco de dados no primeiro contato e apaga todas as informações atuais

module.exports = Project;