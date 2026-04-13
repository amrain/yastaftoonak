import { AtSign, Cog, Key, ShieldCheck, User, XCircle } from 'lucide-react';
import { useState } from 'react';
import ConfirmDialog from '../../../shared/ui/ConfirmDialog';
import { useToast } from '../../../shared/ui/ToastProvider';

function AdminUsersPage({ currentUser, deleteUserById, saveUserRecord, users }) {
  const { addToast } = useToast();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState({ username: '', password: '', name: '', role: 'sheikh' });
  const [userToDelete, setUserToDelete] = useState(null);

  const openModal = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setUserData({ ...user, password: '' }); // نترك كلمة المرور فارغة عند التعديل للأمان
      return;
    }
    setSelectedUser('new');
    setUserData({ username: '', password: '', name: '', role: 'sheikh' });
  };

  const saveUser = () => {
    saveUserRecord(selectedUser, userData)
      .then(() => {
        addToast(selectedUser === 'new' ? 'تم إنشاء المستخدم بنجاح.' : 'تم تحديث المستخدم بنجاح.', 'success');
        setSelectedUser(null);
      })
      .catch((error) => {
        addToast(error.message, 'error');
      });
  };

  const requestDeleteUser = (user) => {
    if (currentUser.id === user.id) {
      addToast('لا يمكنك حذف حسابك الحالي.', 'error');
      return;
    }
    setUserToDelete(user);
  };

  const deleteUser = () => {
    deleteUserById(userToDelete.id)
      .then(() => {
        addToast('تم حذف المستخدم.', 'success');
      })
      .catch((error) => {
        addToast(error.message, 'error');
      })
      .finally(() => {
        setUserToDelete(null);
      });
  };

  return (
    <div className="space-y-6 font-tajawal">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">إدارة المستخدمين والمشايخ</h2>
        <button 
          onClick={() => openModal()} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg shadow-md transition-all font-bold flex items-center gap-2"
        >
          <span>+</span> إضافة شيخ / مستخدم
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300">
              <tr>
                <th className="p-4 font-semibold text-sm">الاسم</th>
                <th className="p-4 font-semibold text-sm">معرّف الدخول</th>
                <th className="p-4 font-semibold text-sm text-center">كلمة المرور</th>
                <th className="p-4 font-semibold text-sm text-center">الصلاحية</th>
                <th className="p-4 font-semibold text-sm text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-750 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">{user.name}</span>
                      {currentUser.id === user.id && (
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 px-2 py-0.5 rounded-full w-fit mt-1">
                          أنت حالياً
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300" dir="ltr">
                      @{user.username}
                    </span>
                  </td>
                  <td className="p-4 text-center text-gray-300 dark:text-gray-600 tracking-widest font-serif">
                    ••••••••
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {user.role === 'admin' ? 'مدير نظام' : 'مفتي / شيخ'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => openModal(user)} 
                        className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold text-sm transition"
                      >
                        <Cog size={14} /> تعديل
                      </button>
                      {currentUser.id !== user.id && (
                        <button 
                          onClick={() => requestDeleteUser(user)} 
                          className="flex items-center gap-1 text-red-500 hover:text-red-600 font-bold text-sm transition"
                        >
                          <XCircle size={14} /> حذف
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-emerald-50/30 dark:bg-gray-700/50">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {selectedUser === 'new' ? 'إضافة مستخدم جديد' : 'تعديل بيانات المستخدم'}
              </h3>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-red-500 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400">الاسم الكامل (يظهر للعامة)</label>
                <div className="relative">
                  <User className="absolute right-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    value={userData.name} 
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })} 
                    className="w-full pr-10 p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
                    placeholder="مثال: الشيخ عبد الله أحمد" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400">اسم المستخدم</label>
                <div className="relative">
                  <AtSign className="absolute right-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    value={userData.username} 
                    onChange={(e) => setUserData({ ...userData, username: e.target.value })} 
                    className="w-full pr-10 p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-left font-mono" 
                    dir="ltr" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400">كلمة المرور الجديدة</label>
                <div className="relative">
                  <Key className="absolute right-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="password" 
                    value={userData.password} 
                    onChange={(e) => setUserData({ ...userData, password: e.target.value })} 
                    className="w-full pr-10 p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-left font-mono" 
                    dir="ltr" 
                    placeholder={selectedUser === 'new' ? '' : 'اتركها فارغة لعدم التغيير'}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400">الصلاحية</label>
                <div className="relative">
                  <ShieldCheck className="absolute right-3 top-3 text-gray-400" size={18} />
                  <select 
                    value={userData.role} 
                    onChange={(e) => setUserData({ ...userData, role: e.target.value })} 
                    className="w-full pr-10 p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none appearance-none cursor-pointer"
                  >
                    <option value="sheikh">مفتي / شيخ</option>
                    <option value="admin">مدير نظام</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedUser(null)} 
                className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-600 transition-all shadow-sm"
              >
                إلغاء
              </button>
              <button 
                onClick={saveUser} 
                className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-md active:scale-95"
              >
                حفظ البيانات
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(userToDelete)}
        title="حذف المستخدم"
        message={userToDelete ? `هل أنت متأكد من حذف حساب "${userToDelete.name}"؟ لا يمكن التراجع عن هذه الخطوة.` : ''}
        confirmLabel="تأكيد الحذف"
        cancelLabel="إلغاء"
        onCancel={() => setUserToDelete(null)}
        onConfirm={deleteUser}
      />
    </div>
  );
}

export default AdminUsersPage;
// import { AtSign, Cog, Key, ShieldCheck, User, XCircle } from 'lucide-react';
// import { useState } from 'react';
// import ConfirmDialog from '../../../shared/ui/ConfirmDialog';
// import { useToast } from '../../../shared/ui/ToastProvider';

// function AdminUsersPage({ currentUser, deleteUserById, saveUserRecord, users }) {
//   const { addToast } = useToast();
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [userData, setUserData] = useState({ username: '', password: '', name: '', role: 'sheikh' });
//   const [userToDelete, setUserToDelete] = useState(null);

//   const openModal = (user = null) => {
//     if (user) {
//       setSelectedUser(user);
//       setUserData(user);
//       return;
//     }

//     setSelectedUser('new');
//     setUserData({ username: '', password: '', name: '', role: 'sheikh' });
//   };

//   const saveUser = () => {
//     saveUserRecord(selectedUser, userData)
//       .then(() => {
//         addToast(selectedUser === 'new' ? 'تم إنشاء المستخدم بنجاح.' : 'تم تحديث المستخدم بنجاح.', 'success');
//         setSelectedUser(null);
//       })
//       .catch((error) => {
//         addToast(error.message, 'error');
//       });
//   };

//   const requestDeleteUser = (user) => {
//     if (currentUser.id === user.id) {
//       addToast('لا يمكنك حذف حسابك الحالي.', 'error');
//       return;
//     }
//     setUserToDelete(user);
//   };

//   const deleteUser = () => {
//     deleteUserById(userToDelete.id)
//       .then(() => {
//         addToast('تم حذف المستخدم.', 'success');
//       })
//       .catch((error) => {
//         addToast(error.message, 'error');
//       })
//       .finally(() => {
//         setUserToDelete(null);
//       });
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">إدارة المستخدمين والمشايخ</h2>
//         <button onClick={() => openModal()} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow transition font-bold">
//           + إضافة شيخ / مستخدم
//         </button>
//       </div>

//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-right">
//             <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300">
//               <tr>
//                 <th className="p-4 font-medium"><div className="flex items-center"><User className="w-4 h-4 ml-2" /> الاسم</div></th>
//                 <th className="p-4 font-medium"><div className="flex items-center"><AtSign className="w-4 h-4 ml-2" /> معرّف الدخول</div></th>
//                 <th className="p-4 font-medium"><div className="flex items-center"><Key className="w-4 h-4 ml-2" /> كلمة المرور</div></th>
//                 <th className="p-4 font-medium"><div className="flex items-center"><ShieldCheck className="w-4 h-4 ml-2" /> الصلاحية</div></th>
//                 <th className="p-4 font-medium"><div className="flex items-center"><Cog className="w-4 h-4 ml-2" /> إجراءات</div></th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
//               {users.map((user) => (
//                 <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition">
//                   <td className="p-4 font-medium text-emerald-700 dark:text-emerald-400">{user.name} {currentUser.id === user.id && '(أنت)'}</td>
//                   <td className="p-4 text-left" dir="ltr">{user.username}</td>
//                   <td className="p-4 text-gray-400">••••••••</td>
//                   <td className="p-4">
//                     <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
//                       {user.role === 'admin' ? 'مدير نظام' : 'مفتي / شيخ'}
//                     </span>
//                   </td>
//                   <td className="p-4 space-x-2 space-x-reverse">
//                     <button onClick={() => openModal(user)} className="text-emerald-600 hover:underline text-sm font-medium">تعديل</button>
//                     {currentUser.id !== user.id && <button onClick={() => requestDeleteUser(user)} className="text-red-500 hover:underline text-sm font-medium">حذف</button>}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {selectedUser && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
//             <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700">
//               <h3 className="text-xl font-bold">{selectedUser === 'new' ? 'إضافة مستخدم جديد' : 'تعديل بيانات المستخدم'}</h3>
//               <button onClick={() => setSelectedUser(null)} className="text-gray-500 hover:text-red-500"><XCircle size={24} /></button>
//             </div>
//             <div className="p-6 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">الاسم الكامل (يظهر للعامة كصاحب الفتوى)</label>
//                 <input type="text" value={userData.name} onChange={(event) => setUserData({ ...userData, name: event.target.value })} className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 outline-none focus:border-emerald-500" placeholder="مثال: الشيخ محمد أحمد" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">اسم المستخدم (تسجيل الدخول)</label>
//                 <input type="text" value={userData.username} onChange={(event) => setUserData({ ...userData, username: event.target.value })} className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 outline-none focus:border-emerald-500 text-left" dir="ltr" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">كلمة المرور</label>
//                 <input type="text" value={userData.password} onChange={(event) => setUserData({ ...userData, password: event.target.value })} className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 outline-none focus:border-emerald-500 text-left" dir="ltr" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">الصلاحية</label>
//                 <select value={userData.role} onChange={(event) => setUserData({ ...userData, role: event.target.value })} className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
//                   <option value="sheikh">مفتي / شيخ</option>
//                   <option value="admin">مدير نظام</option>
//                 </select>
//               </div>
//             </div>
//             <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3 space-x-reverse">
//               <button onClick={() => setSelectedUser(null)} className="px-5 py-2 rounded border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition">إلغاء</button>
//               <button onClick={saveUser} className="px-5 py-2 rounded bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition">حفظ التغييرات</button>
//             </div>
//           </div>
//         </div>
//       )}

//       <ConfirmDialog
//         open={Boolean(userToDelete)}
//         title="حذف المستخدم"
//         message={userToDelete ? `هل أنت متأكد من حذف المستخدم "${userToDelete.name}"؟` : ''}
//         confirmLabel="حذف"
//         cancelLabel="إلغاء"
//         onCancel={() => setUserToDelete(null)}
//         onConfirm={deleteUser}
//       />
//     </div>
//   );
// }

// export default AdminUsersPage;
