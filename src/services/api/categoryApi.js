import { apiRequest } from './client';

// جلب كل التصنيفات
export function fetchCategories() {
  return apiRequest('/categories');
}

// إضافة تصنيف جديد
export function createCategory(payload) {
  return apiRequest('/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// حذف تصنيف (تم تعديل المسار ليرسل المعرف في الرابط)
export function removeCategory(id) {
  return apiRequest(`/categories/${id}`, {
    method: 'DELETE',
  });
}

// إضافة هذه الدالة في نهاية الملف
export function updateCategory(id, payload) {
  return apiRequest(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}