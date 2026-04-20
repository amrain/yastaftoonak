import { Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../shared/ui/ToastProvider';

function AdminLoginPage({ controller }) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (controller.authReady && controller.currentUser) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [controller.authReady, controller.currentUser, navigate]);

  const handleLogin = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    controller
      .login(creds)
      .then(() => {
        addToast('تم تسجيل الدخول بنجاح.', 'success');
        navigate('/admin/dashboard', { replace: true });
      })
      .catch((requestError) => {
        setError(requestError.message);
        addToast(requestError.message, 'error');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    /* أضفنا dir="rtl" لتغيير اتجاه الصفحة بالكامل */
    <div className={`min-h-screen flex items-center justify-center ${controller.themeColors.background} px-4`} dir="rtl">
      <div className={`max-w-md w-full ${controller.themeColors.card} rounded-2xl shadow-2xl p-8 border-t-4 border-emerald-600`}>
        <div className="text-center mb-8">
          <Shield className="h-16 w-16 mx-auto text-emerald-600 mb-4" />
          {/* تغيير الخط ليكون أغمق (font-black) */}
          <h2 className="text-3xl font-black font-tajawal text-gray-800 dark:text-white">دخول الإدارة</h2>
          <p className="text-gray-500 mt-2 font-bold">نظام إدارة الفتاوى - يستفتونك</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center font-bold border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            {/* تم تغميق الخط هنا (font-bold) */}
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-bold">اسم المستخدم</label>
            <input 
              type="text" 
              value={creds.username} 
              onChange={(event) => setCreds({ ...creds, username: event.target.value })} 
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-emerald-500 font-bold" 
              dir="ltr" // الحقل يظل LTR لأنه غالباً بالإنجليزية
            />
          </div>
          <div>
            {/* تم تغميق الخط هنا (font-bold) */}
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-bold">كلمة المرور</label>
            <input 
              type="password" 
              value={creds.password} 
              onChange={(event) => setCreds({ ...creds, password: event.target.value })} 
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-emerald-500 font-bold" 
              dir="ltr"
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting} 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-lg transition-all transform active:scale-95 disabled:opacity-60 shadow-lg"
          >
            {submitting ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>

          <div className="text-center mt-4">
            <button 
              type="button" 
              onClick={() => navigate('/')} 
              className="text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors"
            >
              العودة للموقع
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;// import { Shield } from 'lucide-react';
// import { useEffect } from 'react';
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useToast } from '../../../shared/ui/ToastProvider';

// function AdminLoginPage({ controller }) {
//   const navigate = useNavigate();
//   const { addToast } = useToast();
//   const [creds, setCreds] = useState({ username: '', password: '' });
//   const [error, setError] = useState('');
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     if (controller.authReady && controller.currentUser) {
//       navigate('/admin/dashboard', { replace: true });
//     }
//   }, [controller.authReady, controller.currentUser, navigate]);

//   const handleLogin = (event) => {
//     event.preventDefault();
//     setSubmitting(true);
//     setError('');

//     controller
//       .login(creds)
//       .then(() => {
//         addToast('تم تسجيل الدخول بنجاح.', 'success');
//         navigate('/admin/dashboard', { replace: true });
//       })
//       .catch((requestError) => {
//         setError(requestError.message);
//         addToast(requestError.message, 'error');
//       })
//       .finally(() => {
//         setSubmitting(false);
//       });
//   };

//   return (
//     <div className={`min-h-screen flex items-center justify-center ${controller.themeColors.background} px-4`}>
//       <div className={`max-w-md w-full ${controller.themeColors.card} rounded-2xl shadow-2xl p-8 border-t-4 border-emerald-600`}>
//         <div className="text-center mb-8">
//           <Shield className="h-16 w-16 mx-auto text-emerald-600 mb-4" />
//           <h2 className="text-3xl font-bold font-tajawal text-gray-800 dark:text-white">دخول الإدارة</h2>
//           <p className="text-gray-500 mt-2">نظام إدارة الفتاوى - يستفتونك</p>
//         </div>

//         {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">{error}</div>}

//         <form onSubmit={handleLogin} className="space-y-6">
//           <div>
//             <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">اسم المستخدم</label>
//             <input type="text" value={creds.username} onChange={(event) => setCreds({ ...creds, username: event.target.value })} className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-emerald-500" dir="ltr" />
//           </div>
//           <div>
//             <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">كلمة المرور</label>
//             <input type="password" value={creds.password} onChange={(event) => setCreds({ ...creds, password: event.target.value })} className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-emerald-500" dir="ltr" />
//           </div>
//           <button type="submit" disabled={submitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-60">
//             {submitting ? 'جاري الدخول...' : 'تسجيل الدخول'}
//           </button>
//           <div className="text-center mt-4">
//             <button type="button" onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-emerald-600">
//               العودة للموقع
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AdminLoginPage;
