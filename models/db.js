const Sequelize = require('sequelize');
const sequelize = new Sequelize('node_exemplo', 'root', '',{
    host: '127.0.0.1',
    dialect: 'mysql',
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timstamps: true
    },
    logging: false
})

/*

    TESTANDO SE CONECTOU AO BANCO DE DADOS

sequelize.authenticate().then(function(){
    console.log('conectado no banco de dados ')
}).catch(function(err){
    console.log('falha ao se conectar: ' +err)
})

*/

module.exports = {Sequelize, sequelize}