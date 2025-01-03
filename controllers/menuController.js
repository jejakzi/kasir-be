const { sequelize, Menu } = require("../models");

exports.createMenu = async (req, res) => {
    try {
        const { name,category_id, price, description, image_name} = req.body;
        
        await Menu.create({
            name, category_id, price, description, image_name
        });

        res.status(201).json({ message: 'Menu created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.readAllMenu = async (req, res) => {
    try {
        const { category = 0, page_no = 1, page_size = 10 } = req.query;

        // Hitung offset berdasarkan page_no dan page_size
        const offset = (page_no - 1) * page_size;

        const countQuery = `
        SELECT COUNT(*) AS total
        FROM menus m 
        WHERE (m.category_id = :category OR :category = 0)
        `;

        const totalResult = await sequelize.query(countQuery, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { category }
        });

        const totalItems = totalResult[0].total;

        const menuQuery = `
            SELECT m.id, m.name, c.name AS category_name, m.price, m.description, m.image_name
            from menus m JOIN categories c ON m.category_id = c.id
            where (m.category_id = :category OR :category = 0)
            LIMIT :page_size OFFSET :offset
        `;

        const menus = await sequelize.query(menuQuery, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { category, page_size: parseInt(page_size, 10), offset: parseInt(offset, 10) }
        });
        const response = menus.map(menu => ({
            id: menu.id,
            name: menu.name,
            category_name: menu.category_name,
            price: menu.price,
            description: menu.description,
            image_name: menu.image_name
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
