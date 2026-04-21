import React, { useState } from 'react';
import { BarChart, LogOut, MessageSquare, Moon, Settings, Sun, Users, Menu, X } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/image/logo.png';

import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminFatwasPage from './pages/AdminFatwasPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';

function AdminApp({ controller }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!controller.authReady) {
    return <div className="min-h-screen flex items-center justify-center text-xl">جاري تحميل لوحة التحكم...</div>;
  }

  const currentPage = pathname.startsWith('/admin/fatwas')
    ? 'fatwas'
    : pathname.startsWith('/admin/categories') ? 'categories'
    : pathname.startsWith('/admin/users')
      ? 'users'
      : pathname.startsWith('/admin/dashboard')
        ? 'dashboard'
        : null;

  if (!currentPage) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className={`min-h-screen flex ${controller.darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`} dir="rtl">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 right-0 z-50 w-64 bg-emerald-900 text-white transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} 
        flex flex-col shadow-2xl md:shadow-none
      `}>
        <div className="p-6 text-center border-b border-emerald-800 relative">
          <button 
            className="md:hidden absolute left-4 top-4 text-emerald-300 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>

          <button onClick={() => { navigate('/'); setIsSidebarOpen(false); }} className="block hover:opacity-80 transition">
            <img src={logo} alt="Logo" className="h-16 w-16 mx-auto mb-2 object-contain" />
            <h2 className="text-2xl font-bold font-tajawal">يستفتونك</h2>
          </button>
          <span className="text-base text-emerald-300 font-medium">لوحة التحكم</span>
        </div>

        <nav className="flex-1 p-4 space-y-4">
          <SidebarButton 
            active={currentPage === 'dashboard'} 
            icon={<BarChart size={20} />} 
            label="الإحصائيات" 
            onClick={() => { navigate('/admin/dashboard'); setIsSidebarOpen(false); }} 
          />
          <SidebarButton 
            active={currentPage === 'fatwas'} 
            icon={<MessageSquare size={20} />} 
            label="الفتاوى" 
            onClick={() => { navigate('/admin/fatwas'); setIsSidebarOpen(false); }} 
            badge={controller.fatwas.filter((fatwa) => fatwa.status === 'new').length} 
          />
          <SidebarButton 
            active={currentPage === 'categories'} 
            icon={<Settings size={20} />} 
            label="التصنيفات" 
            onClick={() => { navigate('/admin/categories'); setIsSidebarOpen(false); }} 
          />
          <SidebarButton 
            active={currentPage === 'users'} 
            icon={<Users size={20} />} 
            label="المستخدمين" 
            onClick={() => { navigate('/admin/users'); setIsSidebarOpen(false); }} 
          />
        </nav>

        <div className="p-4 border-t border-emerald-800">
          <button 
            onClick={async () => { await controller.logout(); navigate('/'); }} 
            className="w-full flex items-center justify-center p-2 rounded bg-emerald-800 hover:bg-red-600 transition-colors text-sm gap-2"
          >
            <LogOut size={16} /> تسجيل خروج
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <button 
              className="md:hidden p-2 mr-2 text-emerald-800 dark:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={28} />
            </button>
            <span className="font-bold text-lg md:hidden">لوحة التحكم</span>
          </div>

          <div className="hidden md:block text-xl font-tajawal font-bold text-emerald-800 dark:text-emerald-400">
            {currentPage === 'dashboard' ? 'ملخص النظام' : currentPage === 'fatwas' ? 'إدارة الفتاوى' : 'إدارة المستخدمين والمشايخ'}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => controller.setDarkMode(!controller.darkMode)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition">
              {controller.darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                {controller.currentUser?.name?.charAt(0) || 'م'}
              </div>
              <span className="text-sm font-medium">{controller.currentUser?.name}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {currentPage === 'dashboard' && <AdminDashboardPage dashboardStats={controller.dashboardStats} fatwas={controller.fatwas} onOpenFatwas={() => navigate('/admin/fatwas')} />}
          {currentPage === 'fatwas' && (
            <AdminFatwasPage 
              currentUser={controller.currentUser} 
              deleteFatwaById={controller.deleteFatwaById} 
              fatwas={controller.fatwas} 
              saveFatwaReply={controller.saveFatwaReply} 
              categories={controller.categories}
            />
          )}
          {currentPage === 'users' && <AdminUsersPage currentUser={controller.currentUser} deleteUserById={controller.deleteUserById} saveUserRecord={controller.saveUserRecord} users={controller.users} />}
          {currentPage === 'categories' && (
            <AdminCategoriesPage 
              categories={controller.categories} 
              saveCategoryRecord={controller.saveCategoryRecord} 
              reorderCategories={controller.reorderCategoryRecords}
              deleteCategoryById={controller.deleteCategoryById} 
            />
          )}
        </div>
      </main>
    </div>
  );
}

function SidebarButton({ active, badge, icon, label, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center p-3 rounded-lg transition gap-4 ${active ? 'bg-emerald-800 text-amber-400' : 'hover:bg-emerald-800'}`}
    >
      <span className="flex items-center shrink-0">
        {icon}
      </span>
      <span className="font-tajawal font-medium flex-1 text-right">{label}</span>
      {badge > 0 && (
        <span className="bg-amber-500 text-emerald-900 text-xs font-bold px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}

export default AdminApp;
// import React, { useState } from 'react';
// import { BarChart, LogOut, MessageSquare, Moon, Settings, Sun, Users, Menu, X } from 'lucide-react';
// import { Navigate, useLocation, useNavigate } from 'react-router-dom';
// import logo from '../../assets/image/logo.png';

// import AdminDashboardPage from './pages/AdminDashboardPage';
// import AdminFatwasPage from './pages/AdminFatwasPage';
// import AdminUsersPage from './pages/AdminUsersPage';
// import AdminCategoriesPage from './pages/AdminCategoriesPage';

// function AdminApp({ controller }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const pathname = location.pathname;
  
//   // حالة للتحكم في فتح وإغلاق القائمة على الجوال (تظهر من اليسار)
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   if (!controller.authReady) {
//     return <div className="min-h-screen flex items-center justify-center text-xl">جاري تحميل لوحة التحكم...</div>;
//   }

//   const currentPage = pathname.startsWith('/admin/fatwas')
//     ? 'fatwas'
//     : pathname.startsWith('/admin/categories') ? 'categories'
//     : pathname.startsWith('/admin/users')
//       ? 'users'
//       : pathname.startsWith('/admin/dashboard')
//         ? 'dashboard'
//         : null;

//   if (!currentPage) {
//     return <Navigate to="/admin/dashboard" replace />;
//   }

//   return (
//     <div className={`min-h-screen flex ${controller.darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
//       {/* طبقة خلفية معتمة تظهر عند فتح القائمة في الجوال فقط */}
//       {isSidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black/50 z-40 md:hidden" 
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       {/* القائمة الجانبية - تم تعديلها لتثبت على اليسار left-0 وتنسحب لليسار -translate-x-full */}
//       <aside className={`
//         fixed inset-y-0 left-0 z-50 w-64 bg-emerald-900 text-white transform transition-transform duration-300 ease-in-out
//         md:relative md:translate-x-0 
//         ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
//         flex flex-col shadow-2xl md:shadow-none
//       `}>
//         <div className="p-6 text-center border-b border-emerald-800 relative">
//           {/* زر إغلاق القائمة للجوال - موضوع في اليمين داخل القائمة اليسرى */}
//           <button 
//             className="md:hidden absolute right-4 top-4 text-emerald-300 hover:text-white"
//             onClick={() => setIsSidebarOpen(false)}
//           >
//             <X size={24} />
//           </button>

//           <img src={logo} alt="Logo" className="h-16 w-16 mx-auto mb-2 object-contain" />
//           <h2 className="text-2xl font-bold font-tajawal">يستفتونك</h2>
//           <span className="text-base text-emerald-300 font-medium">لوحة التحكم</span>
//         </div>

//         <nav className="flex-1 p-4 space-y-2">
//           <SidebarButton 
//             active={currentPage === 'dashboard'} 
//             icon={<BarChart className="ml-3 h-5 w-5" />} 
//             label="الإحصائيات" 
//             onClick={() => { navigate('/admin/dashboard'); setIsSidebarOpen(false); }} 
//           />
//           <SidebarButton 
//             active={currentPage === 'fatwas'} 
//             icon={<MessageSquare className="ml-3 h-5 w-5" />} 
//             label="الفتاوى" 
//             onClick={() => { navigate('/admin/fatwas'); setIsSidebarOpen(false); }} 
//             badge={controller.fatwas.filter((fatwa) => fatwa.status === 'new').length} 
//           />
//           <SidebarButton 
//             active={currentPage === 'categories'} 
//             icon={<Settings className="ml-3 h-5 w-5" />} 
//             label="التصنيفات" 
//             onClick={() => { navigate('/admin/categories'); setIsSidebarOpen(false); }} 
//           />
//           <SidebarButton 
//             active={currentPage === 'users'} 
//             icon={<Users className="ml-3 h-5 w-5" />} 
//             label="المستخدمين" 
//             onClick={() => { navigate('/admin/users'); setIsSidebarOpen(false); }} 
//           />
//         </nav>

//         <div className="p-4 border-t border-emerald-800">
//           <button 
//             onClick={async () => { await controller.logout(); navigate('/'); }} 
//             className="w-full flex items-center justify-center p-2 rounded bg-emerald-800 hover:bg-red-600 transition-colors text-sm"
//           >
//             <LogOut className="ml-2 h-4 w-4" /> تسجيل خروج
//           </button>
//         </div>
//       </aside>

//       {/* المحتوى الرئيسي */}
//       <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6">
//           <div className="flex items-center">
//             {/* زر فتح القائمة - يظهر فقط على الجوال */}
//             <button 
//               className="md:hidden p-2 ml-2 text-emerald-800 dark:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
//               onClick={() => setIsSidebarOpen(true)}
//             >
//               <Menu size={28} />
//             </button>
//             <span className="font-bold text-lg md:hidden">لوحة التحكم</span>
//           </div>

//           <div className="hidden md:block text-xl font-tajawal font-bold text-emerald-800 dark:text-emerald-400">
//             {currentPage === 'dashboard' ? 'ملخص النظام' : currentPage === 'fatwas' ? 'إدارة الفتاوى' : 'إدارة المستخدمين والمشايخ'}
//           </div>

//           <div className="flex items-center space-x-4 space-x-reverse">
//             <button onClick={() => controller.setDarkMode(!controller.darkMode)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition">
//               {controller.darkMode ? <Sun size={20} /> : <Moon size={20} />}
//             </button>
//             <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
//               <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold ml-2">
//                 {controller.currentUser?.name?.charAt(0) || 'م'}
//               </div>
//               <span className="text-sm font-medium">{controller.currentUser?.name}</span>
//             </div>
//           </div>
//         </header>

//         <div className="flex-1 overflow-auto p-6">
//           {currentPage === 'dashboard' && <AdminDashboardPage dashboardStats={controller.dashboardStats} fatwas={controller.fatwas} onOpenFatwas={() => navigate('/admin/fatwas')} />}
//           {currentPage === 'fatwas' && (
//             <AdminFatwasPage 
//               currentUser={controller.currentUser} 
//               deleteFatwaById={controller.deleteFatwaById} 
//               fatwas={controller.fatwas} 
//               saveFatwaReply={controller.saveFatwaReply} 
//               categories={controller.categories}
//             />
//           )}
//           {currentPage === 'users' && <AdminUsersPage currentUser={controller.currentUser} deleteUserById={controller.deleteUserById} saveUserRecord={controller.saveUserRecord} users={controller.users} />}
//           {currentPage === 'categories' && (
//             <AdminCategoriesPage 
//               categories={controller.categories} 
//               saveCategoryRecord={controller.saveCategoryRecord} 
//               deleteCategoryById={controller.deleteCategoryById} 
//             />
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// function SidebarButton({ active, badge, icon, label, onClick }) {
//   return (
//     <button onClick={onClick} className={`w-full flex items-center p-3 rounded-lg transition ${active ? 'bg-emerald-800 text-amber-400' : 'hover:bg-emerald-800'}`}>
//       {icon}
//       {label}
//       {badge > 0 && <span className="mr-auto bg-amber-500 text-emerald-900 text-xs font-bold px-2 py-1 rounded-full">{badge}</span>}
//     </button>
//   );
// }

// export default AdminApp;
// // import React, { useState } from 'react'; // أضفنا useState هنا
// // import { BarChart, LogOut, MessageSquare, Moon, Settings, Sun, Users, Menu, X } from 'lucide-react'; // أضفنا Menu و X
// // import { Navigate, useLocation, useNavigate } from 'react-router-dom';
// // import logo from '../../assets/image/logo.png';

// // import AdminDashboardPage from './pages/AdminDashboardPage';
// // import AdminFatwasPage from './pages/AdminFatwasPage';
// // import AdminUsersPage from './pages/AdminUsersPage';
// // import AdminCategoriesPage from './pages/AdminCategoriesPage';

// // function AdminApp({ controller }) {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const pathname = location.pathname;
  
// //   // حالة للتحكم في فتح وإغلاق القائمة على الجوال
// //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

// //   if (!controller.authReady) {
// //     return <div className="min-h-screen flex items-center justify-center text-xl">جاري تحميل لوحة التحكم...</div>;
// //   }

// //   const currentPage = pathname.startsWith('/admin/fatwas')
// //     ? 'fatwas'
// //     : pathname.startsWith('/admin/categories') ? 'categories'
// //     : pathname.startsWith('/admin/users')
// //       ? 'users'
// //       : pathname.startsWith('/admin/dashboard')
// //         ? 'dashboard'
// //         : null;

// //   if (!currentPage) {
// //     return <Navigate to="/admin/dashboard" replace />;
// //   }

// //   return (
// //     <div className={`min-h-screen flex ${controller.darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
// //       {/* طبقة خلفية معتمة تظهر عند فتح القائمة في الجوال فقط */}
// //       {isSidebarOpen && (
// //         <div 
// //           className="fixed inset-0 bg-black/50 z-40 md:hidden" 
// //           onClick={() => setIsSidebarOpen(false)}
// //         />
// //       )}

// //       {/* القائمة الجانبية المعدلة */}
// //       <aside className={`
// //         fixed inset-y-0 right-0 z-50 w-64 bg-emerald-900 text-white transform transition-transform duration-300 ease-in-out
// //         md:relative md:translate-x-0 
// //         ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
// //         flex flex-col
// //       `}>
// //         <div className="p-6 text-center border-b border-emerald-800 relative">
// //           {/* زر إغلاق القائمة للجوال */}
// //           <button 
// //             className="md:hidden absolute left-4 top-4 text-emerald-300"
// //             onClick={() => setIsSidebarOpen(false)}
// //           >
// //             <X size={24} />
// //           </button>

// //           <img src={logo} alt="Logo" className="h-16 w-16 mx-auto mb-2 object-contain" />
// //           <h2 className="text-2xl font-bold font-tajawal">يستفتونك</h2>
// //           <span className="text-base text-emerald-300">لوحة التحكم</span>
// //         </div>

// //         <nav className="flex-1 p-4 space-y-2">
// //           <SidebarButton 
// //             active={currentPage === 'dashboard'} 
// //             icon={<BarChart className="ml-3 h-5 w-5" />} 
// //             label="الإحصائيات" 
// //             onClick={() => { navigate('/admin/dashboard'); setIsSidebarOpen(false); }} 
// //           />
// //           <SidebarButton 
// //             active={currentPage === 'fatwas'} 
// //             icon={<MessageSquare className="ml-3 h-5 w-5" />} 
// //             label="الفتاوى" 
// //             onClick={() => { navigate('/admin/fatwas'); setIsSidebarOpen(false); }} 
// //             badge={controller.fatwas.filter((fatwa) => fatwa.status === 'new').length} 
// //           />
// //           <SidebarButton 
// //             active={currentPage === 'categories'} 
// //             icon={<Settings className="ml-3 h-5 w-5" />} 
// //             label="التصنيفات" 
// //             onClick={() => { navigate('/admin/categories'); setIsSidebarOpen(false); }} 
// //           />
// //           <SidebarButton 
// //             active={currentPage === 'users'} 
// //             icon={<Users className="ml-3 h-5 w-5" />} 
// //             label="المستخدمين" 
// //             onClick={() => { navigate('/admin/users'); setIsSidebarOpen(false); }} 
// //           />
// //         </nav>

// //         <div className="p-4 border-t border-emerald-800">
// //           <button onClick={async () => { await controller.logout(); navigate('/'); }} className="w-full flex items-center justify-center p-2 rounded bg-emerald-800 hover:bg-red-600 transition text-sm">
// //             <LogOut className="ml-2 h-4 w-4" /> تسجيل خروج
// //           </button>
// //         </div>
// //       </aside>

// //       <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
// //         <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6">
// //           <div className="flex items-center">
// //             {/* زر فتح القائمة الذي يظهر على الجوال فقط */}
// //             <button 
// //               className="md:hidden p-2 ml-2 text-emerald-800 dark:text-emerald-400"
// //               onClick={() => setIsSidebarOpen(true)}
// //             >
// //               <Menu size={28} />
// //             </button>
// //             <span className="font-bold text-lg md:hidden">لوحة التحكم</span>
// //           </div>

// //           <div className="hidden md:block text-xl font-tajawal font-bold text-emerald-800 dark:text-emerald-400">
// //             {currentPage === 'dashboard' ? 'ملخص النظام' : currentPage === 'fatwas' ? 'إدارة الفتاوى' : 'إدارة المستخدمين والمشايخ'}
// //           </div>

// //           <div className="flex items-center space-x-4 space-x-reverse">
// //             <button onClick={() => controller.setDarkMode(!controller.darkMode)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition">
// //               {controller.darkMode ? <Sun size={20} /> : <Moon size={20} />}
// //             </button>
// //             <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
// //               <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold ml-2">
// //                 {controller.currentUser?.name?.charAt(0) || 'م'}
// //               </div>
// //               <span className="text-sm font-medium">{controller.currentUser?.name}</span>
// //             </div>
// //           </div>
// //         </header>

// //         <div className="flex-1 overflow-auto p-6">
// //           {currentPage === 'dashboard' && <AdminDashboardPage dashboardStats={controller.dashboardStats} fatwas={controller.fatwas} onOpenFatwas={() => navigate('/admin/fatwas')} />}
// //           {currentPage === 'fatwas' && (
// //             <AdminFatwasPage 
// //               currentUser={controller.currentUser} 
// //               deleteFatwaById={controller.deleteFatwaById} 
// //               fatwas={controller.fatwas} 
// //               saveFatwaReply={controller.saveFatwaReply} 
// //               categories={controller.categories}
// //             />
// //           )}
// //           {currentPage === 'users' && <AdminUsersPage currentUser={controller.currentUser} deleteUserById={controller.deleteUserById} saveUserRecord={controller.saveUserRecord} users={controller.users} />}
// //           {currentPage === 'categories' && (
// //             <AdminCategoriesPage 
// //               categories={controller.categories} 
// //               saveCategoryRecord={controller.saveCategoryRecord} 
// //               deleteCategoryById={controller.deleteCategoryById} 
// //             />
// //           )}
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }

// // function SidebarButton({ active, badge, icon, label, onClick }) {
// //   return (
// //     <button onClick={onClick} className={`w-full flex items-center p-3 rounded-lg transition ${active ? 'bg-emerald-800 text-amber-400' : 'hover:bg-emerald-800'}`}>
// //       {icon}
// //       {label}
// //       {badge > 0 && <span className="mr-auto bg-amber-500 text-emerald-900 text-xs font-bold px-2 py-1 rounded-full">{badge}</span>}
// //     </button>
// //   );
// // }

// // export default AdminApp;
// // // import { BarChart, BookOpen, LogOut, MessageSquare, Moon, Settings, Sun, Users } from 'lucide-react';
// // // import { Navigate, useLocation, useNavigate } from 'react-router-dom';
// // // import logo from '../../assets/image/logo.png'; // قم بتعديل المسار حسب مكان الصورة لديك

// // // import AdminDashboardPage from './pages/AdminDashboardPage';
// // // import AdminFatwasPage from './pages/AdminFatwasPage';
// // // import AdminUsersPage from './pages/AdminUsersPage';
// // // import AdminCategoriesPage from './pages/AdminCategoriesPage';
// // // function AdminApp({ controller }) {
// // //   const navigate = useNavigate();
// // //   const location = useLocation();
// // //   const pathname = location.pathname;

// // //   if (!controller.authReady) {
// // //     return <div className="min-h-screen flex items-center justify-center text-xl">جاري تحميل لوحة التحكم...</div>;
// // //   }

// // //   const currentPage = pathname.startsWith('/admin/fatwas')
// // //     ? 'fatwas'
// // //     :pathname.startsWith('/admin/categories')?'categories'
// // //     : pathname.startsWith('/admin/users')
// // //       ? 'users'
// // //       : pathname.startsWith('/admin/dashboard')
// // //         ? 'dashboard'
// // //         : null;

// // //   if (!currentPage) {
// // //     return <Navigate to="/admin/dashboard" replace />;
// // //   }

// // //   return (
// // //     <div className={`min-h-screen flex ${controller.darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
// // //       <aside className="w-64 bg-emerald-900 text-white flex-shrink-0 hidden md:flex flex-col">
// // //         <div className="p-6 text-center border-b border-emerald-800">
// // //           <img 
// // //             src={logo} 
// // //             alt="Logo" 
// // //             className="h-16 w-16 mx-auto mb-2 object-contain" 
// // //           />
// // //           <h2 className="text-2xl font-bold font-tajawal">يستفتونك</h2>
// // //           {/* <span className="text-xs text-emerald-300">لوحة التحكم</span> */}
// // //           <span className="text-base text-emerald-300">لوحة التحكم</span>
// // //         </div>
// // //         <nav className="flex-1 p-4 space-y-2">
// // //           <SidebarButton active={currentPage === 'dashboard'} icon={<BarChart className="ml-3 h-5 w-5" />} label="الإحصائيات" onClick={() => navigate('/admin/dashboard')} />
// // //           <SidebarButton active={currentPage === 'fatwas'} icon={<MessageSquare className="ml-3 h-5 w-5" />} label="الفتاوى" onClick={() => navigate('/admin/fatwas')} badge={controller.fatwas.filter((fatwa) => fatwa.status === 'new').length} />
// // //           <SidebarButton 
// // //   active={currentPage === 'categories'} 
// // //   icon={<Settings className="ml-3 h-5 w-5" />} 
// // //   label="التصنيفات" 
// // //   onClick={() => navigate('/admin/categories')} 
// // // />
// // //           <SidebarButton active={currentPage === 'users'} icon={<Users className="ml-3 h-5 w-5" />} label="المستخدمين" onClick={() => navigate('/admin/users')} />
// // //         </nav>
// // //         <div className="p-4 border-t border-emerald-800">
// // //           <button onClick={async () => { await controller.logout(); navigate('/'); }} className="w-full flex items-center justify-center p-2 rounded bg-emerald-800 hover:bg-red-600 transition text-sm">
// // //             <LogOut className="ml-2 h-4 w-4" /> تسجيل خروج
// // //           </button>
// // //         </div>
// // //       </aside>

// // //       <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
// // //         <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6">
// // //           <div className="flex items-center md:hidden">
// // //             <span className="font-bold text-lg">لوحة التحكم</span>
// // //           </div>
// // //           <div className="hidden md:block text-xl font-tajawal font-bold text-emerald-800 dark:text-emerald-400">
// // //             {currentPage === 'dashboard' ? 'ملخص النظام' : currentPage === 'fatwas' ? 'إدارة الفتاوى' : 'إدارة المستخدمين والمشايخ'}
// // //           </div>
// // //           <div className="flex items-center space-x-4 space-x-reverse">
// // //             <button onClick={() => controller.setDarkMode(!controller.darkMode)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition">
// // //               {controller.darkMode ? <Sun size={20} /> : <Moon size={20} />}
// // //             </button>
// // //             <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
// // //               <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold ml-2">
// // //                 {controller.currentUser?.name?.charAt(0) || 'م'}
// // //               </div>
// // //               <span className="text-sm font-medium">{controller.currentUser?.name}</span>
// // //             </div>
// // //           </div>
// // //         </header>

// // //         <div className="flex-1 overflow-auto p-6">
          
// // //           {currentPage === 'dashboard' && <AdminDashboardPage dashboardStats={controller.dashboardStats} fatwas={controller.fatwas} onOpenFatwas={() => navigate('/admin/fatwas')} />}
          
// // //           {/* {currentPage === 'fatwas' && <AdminFatwasPage currentUser={controller.currentUser} deleteFatwaById={controller.deleteFatwaById} fatwas={controller.fatwas} saveFatwaReply={controller.saveFatwaReply} />} */}
// // //           {currentPage === 'fatwas' && (
// // //   <AdminFatwasPage 
// // //     currentUser={controller.currentUser} 
// // //     deleteFatwaById={controller.deleteFatwaById} 
// // //     fatwas={controller.fatwas} 
// // //     saveFatwaReply={controller.saveFatwaReply} 
// // //     categories={controller.categories} // <--- ضيف هذا السطر هنا
// // //   />
// // // )}
// // //           {currentPage === 'users' && <AdminUsersPage currentUser={controller.currentUser} deleteUserById={controller.deleteUserById} saveUserRecord={controller.saveUserRecord} users={controller.users} />}
// // //        {currentPage === 'categories' && (
// // //   <AdminCategoriesPage 
// // //     categories={controller.categories} 
// // //     saveCategoryRecord={controller.saveCategoryRecord} 
// // //     deleteCategoryById={controller.deleteCategoryById} 
// // //   />
// // // )}
// // //         </div>
// // //       </main>
// // //     </div>
// // //   );
// // // }

// // // function SidebarButton({ active, badge, icon, label, onClick }) {
// // //   return (
// // //     <button onClick={onClick} className={`w-full flex items-center p-3 rounded-lg transition ${active ? 'bg-emerald-800 text-amber-400' : 'hover:bg-emerald-800'}`}>
// // //       {icon}
// // //       {label}
// // //       {badge > 0 && <span className="mr-auto bg-amber-500 text-emerald-900 text-xs font-bold px-2 py-1 rounded-full">{badge}</span>}
// // //     </button>
// // //   );
// // // }

// // // export default AdminApp;
