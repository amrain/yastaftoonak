import { ChevronLeft, ChevronRight, Clock, Filter, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import IslamicStar from '../../../shared/icons/IslamicStar';

function PublishedFatwas({ fatwas, isHomePage, onFatwaClick, onOpenArchive, themeColors, categories = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('الكل');
  const [currentPage, setCurrentPage] = useState(1);

  const published = useMemo(
    () =>
      fatwas.filter(
        (fatwa) =>
          fatwa.status === 'published' &&
          (filterCategory === 'الكل' || fatwa.category === filterCategory) &&
          (fatwa.question.includes(searchTerm) || fatwa.answer.includes(searchTerm)),
      ),
    [fatwas, searchTerm, filterCategory],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory]);

  const itemsPerPage = isHomePage ? 6 : 15;
  const totalPages = Math.max(1, Math.ceil(published.length / itemsPerPage));
  const currentItems = published.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isHomePage ? 'py-20' : 'pb-20'}`}>
      <div className="text-center mb-16 relative">
        <IslamicStar className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 opacity-5 text-amber-500" />
        <h2 className={`text-3xl md:text-4xl font-bold ${themeColors.primaryText} mb-4 font-reem relative z-10`}>
          {isHomePage ? 'أحدث الفتاوى' : 'أرشيف الأسئلة المجاب عنها'}
        </h2>
        <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full relative z-10" />
      </div>

      {!isHomePage && (
        <div className="flex flex-col md:flex-row gap-4 mb-10 justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="relative w-full md:w-1/2">
            <Search className={`absolute right-3 top-3 h-5 w-5 ${themeColors.textMuted}`} />
            <input type="text" placeholder="ابحث في أرشيف الفتاوى..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className={`w-full pr-10 p-4 rounded-xl border ${themeColors.border} ${themeColors.card} ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm`} />
          </div>
          <div className="relative w-full md:w-1/4">
            <Filter className={`absolute right-3 top-3.5 h-5 w-5 ${themeColors.textMuted}`} />
            <select value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)} className={`w-full pr-10 p-4 rounded-xl border ${themeColors.border} ${themeColors.card} ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none appearance-none shadow-sm`}>
              <option value="الكل">جميع التصنيفات</option>
              {categories.map((cat) => (
                <option key={cat.id || cat._id || cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {currentItems.length > 0 ? (
        isHomePage ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map((fatwa) => (
              <div key={fatwa.id} onClick={() => onFatwaClick(fatwa.id)} className={`${themeColors.card} rounded-tl-3xl rounded-br-3xl shadow-md hover:shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col`}>
                <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-emerald-600" />
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                      {fatwa.category}
                    </span>
                    <span className={`text-xs ${themeColors.textMuted} flex items-center`}><Clock className="w-3 h-3 ml-1" />{fatwa.date}</span>
                  </div>
                  
                  {/* حاوية نص السؤال مع تحديد الارتفاع والقص */}
                  <div className="mb-6 relative flex-1 min-h-[120px]">
                    <div className="absolute -right-2 top-0 bottom-0 w-1 bg-amber-400 rounded-full opacity-60" />
                    <h3
                      className={`!font-salaf text-xl md:text-2xl font-normal ${themeColors.textMain} leading-[1.8] text-right px-4 line-clamp-3 overflow-hidden`}
                      title={fatwa.question}
                    >
                      <span className="text-amber-500 ml-3 font-sans text-sm border border-amber-200 bg-amber-50 dark:bg-amber-900/30 w-8 h-8 inline-flex items-center justify-center rounded-full flex-shrink-0 align-middle">
                        س
                      </span>
                      {fatwa.question}
                    </h3>
                  </div>

                  <div className="pt-4 mt-auto border-t border-gray-100 dark:border-gray-700">
                    <span className="text-sm text-emerald-600 font-bold flex items-center group-hover:text-emerald-500 transition-colors">
                      الاطلاع على الإجابة <ChevronLeft className="w-4 h-4 mr-1" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-500">
            {currentItems.map((fatwa, index) => (
              <div key={fatwa.id} onClick={() => onFatwaClick(fatwa.id)} className={`${themeColors.card} p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center gap-4 group`}>
                <div className="flex-shrink-0 flex items-center justify-between md:justify-start">
                  <div className="flex items-center">
                    <span className="text-gray-300 dark:text-gray-600 font-bold font-tajawal text-lg ml-4 w-6 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</span>
                    <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 px-3 py-1 rounded-full text-sm font-bold w-24 text-center">
                      {fatwa.category}
                    </span>
                  </div>
                  <div className="md:hidden text-xs text-gray-500 flex items-center"><Clock className="w-3 h-3 ml-1" />{fatwa.date}</div>
                </div>
                <div className="flex-1 px-4 border-r-2 border-transparent group-hover:border-amber-400 transition-colors overflow-hidden">
                  <h3
                    className={`!font-salaf text-lg md:text-xl font-normal ${themeColors.textMain} leading-relaxed text-right line-clamp-1`}
                  >
                    <span className="text-amber-500 ml-3 font-sans text-sm border border-amber-200 bg-amber-50 dark:bg-amber-900/30 w-7 h-7 inline-flex items-center justify-center rounded-full flex-shrink-0">
                      س
                    </span>
                    {fatwa.question}
                  </h3>
                </div>
                <div className="hidden md:flex flex-shrink-0 text-sm text-gray-500 items-center justify-end w-32 border-r border-gray-100 dark:border-gray-700 pr-4">
                  <Clock className="w-4 h-4 ml-1.5" /> {fatwa.date}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className={`text-center py-16 ${themeColors.textMuted} bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700`}>
          <IslamicStar className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-xl font-tajawal">لا توجد فتاوى مطابقة لبحثك في الوقت الحالي.</p>
        </div>
      )}

      {isHomePage ? (
        published.length > 6 && (
          <div className="mt-12 text-center">
            <button onClick={onOpenArchive} className="inline-flex items-center bg-white dark:bg-gray-800 border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 font-bold py-3 px-8 rounded-full transition-colors shadow-sm">
              تصفح كافة الفتاوى ({published.length}) <ChevronLeft className="w-5 h-5 mr-2" />
            </button>
          </div>
        )
      ) : (
        totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center space-x-2 space-x-reverse">
            <button onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="flex items-center px-4 font-bold text-gray-700 dark:text-gray-300">صفحة {currentPage} من {totalPages}</div>
            <button onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default PublishedFatwas;
// import { ChevronLeft, ChevronRight, Clock, Filter, Search } from 'lucide-react';
// import { useEffect, useMemo, useState } from 'react';
// // تم حذف استيراد CATEGORIES الثابتة
// import IslamicStar from '../../../shared/icons/IslamicStar';

// // إضافة categories إلى الـ props المستلمة
// function PublishedFatwas({ fatwas, isHomePage, onFatwaClick, onOpenArchive, themeColors, categories = [] }) {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterCategory, setFilterCategory] = useState('الكل');
//   const [currentPage, setCurrentPage] = useState(1);

//   const published = useMemo(
//     () =>
//       fatwas.filter(
//         (fatwa) =>
//           fatwa.status === 'published' &&
//           (filterCategory === 'الكل' || fatwa.category === filterCategory) &&
//           (fatwa.question.includes(searchTerm) || fatwa.answer.includes(searchTerm)),
//       ),
//     [fatwas, searchTerm, filterCategory],
//   );

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, filterCategory]);

//   const itemsPerPage = isHomePage ? 6 : 15;
//   const totalPages = Math.max(1, Math.ceil(published.length / itemsPerPage));
//   const currentItems = published.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   return (
//     <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isHomePage ? 'py-20' : 'pb-20'}`}>
//       <div className="text-center mb-16 relative">
//         <IslamicStar className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 opacity-5 text-amber-500" />
//         <h2 className={`text-3xl md:text-4xl font-bold ${themeColors.primaryText} mb-4 font-reem relative z-10`}>
//           {isHomePage ? 'أحدث الفتاوى' : 'أرشيف الأسئلة المجاب عنها'}
//         </h2>
//         <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full relative z-10" />
//       </div>

//       {!isHomePage && (
//         <div className="flex flex-col md:flex-row gap-4 mb-10 justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
//           <div className="relative w-full md:w-1/2">
//             <Search className={`absolute right-3 top-3 h-5 w-5 ${themeColors.textMuted}`} />
//             <input type="text" placeholder="ابحث في أرشيف الفتاوى..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className={`w-full pr-10 p-4 rounded-xl border ${themeColors.border} ${themeColors.card} ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm`} />
//           </div>
//           <div className="relative w-full md:w-1/4">
//             <Filter className={`absolute right-3 top-3.5 h-5 w-5 ${themeColors.textMuted}`} />
//             <select value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)} className={`w-full pr-10 p-4 rounded-xl border ${themeColors.border} ${themeColors.card} ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none appearance-none shadow-sm`}>
//               <option value="الكل">جميع التصنيفات</option>
//               {/* تعديل هنا لاستخدام القائمة الديناميكية */}
//               {categories.map((cat) => (
//                 <option key={cat.id || cat._id || cat.name} value={cat.name}>
//                   {cat.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       )}

//       {currentItems.length > 0 ? (
//         isHomePage ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {currentItems.map((fatwa) => (
//               <div key={fatwa.id} onClick={() => onFatwaClick(fatwa.id)} className={`${themeColors.card} rounded-tl-3xl rounded-br-3xl shadow-md hover:shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col`}>
//                 <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-emerald-600" />
//                 <div className="p-6 flex-1 flex flex-col">
//                   <div className="flex justify-between items-start mb-4">
//                     <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
//                       {fatwa.category}
//                     </span>
//                     <span className={`text-xs ${themeColors.textMuted} flex items-center`}><Clock className="w-3 h-3 ml-1" />{fatwa.date}</span>
//                   </div>
//                   <div className="mb-5 relative flex-1">
//                     <div className="absolute -right-4 md:-right-6 top-0 bottom-0 w-1 bg-amber-400 rounded-l-md opacity-80" />
//                     <h3
//                       className={`!font-salaf text-2xl md:text-3xl font-normal ${themeColors.textMain} leading-[2] text-justify pr-4 md:pr-6`}
//                     >
//                       <span className="text-amber-500 ml-3 font-sans text-base border border-amber-200 bg-amber-50 dark:bg-amber-900/30 w-8 h-8 inline-flex items-center justify-center rounded-full">
//                         س
//                       </span>
//                       {fatwa.question}
//                     </h3>
//                   </div>
//                   <div className="pt-3 mt-auto border-t border-gray-100 dark:border-gray-700">
//                     <span className="text-sm text-emerald-600 font-bold flex items-center group-hover:text-emerald-500 transition-colors">
//                       الاطلاع على الإجابة <ChevronLeft className="w-4 h-4 mr-1" />
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="space-y-4 animate-in fade-in duration-500">
//             {currentItems.map((fatwa, index) => (
//               <div key={fatwa.id} onClick={() => onFatwaClick(fatwa.id)} className={`${themeColors.card} p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center gap-4 group`}>
//                 <div className="flex-shrink-0 flex items-center justify-between md:justify-start">
//                   <div className="flex items-center">
//                     <span className="text-gray-300 dark:text-gray-600 font-bold font-tajawal text-lg ml-4 w-6 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</span>
//                     <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 px-3 py-1 rounded-full text-sm font-bold w-24 text-center">
//                       {fatwa.category}
//                     </span>
//                   </div>
//                   <div className="md:hidden text-xs text-gray-500 flex items-center"><Clock className="w-3 h-3 ml-1" />{fatwa.date}</div>
//                 </div>
//                 <div className="flex-1 px-2 border-r-2 border-transparent group-hover:border-amber-400 transition-colors">
//                   <h3
//                     className={`!font-salaf text-xl md:text-2xl font-normal ${themeColors.textMain} leading-[2] text-justify pr-4 md:pr-6`}
//                   >
//                     <span className="text-amber-500 ml-3 font-sans text-base border border-amber-200 bg-amber-50 dark:bg-amber-900/30 w-8 h-8 inline-flex items-center justify-center rounded-full">
//                       س
//                     </span>
//                     {fatwa.question}
//                   </h3>
//                 </div>
//                 <div className="hidden md:flex flex-shrink-0 text-sm text-gray-500 items-center justify-end w-32 border-r border-gray-100 dark:border-gray-700 pr-4">
//                   <Clock className="w-4 h-4 ml-1.5" /> {fatwa.date}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )
//       ) : (
//         <div className={`text-center py-16 ${themeColors.textMuted} bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700`}>
//           <IslamicStar className="w-16 h-16 mx-auto mb-4 opacity-20" />
//           <p className="text-xl font-tajawal">لا توجد فتاوى مطابقة لبحثك في الوقت الحالي.</p>
//         </div>
//       )}

//       {isHomePage ? (
//         published.length > 6 && (
//           <div className="mt-12 text-center">
//             <button onClick={onOpenArchive} className="inline-flex items-center bg-white dark:bg-gray-800 border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 font-bold py-3 px-8 rounded-full transition-colors shadow-sm">
//               تصفح كافة الفتاوى ({published.length}) <ChevronLeft className="w-5 h-5 mr-2" />
//             </button>
//           </div>
//         )
//       ) : (
//         totalPages > 1 && (
//           <div className="mt-12 flex justify-center items-center space-x-2 space-x-reverse">
//             <button onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors">
//               <ChevronRight className="w-5 h-5" />
//             </button>
//             <div className="flex items-center px-4 font-bold text-gray-700 dark:text-gray-300">صفحة {currentPage} من {totalPages}</div>
//             <button onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors">
//               <ChevronLeft className="w-5 h-5" />
//             </button>
//           </div>
//         )
//       )}
//     </div>
//   );
// }

// export default PublishedFatwas;
