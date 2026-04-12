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
      setUserData(user);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة المستخدمين والمشايخ</h2>
        <button onClick={() => openModal()} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow transition font-bold">
          + إضافة شيخ / مستخدم
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300">
              <tr>
                <th className="p-4 font-medium"><div className="flex items-center"><User className="w-4 h-4 ml-2" /> الاسم</div></th>
                <th className="p-4 font-medium"><div className="flex items-center"><AtSign className="w-4 h-4 ml-2" /> معرّف الدخول</div></th>
                <th className="p-4 font-medium"><div className="flex items-center"><Key className="w-4 h-4 ml-2" /> كلمة المرور</div></th>
                <th className="p-4 font-medium"><div className="flex items-center"><ShieldCheck className="w-4 h-4 ml-2" /> الصلاحية</div></th>
                <th className="p-4 font-medium"><div className="flex items-center"><Cog className="w-4 h-4 ml-2" /> إجراءات</div></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition">
                  <td className="p-4 font-medium text-emerald-700 dark:text-emerald-400">{user.name} {currentUser.id === user.id && '(أنت)'}</td>
                  <td className="p-4 text-left" dir="ltr">{user.username}</td>
                  <td className="p-4 text-gray-400">••••••••</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {user.role === 'admin' ? 'مدير نظام' : 'مفتي / شيخ'}
                    </span>
                  </td>
                  <td className="p-4 space-x-2 space-x-reverse">
                    <button onClick={() => openModal(user)} className="text-emerald-600 hover:underline text-sm font-medium">تعديل</button>
                    {currentUser.id !== user.id && <button onClick={() => requestDeleteUser(user)} className="text-red-500 hover:underline text-sm font-medium">حذف</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700">
              <h3 className="text-xl font-bold">{selectedUser === 'new' ? 'إضافة مستخدم جديد' : 'تعديل بيانات المستخدم'}</h3>
              <button onClick={() => setSelectedUser(null)} className="text-gray-500 hover:text-red-500"><XCircle size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">الاسم الكامل (يظهر للعامة كصاحب الفتوى)</label>
                <input type="text" value={userData.name} onChange={(event) => setUserData({ ...userData, name: event.target.value })} className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 outline-none focus:border-emerald-500" placeholder="مثال: الشيخ محمد أحمد" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">اسم المستخدم (تسجيل الدخول)</label>
                <input type="text" value={userData.username} onChange={(event) => setUserData({ ...userData, username: event.target.value })} className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 outline-none focus:border-emerald-500 text-left" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">كلمة المرور</label>
                <input type="text" value={userData.password} onChange={(event) => setUserData({ ...userData, password: event.target.value })} className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 outline-none focus:border-emerald-500 text-left" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الصلاحية</label>
                <select value={userData.role} onChange={(event) => setUserData({ ...userData, role: event.target.value })} className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
                  <option value="sheikh">مفتي / شيخ</option>
                  <option value="admin">مدير نظام</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3 space-x-reverse">
              <button onClick={() => setSelectedUser(null)} className="px-5 py-2 rounded border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition">إلغاء</button>
              <button onClick={saveUser} className="px-5 py-2 rounded bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition">حفظ التغييرات</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(userToDelete)}
        title="حذف المستخدم"
        message={userToDelete ? `هل أنت متأكد من حذف المستخدم "${userToDelete.name}"؟` : ''}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        onCancel={() => setUserToDelete(null)}
        onConfirm={deleteUser}
      />
    </div>
  );
}

export default AdminUsersPage;
