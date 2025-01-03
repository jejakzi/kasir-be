const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middleware/authMiddleware');

router.post('', verifyToken, orderController.createOrder);
router.get('/order-type', verifyToken, orderController.getOrderType);
router.get('/order-no', verifyToken, orderController.getUniqueOrderNo);
router.get('/list-table', verifyToken, orderController.listTable);
router.get('/:id', verifyToken, orderController.getStrukByOrderId);

module.exports = router;