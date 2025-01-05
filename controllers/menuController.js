const menuService = require('../service/menuService');

exports.createMenu = async (req, res) => {
    try {
        const { name, category_id, price, description, image_name } = req.body;

        await menuService.createMenu({ name, category_id, price, description, image_name });

        res.status(201).json({ message: 'Menu created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.readAllMenu = async (req, res) => {
    try {
        const { category = 4, page_no = 1, page_size = 10, keywords = "" } = req.query;

        const { menus, totalItems } = await menuService.getAllMenus({
            category,
            page_no: parseInt(page_no, 10),
            page_size: parseInt(page_size, 10),
            keywords
        });

        const baseUrl = `${req.protocol}://${req.get('host')}/images`;
        const response = menus.map(menu => ({
            id: menu.id,
            name: menu.name,
            category_name: menu.category_name,
            price: menu.price,
            description: menu.description,
            image_url: `${baseUrl}/${menu.image_name}`
        }));

        res.json({
            data: response,
            pagination: {
                page_no: parseInt(page_no, 10),
                page_size: parseInt(page_size, 10),
                total_items: totalItems
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
