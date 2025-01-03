const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Menu = sequelize.define('menu', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        category_id: { type: DataTypes.INTEGER, allowNull: false },
        price: {type: DataTypes.DOUBLE, allowNull:false},
        description: {type: DataTypes.STRING, allowNull: true},
        image_name: {type: DataTypes.STRING, allowNull: true}
    });
    return Menu;
};