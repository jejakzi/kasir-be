const { sequelize, Category } = require("../models");

exports.createCategory = async (req, res) => {
    try {
        const { name} = req.body;
        
        await Category.create({
            name
        });

        res.status(201).json({ message: 'Category created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.readAllCategory = async (req, res) => {
    try {
        const categoryQuery = `
            SELECT * from categories
        `;

        const categories = await sequelize.query(categoryQuery, {
            type: sequelize.QueryTypes.SELECT,
        });
        const response = categories.map(category => ({
            id: category.id,
            name: category.name
        }));

        res.json({data :response});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};