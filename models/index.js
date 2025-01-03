const mysql = require('mysql2');
const { Sequelize } = require('sequelize');
const UserModel = require('./userModel');
const CategoryModel = require('./categoryModel');
const MenuModel = require('./menuModel');
const OrderModel = require('./orderModel');
const OrderTypeModel = require('./orderTypeModel');
const RestaurantTableModel = require('./restaurantTableModel');
const OrderDetailModel = require('./orderDetailModel');

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
const Category = CategoryModel(sequelize);
const Menu = MenuModel(sequelize);
const Order = OrderModel(sequelize);
const OrderType = OrderTypeModel(sequelize);
const RestaurantTable = RestaurantTableModel(sequelize);
const OrderDetail = OrderDetailModel(sequelize);

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
    User,
    Category,
    Menu,
    Order,
    OrderType,
    RestaurantTable,
    OrderDetail
};
