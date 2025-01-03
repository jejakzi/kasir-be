const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Images = sequelize.define('images', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        filename: { type: DataTypes.STRING, allowNull: false },
        menu_id: { type: DataTypes.INTEGER, allowNull: false }
    });
    return Images;
};