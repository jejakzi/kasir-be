const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const RestaurantTable = sequelize.define('restaurant_table', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        table_no: { type: DataTypes.STRING, allowNull: false }
    });
    return RestaurantTable;
};