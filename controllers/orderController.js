const orderService = require('../service/orderService');

exports.createOrder = async (req, res) => {
    try {
        const response = await orderService.createOrder(req.body);
        res.status(201).json({
            message: 'Order created successfully',
            data: response,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getStrukByOrderId = async (req, res) => {
    try {
        const response = await orderService.getStrukByOrderId(req.params.id);
        res.json({ data: response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getListOrder = async (req, res) => {
    try {
        const response = await orderService.getListOrder(req.query);
        res.json({ data: response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.listTable = async (req, res) => {
    try {
        const response = await orderService.listTable();
        res.json({ data: response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrderType = async (req, res) => {
    try {
        const response = await orderService.getOrderType();
        res.json({ data: response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUniqueOrderNo = async (req, res) => {
    try {
        const response = await orderService.getUniqueOrderNo();
        res.json({ data: response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
