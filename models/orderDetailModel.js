const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const OrderDetail = sequelize.define('order_detail', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        order_id: { type: DataTypes.INTEGER, allowNull: false },
        menu_id: { type: DataTypes.INTEGER, allowNull: false },
        amount: { type: DataTypes.INTEGER, allowNull: false },
        price: {type: DataTypes.INTEGER, allowNull:false},
        price_total: {type: DataTypes.DOUBLE, allowNull: false},
        note: {type: DataTypes.STRING, allowNull: true}
    });
    return OrderDetail;
};