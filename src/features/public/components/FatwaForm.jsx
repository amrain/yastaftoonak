import { CheckCircle, Send, Shield } from 'lucide-react';
import { useState } from 'react';
import { LOCATIONS } from '../../../app/constants';
import IslamicStar from '../../../shared/icons/IslamicStar';
import { useToast } from '../../../shared/ui/ToastProvider';

// تكبير النجمة وزيادة بروزها
const RequiredStar = () => <span className="text-red-500 mr-1 text-lg font-bold" title="حقل مطلوب">*</span>;

function FatwaForm({ createFatwa, setShowSuccessModal, showSuccessModal, themeColors }) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    location: '',
    question: '',
    wantsToPublish: true,
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await createFatwa(formData);
      //addToast('تم إرسال السؤال بنجاح.', 'success');
      setFormData({
        name: '',
        age: '',
        gender: '',
        location: '',
        question: '',
        wantsToPublish: true,
        email: '',
      });
    } catch (requestError) {
      setError(requestError.message);
      addToast(requestError.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div id="fatwa-form" className={`max-w-4xl mx-auto -mt-12 relative z-20 ${themeColors.card} rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md shadow-2xl p-6 md:p-10 border-t-4 border-amber-500 border-r border-l border-b border-gray-100 dark:border-gray-700`}>
        <div className="text-center mb-10">
          <h2 className={`text-4xl font-bold ${themeColors.primaryText} mb-3 font-reem`}>اطرح سؤالك</h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto mb-4 rounded-full" />
         
          <p className={themeColors.textMuted}> تُراجع الفتوى ويُجاب عنها من اللجنة المختصة في أقرب وقت</p>
          {/* تم حذف السطر الذي كان هنا (الحقول المميزة مطلوبة) */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block mb-2 text-sm font-medium ${themeColors.textMain}`}>
                الاسم <RequiredStar />
              </label>
              <input type="text" required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} className={`w-full p-3 rounded-lg border ${themeColors.border} bg-transparent ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none`} placeholder="الاسم أو الكنية" dir="rtl" />
            </div>

            <div>
              <label className={`block mb-2 text-sm font-medium ${themeColors.textMain}`}>
                العمر <RequiredStar />
              </label>
              <input type="number" required value={formData.age} onChange={(event) => setFormData({ ...formData, age: event.target.value })} className={`w-full p-3 rounded-lg border ${themeColors.border} bg-transparent ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none`} placeholder="مثال: 25" />
            </div>

            <div>
              <label className={`block mb-2 text-sm font-medium ${themeColors.textMain}`}>
                الجنس <RequiredStar />
              </label>
              <select
                required
                value={formData.gender}
                onChange={(event) => setFormData({ ...formData, gender: event.target.value })}
                className={`w-full p-3 rounded-lg border ${themeColors.border} bg-transparent ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none`}
                dir="rtl"
              >
                <option value="" disabled hidden className="dark:bg-gray-800 text-gray-400">اختر الجنس</option>
                <option value="ذكر" className="dark:bg-gray-800">ذكر</option>
                <option value="أنثى" className="dark:bg-gray-800">أنثى</option>
              </select>
            </div>

            <div>
              <label className={`block mb-2 text-sm font-medium ${themeColors.textMain}`}>
                مكان الإقامة <RequiredStar />
              </label>
              <select required value={formData.location} onChange={(event) => setFormData({ ...formData, location: event.target.value })} className={`w-full p-3 rounded-lg border ${themeColors.border} bg-transparent ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none`} dir="rtl">
                <option value="" disabled hidden className="dark:bg-gray-800">اختر مكان الإقامة</option>
                {LOCATIONS.map((location) => (
                  <option key={location} className="dark:bg-gray-800">{location}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={`block mb-2 text-sm font-medium ${themeColors.textMain}`}>
              نص السؤال <RequiredStar />
            </label>
            <textarea required rows="5" value={formData.question} onChange={(event) => setFormData({ ...formData, question: event.target.value })} className={`w-full p-3 rounded-lg border ${themeColors.border} bg-transparent ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none resize-none`} placeholder="اكتب تفاصيل سؤالك هنا بوضوح..." dir="rtl" style={{ wordBreak: 'break-word' }} />
          </div>

          <div className={`bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border ${themeColors.border}`}>
            <label className={`block mb-3 text-sm font-medium ${themeColors.textMain}`}>أتوافق على نشر الفتوى على الموقع لتعميم الفائدة؟</label>
            <div className="flex flex-col sm:flex-row gap-4 mb-2">
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="publish" checked={formData.wantsToPublish} onChange={() => setFormData({ ...formData, wantsToPublish: true })} className="ml-2 w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                <span className={themeColors.textMain}>نعم، أوافق على نشرها (بدون بياناتي الشخصية)</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="publish" checked={!formData.wantsToPublish} onChange={() => setFormData({ ...formData, wantsToPublish: false })} className="ml-2 w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                <span className={themeColors.textMain}>لا، أريد إجابة خاصة</span>
              </label>
            </div>

            {/* {!formData.wantsToPublish && (
              <div className={`mt-4 pt-4 border-t ${themeColors.border} animate-in fade-in slide-in-from-top-2 duration-300`}>
                <label className={`block mb-2 text-sm font-medium ${themeColors.textMain}`}>
                  البريد الإلكتروني <RequiredStar />
                </label>
                <input type="email" required value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} className={`w-full p-3 rounded-lg border ${themeColors.border} bg-transparent ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none`} placeholder="example@domain.com" dir="ltr" />
              </div>
            )} */}

            
              <div className={`mt-4 pt-4 border-t ${themeColors.border} animate-in fade-in slide-in-from-top-2 duration-300`}>
                <label className={`block mb-2 text-sm font-medium ${themeColors.textMain}`}>
                  البريد الإلكتروني <RequiredStar />
                </label>
                <input type="email" required value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} className={`w-full p-3 rounded-lg border ${themeColors.border} bg-transparent ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none`} placeholder="example@domain.com" dir="ltr" />
              </div>
            
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg flex items-start text-sm border border-gray-200 dark:border-gray-700">
            <Shield className={`h-5 w-5 ${themeColors.secondary} ml-2 flex-shrink-0`} />
            <p className={themeColors.textMuted}>
              بإرسالك للسؤال، أنت توافق على إمكانية نشره لتعميم الفائدة (بدون معلومات شخصية).
            </p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={submitting} className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all shadow-lg ${themeColors.primary} hover:opacity-90 flex justify-center items-center transform hover:-translate-y-0.5 disabled:opacity-60`}>
            <Send className="ml-2 h-5 w-5" /> {submitting ? 'جاري الإرسال...' : 'إرسال الفتوى'}
          </button>
        </form>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300" dir="rtl">
          <div className={`${themeColors.card} rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-t-4 border-emerald-500 relative overflow-hidden`}>
            <div className="absolute -top-10 -right-10 opacity-10 text-emerald-500">
              <IslamicStar className="w-32 h-32" />
            </div>
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
              <CheckCircle size={40} />
            </div>
            <h3 className={`text-2xl font-bold font-reem ${themeColors.primaryText} mb-3 relative z-10`}>تم إرسال سؤالك بنجاح</h3>
            <p className={`${themeColors.textMain} mb-8 font-tajawal text-lg relative z-10 leading-relaxed`}>
              سيتم الإجابة عنها في أقرب وقت ممكن إن شاء الله.
            </p>
            <button onClick={() => setShowSuccessModal(false)} className={`w-full py-3 ${themeColors.primary} text-white rounded-xl font-bold transition-colors shadow-md relative z-10`}>
              حسناً، شكراً لكم
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default FatwaForm;

// import { CheckCircle, Send, Shield } from 'lucide-react';
// import { useState } from 'react';
// import { LOCATIONS } from '../../../app/constants';
// import IslamicStar from '../../../shared/icons/IslamicStar';
// import { useToast } from '../../../shared/ui/ToastProvider';

// function FatwaForm({ createFatwa, setShowSuccessModal, showSuccessModal, themeColors }) {
//   const { addToast } = useToast();
//   const [formData, setFormData] = useState({
//     name: '',
//     age: '',
//     gender: '',
//     location: '',
//     question: '',
//     wantsToPublish: true,
//     email: '',
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setSubmitting(true);
//     setError('');

//     try {
//       await createFatwa(formData);
//       addToast('تم إرسال الفتوى بنجاح.', 'success');
//       setFormData({
//         name: '',
//         age: '',
//         gender: '',
//         location: '',
//         question: '',
//         wantsToPublish: true,
//         email: '',
//       });
//     } catch (requestError) {
//       setError(requestError.message);
//       addToast(requestError.message, 'error');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <div id="fatwa-form" className={`max-w-4xl mx-auto -mt-12 relative z-20 ${themeColors.card} rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md shadow-2xl p-6 md:p-10 border-t-4 border-amber-500 border-r border-l border-b border-gray-100 dark:border-gray-700`}>
//         <div className="text-center mb-10">
//           <h2 className={`text-4xl font-bold ${themeColors.primaryText} mb-3 font-reem`}>اطرح فتواك</h2>
//           <div className="w-16 h-1 bg-amber-400 mx-auto mb-4 rounded-full" />
//           <p className={themeColors.textMuted}>سيتم مراجعة الفتوى والإجابة عليها من قبل اللجنة المختصة في أقرب وقت.</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className={`block mb-2 text-sm font-medium ${themeColors.textMain}`}>الاسم</label>
//               <input type="text" required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} className={`w-full p-3 rounded-lg border ${themeColors.border} bg-transparent ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none`} placeholder="الاسم أو الكنية" />
//             </div>
//             <div>
//               <label className={`block mb-2 text-sm font-medium ${themeColors.textMain}`}>العمر</label>
//               <input type="number" required value={formData.age} onChange={(event) => setFormData({ ...formData, age: event.target.value })} className={`w-full p-3 rounded-lg border ${themeColors.border} bg-transparent ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none`} placeholder="مثال: 25" />
//             </div>
//             {/* <div>
//               <label className={`block mb-2 text-sm font-medium ${themeColors.textMain}`}>الجنس</label>
//               <select required value={formData.gender} onChange={(event) => setFormData({ ...formData, gender: event.target.value })} className={`w-full p-3 rounded-lg border ${themeColors.border} bg-transparent ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none`}>
//                 <option className="dark:bg-gray-800">ذكر</option>
//                 <option className="dark:bg-gray-800">أنثى</option>
//               </select>
//             </div> */}
//             <div>
//   <label className={`block mb-2 text-sm font-medium ${themeColors.textMain}`}>الجنس</label>
//   <select 
//     required 
//     value={formData.gender} 
//     onChange={(event) => setFormData({ ...formData, gender: event.target.value })} 
//     className={`w-full p-3 rounded-lg border ${themeColors.border} bg-transparent ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none`}
//   >
//     {/* الخيار الافتراضي - يظهر كعنوان فقط ولا يمكن اختياره مرة أخرى */}
//     <option value="" disabled hidden className="dark:bg-gray-800 text-gray-400">اختر الجنس</option>
    
//     <option value="ذكر" className="dark:bg-gray-800">ذكر</option>
//     <option value="أنثى" className="dark:bg-gray-800">أنثى</option>
//   </select>
// </div>
//             <div>
//               <label className={`block mb-2 text-sm font-medium ${themeColors.textMain}`}>مكان الإقامة</label>
//               <select  required value={formData.location} onChange={(event) => setFormData({ ...formData, location: event.target.value })} className={`w-full p-3 rounded-lg border ${themeColors.border} bg-transparent ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none`}>
//                 <option value="" disabled hidden className="dark:bg-gray-800">اختر مكان الإقامة</option>
//                 {LOCATIONS.map((location) => (
//                   <option key={location} className="dark:bg-gray-800">
//                     {location}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className={`block mb-2 text-sm font-medium ${themeColors.textMain}`}>نص السؤال</label>
//             <textarea required rows="5" value={formData.question} onChange={(event) => setFormData({ ...formData, question: event.target.value })} className={`w-full p-3 rounded-lg border ${themeColors.border} bg-transparent ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none resize-none`} placeholder="اكتب تفاصيل سؤالك هنا بوضوح..." />
//           </div>

//           <div className={`bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border ${themeColors.border}`}>
//             <label className={`block mb-3 text-sm font-medium ${themeColors.textMain}`}>هل تود نشر الفتوى على الموقع لتعميم الفائدة؟</label>
//             <div className="flex flex-col sm:flex-row gap-4 mb-2">
//               <label className="flex items-center cursor-pointer">
//                 <input type="radio" name="publish" checked={formData.wantsToPublish} onChange={() => setFormData({ ...formData, wantsToPublish: true })} className="ml-2 w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
//                 <span className={themeColors.textMain}>نعم، أوافق على نشرها (بدون بياناتي الشخصية)</span>
//               </label>
//               <label className="flex items-center cursor-pointer">
//                 <input type="radio" name="publish" checked={!formData.wantsToPublish} onChange={() => setFormData({ ...formData, wantsToPublish: false })} className="ml-2 w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
//                 <span className={themeColors.textMain}>لا، أريد إجابة خاصة</span>
//               </label>
//             </div>

//             {!formData.wantsToPublish && (
//               <div className={`mt-4 pt-4 border-t ${themeColors.border} animate-in fade-in slide-in-from-top-2 duration-300`}>
//                 <label className={`block mb-2 text-sm font-medium ${themeColors.textMain}`}>البريد الإلكتروني (لإرسال الإجابة)</label>
//                 <input type="email" required value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} className={`w-full p-3 rounded-lg border ${themeColors.border} bg-transparent ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none`} placeholder="example@domain.com" dir="ltr" />
//               </div>
//             )}
//           </div>

//           <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg flex items-start text-sm border border-gray-200 dark:border-gray-700">
//             <Shield className={`h-5 w-5 ${themeColors.secondary} ml-2 flex-shrink-0`} />
//             <p className={themeColors.textMuted}>
//               موقع "يستفتونك" يلتزم بالحفاظ على خصوصيتك. البيانات الشخصية لا يتم نشرها مع الفتوى، ويتم استخدامها للأغراض الإحصائية فقط.
//               بإرسالك للسؤال، أنت توافق على إمكانية نشره لتعميم الفائدة (بدون معلومات شخصية).
//             </p>
//           </div>

//           {error && <p className="text-red-500 text-sm">{error}</p>}

//           <button type="submit" disabled={submitting} className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all shadow-lg ${themeColors.primary} hover:opacity-90 flex justify-center items-center transform hover:-translate-y-0.5 disabled:opacity-60`}>
//             <Send className="ml-2 h-5 w-5" /> {submitting ? 'جاري الإرسال...' : 'إرسال الفتوى'}
//           </button>
//         </form>
//       </div>

//       {showSuccessModal && (
//         <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300">
//           <div className={`${themeColors.card} rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-t-4 border-emerald-500 relative overflow-hidden`}>
//             <div className="absolute -top-10 -right-10 opacity-10 text-emerald-500">
//               <IslamicStar className="w-32 h-32" />
//             </div>
//             <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
//               <CheckCircle size={40} />
//             </div>
//             <h3 className={`text-2xl font-bold font-reem ${themeColors.primaryText} mb-3 relative z-10`}>تم استقبال الفتوى بنجاح</h3>
//             <p className={`${themeColors.textMain} mb-8 font-tajawal text-lg relative z-10 leading-relaxed`}>
//               سيتم الإجابة عنها في أقرب وقت ممكن إن شاء الله.
//             </p>
//             <button onClick={() => setShowSuccessModal(false)} className={`w-full py-3 ${themeColors.primary} text-white rounded-xl font-bold transition-colors shadow-md relative z-10`}>
//               حسناً، شكراً لكم
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default FatwaForm;

// import { CheckCircle, Send, Shield } from 'lucide-react';
// import { useState } from 'react';
// import { LOCATIONS } from '../../../app/constants';
// import IslamicStar from '../../../shared/icons/IslamicStar';
// import { useToast } from '../../../shared/ui/ToastProvider';

// function FatwaForm({ createFatwa, setShowSuccessModal, showSuccessModal, themeColors }) {
//   const { addToast } = useToast();
//   const [formData, setFormData] = useState({
//     name: '',
//     age: '',
//     gender: '',
//     location: '',
//     question: '',
//     wantsToPublish: true,
//     email: '',
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setSubmitting(true);
//     setError('');

//     try {
//       await createFatwa(formData);
//       addToast('تم إرسال الفتوى بنجاح.', 'success');
//       setFormData({
//         name: '',
//         age: '',
//         gender: '',
//         location: '',
//         question: '',
//         wantsToPublish: true,
//         email: '',
//       });
//     } catch (requestError) {
//       setError(requestError.message);
//       addToast(requestError.message, 'error');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <div id="fatwa-form" className={`max-w-4xl mx-auto -mt-12 relative z-20 ${themeColors.card} rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md shadow-2xl p-6 md:p-10 border-t-4 border-amber-500 border-r border-l border-b border-gray-100 dark:border-gray-700`}>
//         <div className="text-center mb-10">
//           <h2 className={`text-4xl font-bold ${themeColors.primaryText} mb-3 font-reem`}>اطرح فتواك</h2>
//           <div className="w-16 h-1 bg-amber-400 mx-auto mb-4 rounded-full" />
//           <p className={themeColors.textMuted}>سيتم مراجعة الفتوى والإجابة عليها من قبل اللجنة المختصة في أقرب وقت.</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className={`block mb-2 text-sm font-medium ${themeColors.textMain}`}>الاسم</label>
//               <input type="text" required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} className={`w-full p-3 rounded-lg border ${themeColors.border} bg-transparent ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none`} placeholder="الاسم أو الكنية" />
//             </div>
//             <div>
//               <label className={`block mb-2 text-sm font-medium ${themeColors.textMain}`}>العمر</label>
//               <input type="number" required value={formData.age} onChange={(event) => setFormData({ ...formData, age: event.target.value })} className={`w-full p-3 rounded-lg border ${themeColors.border} bg-transparent ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none`} placeholder="مثال: 25" />
//             </div>
//             <div>
//               <label className={`block mb-2 text-sm font-medium ${themeColors.textMain}`}>الجنس</label>
//               <select required value={formData.gender} onChange={(event) => setFormData({ ...formData, gender: event.target.value })} className={`w-full p-3 rounded-lg border ${themeColors.border} bg-transparent ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none`}>
//                 <option className="dark:bg-gray-800">ذكر</option>
//                 <option className="dark:bg-gray-800">أنثى</option>
//               </select>
//             </div>
//             <div>
//               <label className={`block mb-2 text-sm font-medium ${themeColors.textMain}`}>مكان الإقامة</label>
//               <select  value={formData.location} onChange={(event) => setFormData({ ...formData, location: event.target.value })} className={`w-full p-3 rounded-lg border ${themeColors.border} bg-transparent ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none`}>
//                 {LOCATIONS.map((location) => (
//                   <option key={location} className="dark:bg-gray-800">
//                     {location}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className={`block mb-2 text-sm font-medium ${themeColors.textMain}`}>نص السؤال</label>
//             <textarea required rows="5" value={formData.question} onChange={(event) => setFormData({ ...formData, question: event.target.value })} className={`w-full p-3 rounded-lg border ${themeColors.border} bg-transparent ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none resize-none`} placeholder="اكتب تفاصيل سؤالك هنا بوضوح..." />
//           </div>

//           <div className={`bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border ${themeColors.border}`}>
//             <label className={`block mb-3 text-sm font-medium ${themeColors.textMain}`}>هل تود نشر الفتوى على الموقع لتعميم الفائدة؟</label>
//             <div className="flex flex-col sm:flex-row gap-4 mb-2">
//               <label className="flex items-center cursor-pointer">
//                 <input type="radio" name="publish" checked={formData.wantsToPublish} onChange={() => setFormData({ ...formData, wantsToPublish: true })} className="ml-2 w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
//                 <span className={themeColors.textMain}>نعم، أوافق على نشرها (بدون بياناتي الشخصية)</span>
//               </label>
//               <label className="flex items-center cursor-pointer">
//                 <input type="radio" name="publish" checked={!formData.wantsToPublish} onChange={() => setFormData({ ...formData, wantsToPublish: false })} className="ml-2 w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
//                 <span className={themeColors.textMain}>لا، أريد إجابة خاصة</span>
//               </label>
//             </div>

//             {!formData.wantsToPublish && (
//               <div className={`mt-4 pt-4 border-t ${themeColors.border} animate-in fade-in slide-in-from-top-2 duration-300`}>
//                 <label className={`block mb-2 text-sm font-medium ${themeColors.textMain}`}>البريد الإلكتروني (لإرسال الإجابة)</label>
//                 <input type="email" required value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} className={`w-full p-3 rounded-lg border ${themeColors.border} bg-transparent ${themeColors.textMain} focus:ring-2 focus:ring-emerald-500 outline-none`} placeholder="example@domain.com" dir="ltr" />
//               </div>
//             )}
//           </div>

//           <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg flex items-start text-sm border border-gray-200 dark:border-gray-700">
//             <Shield className={`h-5 w-5 ${themeColors.secondary} ml-2 flex-shrink-0`} />
//             <p className={themeColors.textMuted}>
//               موقع "يستفتونك" يلتزم بالحفاظ على خصوصيتك. البيانات الشخصية لا يتم نشرها مع الفتوى، ويتم استخدامها للأغراض الإحصائية فقط.
//               بإرسالك للسؤال، أنت توافق على إمكانية نشره لتعميم الفائدة (بدون معلومات شخصية).
//             </p>
//           </div>

//           {error && <p className="text-red-500 text-sm">{error}</p>}

//           <button type="submit" disabled={submitting} className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all shadow-lg ${themeColors.primary} hover:opacity-90 flex justify-center items-center transform hover:-translate-y-0.5 disabled:opacity-60`}>
//             <Send className="ml-2 h-5 w-5" /> {submitting ? 'جاري الإرسال...' : 'إرسال الفتوى'}
//           </button>
//         </form>
//       </div>

//       {showSuccessModal && (
//         <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300">
//           <div className={`${themeColors.card} rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-t-4 border-emerald-500 relative overflow-hidden`}>
//             <div className="absolute -top-10 -right-10 opacity-10 text-emerald-500">
//               <IslamicStar className="w-32 h-32" />
//             </div>
//             <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
//               <CheckCircle size={40} />
//             </div>
//             <h3 className={`text-2xl font-bold font-reem ${themeColors.primaryText} mb-3 relative z-10`}>تم استقبال الفتوى بنجاح</h3>
//             <p className={`${themeColors.textMain} mb-8 font-tajawal text-lg relative z-10 leading-relaxed`}>
//               سيتم الإجابة عنها في أقرب وقت ممكن إن شاء الله.
//             </p>
//             <button onClick={() => setShowSuccessModal(false)} className={`w-full py-3 ${themeColors.primary} text-white rounded-xl font-bold transition-colors shadow-md relative z-10`}>
//               حسناً، شكراً لكم
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default FatwaForm;
