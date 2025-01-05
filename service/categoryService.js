const { sequelize, Category } = require('../models');

exports.createCategory = async (name) => {
    return await Category.create({ name });
};

exports.getAllCategories = async () => {
    const categoryQuery = `
        SELECT * FROM categories
    `;

    return await sequelize.query(categoryQuery, {
        type: sequelize.QueryTypes.SELECT,
    });
};
