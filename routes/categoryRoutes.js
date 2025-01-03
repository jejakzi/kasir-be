const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const verifyToken = require('../middleware/authMiddleware');

router.get('', verifyToken,categoryController.readAllCategory);
router.post('', categoryController.createCategory);

module.exports = router;