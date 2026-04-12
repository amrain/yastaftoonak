const Category = require('../models/Category');

async function listCategories(req, res) {
  const categories = await Category.find().sort({ createdAt: -1 });
  return res.json({ categories });
}

async function createCategory(req, res) {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ message: 'اسم التصنيف مطلوب.' });
  }

  const existing = await Category.findOne({ name });
  if (existing) {
    return res.status(400).json({ message: 'هذا التصنيف موجود مسبقاً.' });
  }

  const category = await Category.create({ name });
  return res.status(201).json({ message: 'تمت إضافة التصنيف.', category });
}

async function deleteCategory(req, res) {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'التصنيف غير موجود.' });
  }

  await category.deleteOne();
  return res.json({ message: 'تم حذف التصنيف بنجاح.' });
}

// أضف هذه الدالة قبل module.exports
async function updateCategory(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'اسم التصنيف مطلوب.' });
  }

  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true } // لإرجاع المستند بعد التحديث
    );

    if (!category) {
      return res.status(404).json({ message: 'التصنيف غير موجود.' });
    }

    return res.json({ message: 'تم تحديث التصنيف بنجاح.', category });
  } catch (error) {
    return res.status(500).json({ message: 'حدث خطأ أثناء التحديث.', error: error.message });
  }
}

// لا تنسَ إضافة updateCategory هنا
module.exports = { listCategories, createCategory, deleteCategory, updateCategory };
