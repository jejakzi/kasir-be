const { sequelize, Order, OrderType, RestaurantTable, OrderDetail } = require("../models");

function formatOrderDate(date) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const d = new Date(date);
    const options = {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23'
    };
    const formatter = new Intl.DateTimeFormat('id-ID', options);
    const formattedParts = formatter.formatToParts(d);

    const dayName = days[d.getUTCDay()];
    const formattedDate = `${dayName}, ${formattedParts[4].value}/${formattedParts[2].value}/${formattedParts[0].value} ${formattedParts[6].value}:${formattedParts[8].value}:${formattedParts[10].value}`;
    return formattedDate;
}

exports.createOrder = async (req, res) => {
    try {
        const transaction = await sequelize.transaction();
        const { order_number,order_type_id, customer_name, no_table_id, 
            sub_total, total, tax, paid, order_detail} = req.body;
        
            const newOrder = await Order.create({
                order_number,
                order_type_id,
                customer_name,
                no_table_id,
                sub_total,
                total,
                tax,
                paid,
                changes: paid-total
            }, { transaction });
    
            const orderId = newOrder.id;
    
            if (Array.isArray(order_detail) && order_detail.length > 0) {
                const orderDetails = order_detail.map(detail => ({
                    order_id: orderId,
                    menu_id: detail.menu_id,
                    amount: detail.amount,
                    price: detail.price,
                    price_total: detail.price*detail.amount,
                    note: detail.note
                }));
    
                await OrderDetail.bulkCreate(orderDetails, { transaction });
            }
    
            // Commit the transaction
        await transaction.commit();

        // Retrieve order details to generate the receipt
        const orderQuery = `
            SELECT o.id, o.order_number, o.createdAt, o.customer_name,
            ot.order_type_name, r.table_no, o.sub_total, o.tax,
            o.total, o.paid, o.changes
            FROM orders o
            JOIN order_types ot ON ot.id = o.order_type_id
            JOIN restaurant_tables r ON r.id = o.no_table_id
            WHERE o.id = :id
        `;
        const orderResult = await sequelize.query(orderQuery, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { id: orderId }
        });

        if (orderResult.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = orderResult[0];

        const orderDetailQuery = `
            SELECT od.id, m.name AS menu_name, od.amount, od.price, od.price_total, od.note
            FROM order_details od
            JOIN menus m ON m.id = od.menu_id
            WHERE od.order_id = :id
        `;
        const orderDetails = await sequelize.query(orderDetailQuery, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { id: orderId }
        });

        // Format the response
        const response = {
            id: order.id,
            order_number: order.order_number,
            order_date: formatOrderDate(order.createdAt),
            customer_name: order.customer_name,
            order_type_name: order.order_type_name,
            table_no: order.table_no,
            sub_total: order.sub_total,
            tax: order.tax,
            total: order.total,
            paid: order.paid,
            changes: order.changes,
            order_details: orderDetails.map(detail => ({
                id: detail.id,
                menu_name: detail.menu_name,
                amount: detail.amount,
                price: detail.price,
                price_total: detail.price_total,
                note: detail.note
            }))
        };

        res.status(201).json({
            message: 'Order created successfully',
            data: response
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getStrukByOrderId = async (req, res) => {
    try {
        const { id } = req.params; 
        const orderQuery = `
            SELECT o.id, o.order_number, o.createdAt, o.customer_name,
            ot.order_type_name, r.table_no, o.sub_total, o.tax,
            o.total, o.paid, o.changes
            from orders o JOIN order_types ot ON ot.id = o.order_type_id
            JOIN restaurant_tables r ON r.id = o.no_table_id
            where o.id = :id
        `;
        const orderResult = await sequelize.query(orderQuery, {
            type: sequelize.QueryTypes.SELECT,
            replacements: {id}
        });
        if (orderResult.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = orderResult[0]; 

        const orderDetailQuery = `
            SELECT od.id, m.name, od.amount, od.price, od.price_total, od.note
            from order_details od JOIN menus m ON m.id = od.menu_id
            where od.order_id = :id
        `;
        const orderDetails = await sequelize.query(orderDetailQuery, {
            type: sequelize.QueryTypes.SELECT,
            replacements: {id}
        });

        const response = {
            id: order.id,
            order_number: order.order_number,
            order_date: formatOrderDate(order.createdAt),
            customer_name: order.customer_name,
            order_type_name: order.order_type_name,
            table_no: order.table_no,
            sub_total: order.sub_total,
            tax: order.tax,
            total: order.total,
            paid: order.paid,
            changes: order.changes,
            order_details: orderDetails.map(detail => ({
                id: detail.id,
                menu_name: detail.menu_name,
                amount: detail.amount,
                price: detail.price,
                price_total: detail.price_total,
                note: detail.note
            }))
        }

        res.json({
            data: response
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getListOrder = async (req, res) => {
    try {
        const { name = "", order_type_id="" } = req.query;
        const orderQuery = `
            SELECT o.id, o.order_number, o.createdAt, o.customer_name,
            ot.order_type_name, r.table_no, o.total
            FROM orders o
            JOIN order_types ot ON ot.id = o.order_type_id
            JOIN restaurant_tables r ON r.id = o.no_table_id
            WHERE (:name IS NULL OR o.customer_name LIKE :name)
            AND (:order_type_id IS NULL OR o.order_type_id = :order_type_id)
        `;

        const replacements = {
            name: name ? `%${name}%` : null,
            order_type_id: order_type_id || null,
        };

        const orders = await sequelize.query(orderQuery, {
            type: sequelize.QueryTypes.SELECT,
            replacements,
        });

        const response = orders.map(order => ({
            id: order.id,
            order_number: order.order_number,
            order_date: formatOrderDate(order.createdAt),
            customer_name: order.customer_name,
            order_type_name: order.order_type_name,
            table_no: order.table_no,
            total: order.total
        }));

        res.json({
            data: response
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.listTable = async (req, res) => {
    try {

        const tableQuery = `
            SELECT id, table_no
            from restaurant_tables
        `;
        const tables = await sequelize.query(tableQuery, {
            type: sequelize.QueryTypes.SELECT
        });
        const response = tables.map(table => ({
            id: table.id,
            table_no: table.table_no
        }));

        res.json({
            data: response
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrderType = async (req, res) => {
    try {

        const orderTypeQuery = `
            SELECT id, order_type_name
            from order_types
        `;
        const orderTypes = await sequelize.query(orderTypeQuery, {
            type: sequelize.QueryTypes.SELECT
        });
        const response = orderTypes.map(orderType => ({
            id: orderType.id,
            order_type_name: orderType.order_type_name
        }));

        res.json({
            data: response
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUniqueOrderNo = async (req, res) => {
    try {

        const now = new Date();

        const year = String(now.getFullYear()).slice(-2); // 2 digit terakhir tahun
        const month = String(now.getMonth() + 1).padStart(2, '0'); // 2 digit bulan
        const date = String(now.getDate()).padStart(2, '0'); // 2 digit tanggal
        const hours = String(now.getHours()).padStart(2, '0'); // 2 digit jam
        const minutes = String(now.getMinutes()).padStart(2, '0'); // 2 digit menit
        const seconds = String(now.getSeconds()).padStart(2, '0'); // 2 digit detik

        const uniqueId = `${year}${month}${date}${hours}${minutes}${seconds}`;
        const order_no = `ORDR#${uniqueId}`;

        res.json({
            data: {
                order_number: order_no
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
