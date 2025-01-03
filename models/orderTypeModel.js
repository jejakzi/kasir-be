const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const OrderType = sequelize.define('order_type', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        order_type_name: { type: DataTypes.STRING, allowNull: false }
    });
    return OrderType;
};