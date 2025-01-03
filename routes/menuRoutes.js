const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const verifyToken = require('../middleware/authMiddleware');

router.get('', verifyToken, menuController.readAllMenu);
router.post('', menuController.createMenu);
// router.put('/:id', verifyToken, categoryController.updateCategory);
// router.delete('/:id', verifyToken, categoryController.deleteCategory);

module.exports = router;