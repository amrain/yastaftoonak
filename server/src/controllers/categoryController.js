const Category = require('../models/Category');

async function listCategories(req, res) {
  const categories = await Category.find().lean();

  const categoriesWithOrder = categories.map((cat) => ({
    ...cat,
    order: typeof cat.order === 'number' ? cat.order : Number.POSITIVE_INFINITY,
  }));

  categoriesWithOrder.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const orderedCategories = categoriesWithOrder.map((cat, index) => ({
    ...cat,
    order: cat.order === Number.POSITIVE_INFINITY ? index + 1 : cat.order,
  }));

  return res.json({ categories: orderedCategories });
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

  const maxOrderCategory = await Category.findOne().sort({ order: -1 }).select('order').lean();
  const nextOrder = maxOrderCategory ? (maxOrderCategory.order || 0) + 1 : 1;

  const category = await Category.create({ name, order: nextOrder });
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

async function updateCategoryOrder(req, res) {
  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ message: 'مطلوب مصفوفة من المعرفات لترتيب التصنيفات.' });
  }

  const bulkOps = orderedIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { order: index + 1 } },
    },
  }));

  try {
    if (bulkOps.length > 0) {
      await Category.bulkWrite(bulkOps, { ordered: true });
    }
    return res.json({ message: 'تم حفظ ترتيب التصنيفات بنجاح.' });
  } catch (error) {
    return res.status(500).json({ message: 'حدث خطأ أثناء حفظ ترتيب التصنيفات.', error: error.message });
  }
}

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
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'التصنيف غير موجود.' });
    }

    return res.json({ message: 'تم تحديث التصنيف بنجاح.', category });
  } catch (error) {
    return res.status(500).json({ message: 'حدث خطأ أثناء التحديث.', error: error.message });
  }
}

module.exports = { listCategories, createCategory, deleteCategory, updateCategory, updateCategoryOrder };
