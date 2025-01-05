const { sequelize, Menu } = require('../models');

exports.createMenu = async ({ name, category_id, price, description, image_name }) => {
    return await Menu.create({
        name,
        category_id,
        price,
        description,
        image_name
    });
};

exports.getAllMenus = async ({ category, page_no, page_size, keywords }) => {
    const offset = (page_no - 1) * page_size;

    const countQuery = `
        SELECT COUNT(*) AS total
        FROM menus m 
        WHERE (m.category_id = :category OR :category = 4)
    `;
    const totalResult = await sequelize.query(countQuery, {
        type: sequelize.QueryTypes.SELECT,
        replacements: { category }
    });
    const totalItems = totalResult[0].total;

    if (keywords !== "") {
        category = 4;
    }

    const menuQuery = `
        SELECT m.id, m.name, c.name AS category_name, m.price, m.description, m.image_name
        FROM menus m 
        JOIN categories c ON m.category_id = c.id
        WHERE (m.category_id = :category OR :category = 4)
        AND (:keywords IS NULL OR m.name LIKE :keywords)
        LIMIT :page_size OFFSET :offset
    `;
    const menus = await sequelize.query(menuQuery, {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            category,
            page_size,
            offset,
            keywords: keywords ? `%${keywords}%` : null,
        }
    });

    return { menus, totalItems };
};
