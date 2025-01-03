const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const verifyToken = require('../middleware/authMiddleware');

router.get('', verifyToken,categoryController.readAllCategory);
router.post('', categoryController.createCategory);
// router.put('/:id', verifyToken, categoryController.updateCategory);
// router.delete('/:id', verifyToken, categoryController.deleteCategory);

module.exports = router;