const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const categoryController = require('../controllers/categoryController');

router.post('/', auth, categoryController.createCategory);
router.get('/:roomId', auth, categoryController.getCategoriesByRoom);
router.put('/:id', auth, categoryController.updateCategory);
router.delete('/:id', auth, categoryController.deleteCategory);

module.exports = router;
