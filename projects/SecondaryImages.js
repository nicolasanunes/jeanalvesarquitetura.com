const Sequelize = require("sequelize");
const connection = require("../database/database");
const Project = require("./Project");

const SecondaryImage = connection.define('secondaryImages', {
    title: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

Project.hasMany(SecondaryImage); // 1 projeto tem muitas imagens secundárias (Relacionamento 1 para muitos no Sequelize)
SecondaryImage.belongsTo(Project); // 1 imagem secundária pertence a 1 projeto (Relacionamento 1 para 1 no Sequelize)

// CRIAR APÓS TABELA "PROJECTS" JÁ ESTAR CRIADA
// SecondaryImage.sync({force: true}); // força a criação da tabela no banco de dados no primeiro contato e apaga todas as informações atuais

module.exports = SecondaryImage;