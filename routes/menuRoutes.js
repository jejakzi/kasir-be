const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const verifyToken = require('../middleware/authMiddleware');

router.get('', verifyToken, menuController.readAllMenu);
router.post('', menuController.createMenu);

module.exports = router;