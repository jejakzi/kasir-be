const categoryService = require('../service/categoryService');

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        await categoryService.createCategory(name);

        res.status(201).json({ message: 'Category created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.readAllCategory = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        
        const response = categories.map(category => ({
            id: category.id,
            name: category.name
        }));

        res.json({ data: response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
