import { Tag, Edit2, Trash2, X, Plus, LayoutGrid, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import ConfirmDialog from '../../../shared/ui/ConfirmDialog';
import { useToast } from '../../../shared/ui/ToastProvider';

function AdminCategoriesPage({ categories = [], saveCategoryRecord, deleteCategoryById }) {
  const { addToast } = useToast();
  const [selectedCat, setSelectedCat] = useState(null);
  const [catName, setCatName] = useState('');
  const [catToDelete, setCatToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = (cat = null) => {
    if (cat) {
      // تعديل: تخزين الكائن بالكامل للتأكد من وجود الـ ID
      setSelectedCat(cat);
      setCatName(cat.name);
    } else {
      setSelectedCat('new');
      setCatName('');
    }
  };

  const handleSave = async () => {
    if (!catName.trim()) {
      addToast('يرجى إدخال اسم التصنيف', 'error');
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      // تحديد الهدف: إما 'new' أو المعرف (ID)
      const target = selectedCat === 'new' ? 'new' : (selectedCat._id || selectedCat.id);
      
      // البيانات المرسلة
      const payload = { name: catName.trim() };

      console.log("Saving Category - Target:", target, "Payload:", payload);

      // استدعاء دالة الحفظ وانتظارها
      await saveCategoryRecord(target, payload);

      addToast(selectedCat === 'new' ? 'تم إضافة التصنيف بنجاح' : 'تم تحديث التصنيف بنجاح', 'success');
      
      // إغلاق المودال وتصفير الحالة
      setSelectedCat(null);
      setCatName('');
    } catch (err) {
      console.error("Save Error:", err);
      addToast(err.message || 'حدث خطأ أثناء الحفظ، جرب مرة أخرى', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = () => {
    const targetId = catToDelete?._id || catToDelete?.id;
    if (!targetId) return;

    deleteCategoryById(targetId)
      .then(() => addToast('تم حذف التصنيف بنجاح', 'success'))
      .catch(err => addToast(err.message || 'فشل الحذف', 'error'))
      .finally(() => setCatToDelete(null));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-emerald-900 p-8 rounded-3xl shadow-lg text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold font-tajawal mb-2 flex items-center">
            <LayoutGrid className="ml-3 text-amber-400" /> إدارة أقسام الفتاوى
          </h2>
          <p className="text-emerald-100 text-sm opacity-80 font-tajawal">إضافة وتعديل التصنيفات الحالية.</p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="relative z-10 bg-amber-500 hover:bg-amber-400 text-emerald-950 px-6 py-3 rounded-2xl shadow-xl transition-all font-bold flex items-center justify-center transform hover:scale-105 active:scale-95"
        >
          <Plus size={20} className="ml-2" /> إضافة تصنيف جديد
        </button>
        <Tag className="absolute -left-10 -bottom-10 w-48 h-48 text-emerald-800 opacity-20 rotate-12" />
      </div>

      {/* Grid */}
      {categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat._id || cat.id} 
              className="group bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all relative overflow-hidden"
            >
              <div className="flex items-center space-x-3 space-x-reverse relative z-10">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600">
                  <Tag size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 font-tajawal">{cat.name}</h3>
              </div>

              <div className="mt-8 flex items-center justify-end space-x-3 space-x-reverse border-t pt-4 relative z-20">
                <button 
                  type="button"
                  onClick={() => openModal(cat)} 
                  className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  type="button"
                  onClick={() => setCatToDelete(cat)} 
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200">
          <Info className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 font-tajawal text-xl">لا توجد تصنيفات حالياً.</p>
        </div>
      )}

      {/* Modal */}
      {selectedCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 bg-emerald-600 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold font-tajawal">
                {selectedCat === 'new' ? 'إضافة قسم جديد' : 'تحديث اسم القسم'}
              </h3>
              <button onClick={() => setSelectedCat(null)}><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <input 
                type="text" autoFocus value={catName} 
                onChange={(e) => setCatName(e.target.value)} 
                className="w-full p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 outline-none focus:border-emerald-500 text-lg font-tajawal text-black dark:text-white" 
              />
              <div className="flex gap-3">
                <button 
                  disabled={isSubmitting}
                  onClick={() => setSelectedCat(null)} 
                  className="flex-1 py-4 rounded-2xl border border-gray-200 font-bold font-tajawal hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button 
                  disabled={isSubmitting}
                  onClick={handleSave} 
                  className={`flex-1 py-4 rounded-2xl font-bold font-tajawal text-white transition ${isSubmitting ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                >
                  {isSubmitting ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(catToDelete)}
        title="تأكيد الحذف"
        message={catToDelete ? `سيتم حذف قسم "${catToDelete.name}" نهائياً.` : ''}
        confirmLabel="نعم، احذف"
        cancelLabel="تراجع"
        onCancel={() => setCatToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default AdminCategoriesPage;

// import { Tag, Edit2, Trash2, X, Plus, LayoutGrid, Info } from 'lucide-react';
// import { useState } from 'react';
// import ConfirmDialog from '../../../shared/ui/ConfirmDialog';
// import { useToast } from '../../../shared/ui/ToastProvider';

// function AdminCategoriesPage({ categories = [], saveCategoryRecord, deleteCategoryById }) {
//   const { addToast } = useToast();
//   const [selectedCat, setSelectedCat] = useState(null);
//   const [catName, setCatName] = useState('');
//   const [catToDelete, setCatToDelete] = useState(null);

//   const openModal = (cat = null) => {
//     if (cat) {
//       setSelectedCat(cat);
//       setCatName(cat.name);
//     } else {
//       setSelectedCat('new');
//       setCatName('');
//     }
//   };

//   const handleSave = () => {
//     if (!catName.trim()) {
//       addToast('يرجى إدخال اسم التصنيف', 'error');
//       return;
//     }
    
//     saveCategoryRecord(selectedCat, { name: catName })
//       .then(() => {
//         addToast(selectedCat === 'new' ? 'تم إضافة التصنيف بنجاح' : 'تم تحديث التصنيف بنجاح', 'success');
//         setSelectedCat(null);
//       })
//       .catch(err => addToast(err.message || 'حدث خطأ أثناء الحفظ', 'error'));
//   };

//   const confirmDelete = () => {
//     const targetId = catToDelete?._id || catToDelete?.id;
//     if (!targetId) return;

//     deleteCategoryById(targetId)
//       .then(() => addToast('تم حذف التصنيف بنجاح', 'success'))
//       .catch(err => addToast(err.message || 'فشل الحذف', 'error'))
//       .finally(() => setCatToDelete(null));
//   };

//   return (
//     <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
//       {/* Header Section - تصميم عصري ملفت */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-emerald-900 p-8 rounded-3xl shadow-lg text-white relative overflow-hidden">
//         <div className="relative z-10">
//           <h2 className="text-3xl font-bold font-tajawal mb-2 flex items-center">
//             <LayoutGrid className="ml-3 text-amber-400" /> إدارة أقسام الفتاوى
//           </h2>
//           <p className="text-emerald-100 text-sm opacity-80 font-tajawal">يمكنك إضافة، تعديل أو حذف تصنيفات الفتاوى التي تظهر للجمهور.</p>
//         </div>
//         <button 
//           onClick={() => openModal()} 
//           className="relative z-10 bg-amber-500 hover:bg-amber-400 text-emerald-950 px-6 py-3 rounded-2xl shadow-xl transition-all font-bold flex items-center justify-center transform hover:scale-105 active:scale-95 shadow-amber-500/20"
//         >
//           <Plus size={20} className="ml-2" /> إضافة تصنيف جديد
//         </button>
//         {/* عنصر زخرفي خلفي */}
//         <Tag className="absolute -left-10 -bottom-10 w-48 h-48 text-emerald-800 opacity-20 rotate-12" />
//       </div>

//       {/* Categories Grid - استبدال الجدول بنظام البطاقات */}
//       {categories.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {categories.map((cat) => (
//             <div 
//               key={cat._id || cat.id} 
//               className="group bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 relative overflow-hidden"
//             >
//               <div className="flex items-start justify-between relative z-10">
//                 <div className="flex items-center space-x-3 space-x-reverse">
//                   <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
//                     <Tag size={20} />
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 font-tajawal">{cat.name}</h3>
//                 </div>
//               </div>

//               <div className="mt-8 flex items-center justify-end space-x-3 space-x-reverse border-t border-gray-50 dark:border-gray-700 pt-4">
//                 <button 
//                   onClick={() => openModal(cat)} 
//                   className="flex items-center text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
//                   title="تعديل"
//                 >
//                   <Edit2 size={18} />
//                 </button>
//                 <button 
//                   onClick={() => setCatToDelete(cat)} 
//                   className="flex items-center text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
//                   title="حذف"
//                 >
//                   <Trash2 size={18} />
//                 </button>
//               </div>
              
//               <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
//           <Info className="w-16 h-16 mx-auto mb-4 text-gray-300" />
//           <p className="text-gray-500 dark:text-gray-400 text-xl font-tajawal">لا توجد تصنيفات حالياً، ابدأ بإضافة أول قسم.</p>
//         </div>
//       )}

//       {/* Modal - نافذة منبثقة عصرية بلمسة زجاجية */}
//       {selectedCat && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
//           <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform animate-in zoom-in-95 duration-300">
//             <div className="p-6 bg-emerald-600 text-white flex justify-between items-center">
//               <h3 className="text-xl font-bold font-tajawal">
//                 {selectedCat === 'new' ? 'إضافة قسم جديد' : 'تحديث اسم القسم'}
//               </h3>
//               <button onClick={() => setSelectedCat(null)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
//                 <X size={24} />
//               </button>
//             </div>
            
//             <div className="p-8 space-y-6">
//               <div>
//                 <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 mr-1 font-tajawal">اسم التصنيف</label>
//                 <input 
//                   type="text" 
//                   autoFocus
//                   value={catName} 
//                   onChange={(e) => setCatName(e.target.value)} 
//                   className="w-full p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-all text-lg font-tajawal" 
//                   placeholder="مثال: معاملات مالية..." 
//                 />
//               </div>
              
//               <div className="flex gap-3">
//                 <button 
//                   onClick={() => setSelectedCat(null)} 
//                   className="flex-1 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold font-tajawal hover:bg-gray-50 dark:hover:bg-gray-800 transition"
//                 >
//                   إلغاء
//                 </button>
//                 <button 
//                   onClick={handleSave} 
//                   className="flex-1 py-4 rounded-2xl bg-emerald-600 text-white font-bold font-tajawal hover:bg-emerald-700 shadow-lg shadow-emerald-200 dark:shadow-none transition transform active:scale-95"
//                 >
//                   حفظ البيانات
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <ConfirmDialog
//         open={Boolean(catToDelete)}
//         title="تأكيد الحذف"
//         message={catToDelete ? `سيتم حذف قسم "${catToDelete.name}" نهائياً من النظام.` : ''}
//         confirmLabel="نعم، احذف"
//         cancelLabel="تراجع"
//         onCancel={() => setCatToDelete(null)}
//         onConfirm={confirmDelete}
//       />
//     </div>
//   );
// }

// export default AdminCategoriesPage;
// //*********************************************** */
// // import { Tag, Edit, Trash2, XCircle, Plus } from 'lucide-react';
// // import { useState } from 'react';
// // import ConfirmDialog from '../../../shared/ui/ConfirmDialog';
// // import { useToast } from '../../../shared/ui/ToastProvider';

// // function AdminCategoriesPage({ categories = [], saveCategoryRecord, deleteCategoryById }) {
// //   const { addToast } = useToast();
// //   const [selectedCat, setSelectedCat] = useState(null);
// //   const [catName, setCatName] = useState('');
// //   const [catToDelete, setCatToDelete] = useState(null);

// //   const openModal = (cat = null) => {
// //     if (cat) {
// //       setSelectedCat(cat);
// //       setCatName(cat.name);
// //     } else {
// //       setSelectedCat('new');
// //       setCatName('');
// //     }
// //   };

// //   const handleSave = () => {
// //     if (!catName.trim()) {
// //       addToast('يرجى إدخال اسم التصنيف', 'error');
// //       return;
// //     }
    
// //     saveCategoryRecord(selectedCat, { name: catName })
// //       .then(() => {
// //         addToast(selectedCat === 'new' ? 'تم إضافة التصنيف بنجاح' : 'تم تحديث التصنيف بنجاح', 'success');
// //         setSelectedCat(null);
// //       })
// //       .catch(err => addToast(err.message || 'حدث خطأ أثناء الحفظ', 'error'));
// //   };

// //   const confirmDelete = () => {
// //     // التأكد من جلب المعرف الصحيح سواء كان id أو _id
// //     const targetId = catToDelete?._id || catToDelete?.id;

// //     if (!targetId) {
// //       addToast('فشل تحديد معرف التصنيف', 'error');
// //       setCatToDelete(null);
// //       return;
// //     }

// //     deleteCategoryById(targetId)
// //       .then(() => {
// //         addToast('تم حذف التصنيف بنجاح', 'success');
// //       })
// //       .catch(err => addToast(err.message || 'فشل الحذف من الخادم', 'error'))
// //       .finally(() => setCatToDelete(null));
// //   };

// //   return (
// //     <div className="space-y-6">
// //       {/* الرأس */}
// //       <div className="flex justify-between items-center">
// //         <h2 className="text-2xl font-bold font-tajawal">إدارة التصنيفات</h2>
// //         <button 
// //           onClick={() => openModal()} 
// //           className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow transition font-bold flex items-center"
// //         >
// //           <Plus size={18} className="ml-2" /> إضافة تصنيف جديد
// //         </button>
// //       </div>

// //       {/* جدول التصنيفات */}
// //       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
// //         <div className="overflow-x-auto">
// //           <table className="w-full text-right">
// //             <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300">
// //               <tr>
// //                 <th className="p-4 font-medium">اسم التصنيف</th>
// //                 <th className="p-4 font-medium text-left">إجراءات</th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
// //               {categories.length > 0 ? (
// //                 categories.map((cat) => (
// //                   // استخدام _id كـ key ليتناسب مع MongoDB
// //                   <tr key={cat._id || cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition">
// //                     <td className="p-4 font-medium flex items-center text-emerald-700 dark:text-emerald-400">
// //                       <Tag className="w-4 h-4 ml-2" /> {cat.name}
// //                     </td>
// //                     <td className="p-4 space-x-2 space-x-reverse text-left">
// //                       <button 
// //                         onClick={() => openModal(cat)} 
// //                         className="text-emerald-600 hover:underline text-sm font-medium"
// //                       >
// //                         تعديل
// //                       </button>
// //                       <button 
// //                         onClick={() => setCatToDelete(cat)} 
// //                         className="text-red-500 hover:underline text-sm font-medium"
// //                       >
// //                         حذف
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))
// //               ) : (
// //                 <tr>
// //                   <td colSpan="2" className="p-8 text-center text-gray-500">لا توجد تصنيفات حالياً.</td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       {/* نافذة الإضافة والتعديل */}
// //       {selectedCat && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
// //           <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
// //             <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700">
// //               <h3 className="text-xl font-bold">
// //                 {selectedCat === 'new' ? 'إضافة تصنيف جديد' : 'تعديل التصنيف'}
// //               </h3>
// //               <button onClick={() => setSelectedCat(null)} className="text-gray-500 hover:text-red-500">
// //                 <XCircle size={24} />
// //               </button>
// //             </div>
// //             <div className="p-6 space-y-4">
// //               <div>
// //                 <label className="block text-sm font-medium mb-1">اسم التصنيف</label>
// //                 <input 
// //                   type="text" 
// //                   autoFocus
// //                   value={catName} 
// //                   onChange={(e) => setCatName(e.target.value)} 
// //                   className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 outline-none focus:border-emerald-500" 
// //                   placeholder="مثال: فقه الصلاة، المعاملات المالية..." 
// //                 />
// //               </div>
// //             </div>
// //             <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3 space-x-reverse">
// //               <button 
// //                 onClick={() => setSelectedCat(null)} 
// //                 className="px-5 py-2 rounded border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
// //               >
// //                 إلغاء
// //               </button>
// //               <button 
// //                 onClick={handleSave} 
// //                 className="px-5 py-2 rounded bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
// //               >
// //                 حفظ
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* حوار تأكيد الحذف */}
// //       <ConfirmDialog
// //         open={Boolean(catToDelete)}
// //         title="حذف التصنيف"
// //         message={catToDelete ? `هل أنت متأكد من حذف تصنيف "${catToDelete.name}"؟ لا يمكن التراجع عن هذا الإجراء.` : ''}
// //         confirmLabel="حذف"
// //         cancelLabel="إلغاء"
// //         onCancel={() => setCatToDelete(null)}
// //         onConfirm={confirmDelete}
// //       />
// //     </div>
// //   );
// // }

// // export default AdminCategoriesPage;
// // // import { Tag, Edit, Trash2, XCircle, Plus } from 'lucide-react';
// // // import { useState } from 'react';
// // // import ConfirmDialog from '../../../shared/ui/ConfirmDialog';
// // // import { useToast } from '../../../shared/ui/ToastProvider';

// // // function AdminCategoriesPage({ categories = [], saveCategoryRecord, deleteCategoryById }) {
// // //   const { addToast } = useToast();
// // //   const [selectedCat, setSelectedCat] = useState(null);
// // //   const [catName, setCatName] = useState('');
// // //   const [catToDelete, setCatToDelete] = useState(null);

// // //   const openModal = (cat = null) => {
// // //     if (cat) {
// // //       setSelectedCat(cat);
// // //       setCatName(cat.name);
// // //     } else {
// // //       setSelectedCat('new');
// // //       setCatName('');
// // //     }
// // //   };

// // //   const handleSave = () => {
// // //     if (!catName.trim()) {
// // //       addToast('يرجى إدخال اسم التصنيف', 'error');
// // //       return;
// // //     }
    
// // //     saveCategoryRecord(selectedCat, { name: catName })
// // //       .then(() => {
// // //         addToast(selectedCat === 'new' ? 'تم إضافة التصنيف بنجاح' : 'تم تحديث التصنيف بنجاح', 'success');
// // //         setSelectedCat(null);
// // //       })
// // //       .catch(err => addToast(err.message, 'error'));
// // //   };

// // //   const confirmDelete = () => {
// // //     deleteCategoryById(catToDelete.id)
// // //       .then(() => {
// // //         addToast('تم حذف التصنيف بنجاح', 'success');
// // //       })
// // //       .catch(err => addToast(err.message, 'error'))
// // //       .finally(() => setCatToDelete(null));
// // //   };

// // //   return (
// // //     <div className="space-y-6">
// // //       {/* الرأس */}
// // //       <div className="flex justify-between items-center">
// // //         <h2 className="text-2xl font-bold font-tajawal">إدارة التصنيفات</h2>
// // //         <button 
// // //           onClick={() => openModal()} 
// // //           className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow transition font-bold flex items-center"
// // //         >
// // //           <Plus size={18} className="ml-2" /> إضافة تصنيف جديد
// // //         </button>
// // //       </div>

// // //       {/* جدول التصنيفات */}
// // //       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
// // //         <div className="overflow-x-auto">
// // //           <table className="w-full text-right">
// // //             <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300">
// // //               <tr>
// // //                 <th className="p-4 font-medium">اسم التصنيف</th>
// // //                 <th className="p-4 font-medium">إجراءات</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
// // //               {categories.length > 0 ? (
// // //                 categories.map((cat) => (
// // //                   <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition">
// // //                     <td className="p-4 font-medium flex items-center text-emerald-700 dark:text-emerald-400">
// // //                       <Tag className="w-4 h-4 ml-2" /> {cat.name}
// // //                     </td>
// // //                     <td className="p-4 space-x-2 space-x-reverse">
// // //                       <button 
// // //                         onClick={() => openModal(cat)} 
// // //                         className="text-emerald-600 hover:underline text-sm font-medium"
// // //                       >
// // //                         تعديل
// // //                       </button>
// // //                       <button 
// // //                         onClick={() => setCatToDelete(cat)} 
// // //                         className="text-red-500 hover:underline text-sm font-medium"
// // //                       >
// // //                         حذف
// // //                       </button>
// // //                     </td>
// // //                   </tr>
// // //                 ))
// // //               ) : (
// // //                 <tr>
// // //                   <td colSpan="2" className="p-8 text-center text-gray-500">لا توجد تصنيفات حالياً.</td>
// // //                 </tr>
// // //               )}
// // //             </tbody>
// // //           </table>
// // //         </div>
// // //       </div>

// // //       {/* نافذة الإضافة والتعديل */}
// // //       {selectedCat && (
// // //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
// // //           <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
// // //             <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700">
// // //               <h3 className="text-xl font-bold">
// // //                 {selectedCat === 'new' ? 'إضافة تصنيف جديد' : 'تعديل التصنيف'}
// // //               </h3>
// // //               <button onClick={() => setSelectedCat(null)} className="text-gray-500 hover:text-red-500">
// // //                 <XCircle size={24} />
// // //               </button>
// // //             </div>
// // //             <div className="p-6 space-y-4">
// // //               <div>
// // //                 <label className="block text-sm font-medium mb-1">اسم التصنيف</label>
// // //                 <input 
// // //                   type="text" 
// // //                   value={catName} 
// // //                   onChange={(e) => setCatName(e.target.value)} 
// // //                   className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 outline-none focus:border-emerald-500" 
// // //                   placeholder="مثال: فقه الصلاة، المعاملات المالية..." 
// // //                 />
// // //               </div>
// // //             </div>
// // //             <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3 space-x-reverse">
// // //               <button 
// // //                 onClick={() => setSelectedCat(null)} 
// // //                 className="px-5 py-2 rounded border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
// // //               >
// // //                 إلغاء
// // //               </button>
// // //               <button 
// // //                 onClick={handleSave} 
// // //                 className="px-5 py-2 rounded bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
// // //               >
// // //                 حفظ
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* حوار تأكيد الحذف */}
// // //       <ConfirmDialog
// // //         open={Boolean(catToDelete)}
// // //         title="حذف التصنيف"
// // //         message={catToDelete ? `هل أنت متأكد من حذف تصنيف "${catToDelete.name}"؟ لا يمكن التراجع عن هذا الإجراء.` : ''}
// // //         confirmLabel="حذف"
// // //         cancelLabel="إلغاء"
// // //         onCancel={() => setCatToDelete(null)}
// // //         onConfirm={confirmDelete}
// // //       />
// // //     </div>
// // //   );
// // // }

// // // export default AdminCategoriesPage;