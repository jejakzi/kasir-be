const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Order = sequelize.define('order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        order_type_id: { type: DataTypes.INTEGER, allowNull: false },
        customer_name: { type: DataTypes.STRING, allowNull: false },
        no_table: {type: DataTypes.INTEGER, allowNull:false},
        total: {type: DataTypes.DOUBLE, allowNull: true}
    });
    return Order;
};