const express = require('express');
const router = express.Router();
// const { listCategories, createCategory, deleteCategory } = require('../controllers/categoryController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { listCategories, createCategory, deleteCategory, updateCategory } = require('../controllers/categoryController');
// جلب التصنيفات متاح للجميع
router.get('/', listCategories);

// الإضافة والحذف للمدير فقط
router.post('/', requireAuth, requireRole('admin'), createCategory);
router.delete('/:id', requireAuth, requireRole('admin'), deleteCategory);
router.put('/:id', requireAuth, requireRole('admin'), updateCategory);

module.exports = router;