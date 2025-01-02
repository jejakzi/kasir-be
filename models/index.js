const mysql = require('mysql2');
const { Sequelize } = require('sequelize');
const UserModel = require('./userModel');

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'sql.freedb.tech',
    port: 3306,
    database: 'freedb_freedbmysql',
    username: 'freedb_freedbroot',
    password: '9RqAzd@%N3mG!rr'
});

// const sequelize = new Sequelize({
//     dialect: 'mysql',
//     host: 'localhost',
//     port: 3306,
//     database: 'restaurant',
//     username: 'root',
//     password: ''
// });

const User = UserModel(sequelize);

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(err => {
        console.error('Error synchronizing the database:', err);
    });

module.exports = {
    sequelize,
    User
};
