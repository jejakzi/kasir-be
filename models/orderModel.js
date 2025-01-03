const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Order = sequelize.define('order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        order_number: { type: DataTypes.STRING, allowNull: false },
        order_type_id: { type: DataTypes.INTEGER, allowNull: false },
        customer_name: { type: DataTypes.STRING, allowNull: false },
        no_table_id: {type: DataTypes.INTEGER, allowNull:true},
        sub_total: {type: DataTypes.DOUBLE, allowNull: true},
        tax: {type: DataTypes.DOUBLE, allowNull: true},
        total: {type: DataTypes.DOUBLE, allowNull: true},
        paid: {type: DataTypes.DOUBLE, allowNull: true},
        changes: {type: DataTypes.DOUBLE, allowNull: true}
    });
    return Order;
};