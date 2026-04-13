import { BookOpen, CheckCircle, Clock, Home, MapPin, Calendar, FileText } from 'lucide-react';

function AdminDashboardPage({ dashboardStats, fatwas, onOpenFatwas }) {
  // حساب الإحصائيات إذا لم تتوفر من الـ props
  const stats = dashboardStats?.stats || {
    total: fatwas.length,
    new: fatwas.filter((fatwa) => fatwa.status === 'new').length,
    answered: fatwas.filter((fatwa) => fatwa.status === 'published' || fatwa.status === 'answered').length,
    gaza: fatwas.filter((fatwa) => fatwa.location === 'قطاع غزة').length,
  };
  
  // جلب آخر 5 فتاوى
  const latestFatwas = dashboardStats?.latestFatwas || fatwas.slice(0, 5);

  return (
    <div className="space-y-10 font-tajawal pb-10" dir="rtl">
      {/* العنوان الرئيسي للملخص */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-emerald-800 dark:text-emerald-400">ملخص النظام</h2>
        <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full" />
      </div>

      {/* بطاقات الإحصائيات (Stat Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<BookOpen className="h-6 w-6" />} 
          color="bg-blue-50 text-blue-600 border-blue-100" 
          label="إجمالي الفتاوى" 
          value={stats.total} 
        />
        <StatCard 
          icon={<Clock className="h-6 w-6" />} 
          color="bg-amber-50 text-amber-600 border-amber-100" 
          label="بانتظار الرد" 
          value={stats.new} 
        />
        <StatCard 
          icon={<CheckCircle className="h-6 w-6" />} 
          color="bg-emerald-50 text-emerald-600 border-emerald-100" 
          label="تمت الإجابة" 
          value={stats.answered} 
        />
        <StatCard 
          icon={<Home className="h-6 w-6" />} 
          color="bg-purple-50 text-purple-600 border-purple-100" 
          label="من غزة" 
          value={stats.gaza} 
        />
      </div>

      {/* جدول أحدث الفتاوى */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xl font-black text-gray-800 dark:text-gray-200">أحدث الفتاوى الواردة</h3>
          <button 
            onClick={onOpenFatwas} 
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
          >
            عرض الكل
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {latestFatwas.length > 0 ? (
              latestFatwas.map((fatwa) => (
                <div 
                  key={fatwa.id} 
                  className="p-6 hover:bg-emerald-50/20 dark:hover:bg-gray-750 transition-all flex flex-col md:flex-row justify-between md:items-center gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <p className="font-bold text-gray-800 dark:text-white text-lg leading-relaxed">
                      {fatwa.question}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} className="text-emerald-500" /> {fatwa.name || 'مجهول'} • {fatwa.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {fatwa.date}
                      </span>
                    </div>
                  </div>
                  
                  <div className="shrink-0">
                    <span className={`px-4 py-1.5 text-xs rounded-full font-black uppercase tracking-wider ${
                      fatwa.status === 'new' 
                        ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}>
                      {fatwa.status === 'new' ? 'جديدة' : 'منشورة'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center text-gray-400">
                <FileText size={40} className="mx-auto mb-3 opacity-20" />
                <p className="font-bold">لا توجد بيانات متاحة حالياً</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// مكون البطاقة الموحد
function StatCard({ color, icon, label, value }) {
  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5 transition-transform hover:scale-[1.02]`}>
      <div className={`w-14 h-14 rounded-2xl ${color} border flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 mb-1">{label}</p>
        <h3 className="text-3xl font-black text-gray-800 dark:text-white leading-none">
          {value}
        </h3>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
//5
// import { BookOpen, CheckCircle, Clock, Home } from 'lucide-react';

// function AdminDashboardPage({ dashboardStats, fatwas, onOpenFatwas }) {
//   const stats = dashboardStats?.stats || {
//     total: fatwas.length,
//     new: fatwas.filter((fatwa) => fatwa.status === 'new').length,
//     answered: fatwas.filter((fatwa) => fatwa.status === 'published' || fatwa.status === 'answered').length,
//     gaza: fatwas.filter((fatwa) => fatwa.location === 'قطاع غزة').length,
//   };
//   const latestFatwas = dashboardStats?.latestFatwas || fatwas.slice(0, 5);

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <StatCard icon={<BookOpen className="h-8 w-8" />} color="bg-blue-100 text-blue-600" label="إجمالي الفتاوى" value={stats.total} />
//         <StatCard icon={<Clock className="h-8 w-8" />} color="bg-amber-100 text-amber-600" label="بانتظار الرد" value={stats.new} />
//         <StatCard icon={<CheckCircle className="h-8 w-8" />} color="bg-emerald-100 text-emerald-600" label="تمت الإجابة" value={stats.answered} />
//         <StatCard icon={<Home className="h-8 w-8" />} color="bg-purple-100 text-purple-600" label="من غزة" value={stats.gaza} />
//       </div>

//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
//         <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
//           <h3 className="text-lg font-bold">أحدث الفتاوى الواردة</h3>
//           <button onClick={onOpenFatwas} className="text-sm text-emerald-600 hover:underline">
//             عرض الكل
//           </button>
//         </div>
//         <div className="divide-y divide-gray-100 dark:divide-gray-700">
//           {latestFatwas.map((fatwa) => (
//             <div key={fatwa.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition flex justify-between items-center">
//               <div>
//                 <p className="font-medium text-gray-900 dark:text-white truncate max-w-md">{fatwa.question}</p>
//                 <p className="text-sm text-gray-500 mt-1">{fatwa.name || 'مجهول'} • {fatwa.location} • {fatwa.date}</p>
//               </div>
//               <span className={`px-3 py-1 text-xs rounded-full font-medium ${fatwa.status === 'new' ? 'bg-amber-100 text-amber-800' : fatwa.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
//                 {fatwa.status === 'new' ? 'جديدة' : fatwa.status === 'published' ? 'منشورة' : fatwa.status}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// function StatCard({ color, icon, label, value }) {
//   return (
//     <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
//       <div className={`p-4 rounded-full ${color} ml-4`}>{icon}</div>
//       <div>
//         <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
//         <h3 className="text-2xl font-bold">{value}</h3>
//       </div>
//     </div>
//   );
// }

// export default AdminDashboardPage;
