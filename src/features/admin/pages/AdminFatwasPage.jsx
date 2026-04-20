import { Download, Sparkles, XCircle, MessageSquare, CheckCircle, FileText, User as UserIcon, MapPin, Calendar, Clock, Filter, Mail, ExternalLink } from 'lucide-react';
import { useMemo, useState } from 'react';
import { callGeminiAPI } from '../../../app/services/gemini';
import ConfirmDialog from '../../../shared/ui/ConfirmDialog';
import { useToast } from '../../../shared/ui/ToastProvider';
function AdminFatwasPage({ currentUser, deleteFatwaById, fatwas, saveFatwaReply, categories = [] }) {
  const { addToast } = useToast();
  const [selectedFatwa, setSelectedFatwa] = useState(null);
  const [replyData, setReplyData] = useState({ answer: '', category: '', status: 'published' });
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCat, setFilterCat] = useState('all');
  const [isDrafting, setIsDrafting] = useState(false);
  const [aiAdminError, setAiAdminError] = useState('');
  const [fatwaToDelete, setFatwaToDelete] = useState(null);

  const displayedFatwas = useMemo(
    () =>
      fatwas.filter((fatwa) => {
        const statusMatch =
          filterStatus === 'all' ||
          (filterStatus === 'new' && fatwa.status === 'new') ||
          (filterStatus === 'answered' && fatwa.status !== 'new');
        const categoryMatch = filterCat === 'all' || fatwa.category === filterCat;
        return statusMatch && categoryMatch;
      }),
    [fatwas, filterStatus, filterCat],
  );

  const openModal = (fatwa) => {
    setSelectedFatwa(fatwa);
    setAiAdminError('');
    setReplyData({
      answer: fatwa.answer || '',
      category: fatwa.category || (categories.length > 0 ? categories[0].name : ''),
      status: fatwa.status === 'new' ? 'published' : fatwa.status,
    });
  };

  const openGmailReply = () => {
    if (!selectedFatwa?.email) {
      addToast('لا يوجد بريد إلكتروني لهذه الفتوى.', 'error');
      return;
    }

    const subject = `رد على فتوى رقم #${selectedFatwa.serialNumber ?? selectedFatwa.id ?? '—'}`;
    const body = `السلام عليكم ورحمة الله وبركاته،\n\nبخصوص سؤالكم الموقر:\n"${selectedFatwa.question || ''}"\n\nإليكم الإجابة الشرعية:\n${replyData.answer || ''}\n\nنسأل الله لنا ولكم التوفيق.`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      selectedFatwa.email,
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDraftAnswer = async () => {
    setIsDrafting(true);
    setAiAdminError('');
    try {
      const prompt = `أنت مساعد باحث لمفتي شرعي. اكتب مسودة إجابة شرعية متأصلة ومختصرة جداً بناءً على المذاهب الأربعة (أو الراجح منها) لهذا السؤال، لكي يراجعها المفتي قبل نشرها. اكتب الجواب مباشرة بدون مقدمات طويلة، واذكر دليلاً إن أمكن باختصار. السؤال: "${selectedFatwa.question}"`;
      const draft = await callGeminiAPI(prompt);
      setReplyData((current) => ({ ...current, answer: draft.trim() }));
      addToast('تم إنشاء مسودة أولية للإجابة.', 'success');
    } catch (error) {
      setAiAdminError(error.message);
      addToast(error.message, 'error');
    } finally {
      setIsDrafting(false);
    }
  };

  const saveReply = async () => {
    try {
      await saveFatwaReply(selectedFatwa.id, {
        ...replyData,
        answeredBy: currentUser.name,
      });
      addToast('تم حفظ الرد بنجاح.', 'success');
      setSelectedFatwa(null);
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  const deleteFatwa = async () => {
    try {
      await deleteFatwaById(fatwaToDelete.id);
      addToast('تم حذف الفتوى.', 'success');
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setFatwaToDelete(null);
    }
  };

  const exportCSV = () => {
    const headers = ['الرقم التسلسلي', 'الاسم', 'الايميل', 'العمر', 'الجنس', 'المكان', 'السؤال', 'الجواب', 'التصنيف', 'الحالة', 'التاريخ'];
    const rows = displayedFatwas.map((fatwa) => [
      fatwa.serialNumber ?? '',
      fatwa.name || 'مجهول',
      fatwa.email || 'لا يوجد',
      fatwa.age,
      fatwa.gender,
      fatwa.location,
      `"${(fatwa.question || '').replace(/"/g, '""')}"`,
      `"${(fatwa.answer || '').replace(/"/g, '""')}"`,
      fatwa.category,
      fatwa.status,
      fatwa.date,
    ]);
    const csvContent = `data:text/csv;charset=utf-8,\uFEFF${[headers.join(','), ...rows.map((row) => row.join(','))].join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'fatwas_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-tajawal pb-10" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-emerald-900 dark:text-emerald-400">سجل الفتاوى</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">إدارة الطلبات الواردة والإجابة عليها شرعياً</p>
        </div>
        <button 
          onClick={exportCSV} 
          className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 px-5 py-2.5 rounded-xl shadow-sm hover:bg-emerald-50 transition-all font-bold"
        >
          <Download size={20} /> تصدير البيانات (CSV)
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col lg:flex-row gap-4">
        <div className="flex bg-gray-100 dark:bg-gray-900/50 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 w-fit">
          <button 
            onClick={() => setFilterStatus('all')} 
            className={`px-6 py-2 rounded-lg text-sm font-black transition-all ${filterStatus === 'all' ? 'bg-white dark:bg-gray-700 shadow-md text-emerald-700 dark:text-emerald-400' : 'text-gray-500 hover:text-gray-700'}`}
          >
            الكل
          </button>
          <button 
            onClick={() => setFilterStatus('new')} 
            className={`px-6 py-2 rounded-lg text-sm font-black transition-all flex items-center gap-2 ${filterStatus === 'new' ? 'bg-white dark:bg-gray-700 shadow-md text-amber-600' : 'text-gray-500 hover:text-amber-500'}`}
          >
            بانتظار الرد
            {fatwas.filter(f => f.status === 'new').length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                {fatwas.filter(f => f.status === 'new').length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setFilterStatus('answered')} 
            className={`px-6 py-2 rounded-lg text-sm font-black transition-all ${filterStatus === 'answered' ? 'bg-white dark:bg-gray-700 shadow-md text-emerald-700 dark:text-emerald-400' : 'text-gray-500 hover:text-gray-700'}`}
          >
            تم الرد
          </button>
        </div>

        <div className="hidden lg:block flex-1" />

        <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select 
              value={filterCat} 
              onChange={(e) => setFilterCat(e.target.value)} 
              className="min-w-[200px] p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm font-bold text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            >
              <option value="all">جميع التصنيفات</option>
              {categories.map((cat) => (
                <option key={cat.id || cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600 text-gray-500">
              <tr>
                <th className="p-5 font-bold text-sm text-right">المستفتي</th>
                <th className="p-5 font-bold text-sm text-right">موضوع السؤال</th>
                <th className="p-5 font-bold text-sm text-center">الحالة</th>
                <th className="p-5 font-bold text-sm text-right">التصنيف</th>
                <th className="p-5 font-bold text-sm text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {displayedFatwas.length > 0 ? (
                displayedFatwas.map((fatwa) => (
                  <tr key={fatwa.id} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/5 transition-colors group">
                    <td className="p-5 text-right">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 shrink-0">
                           <UserIcon size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-gray-800 dark:text-gray-200 truncate">{fatwa.name || 'مجهول'}</div>
                          <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <MapPin size={10} /> {fatwa.location} • {fatwa.age} سنة
                          </div>
                          {/* عرض البريد في الجدول بشكل مصغر */}
                          {fatwa.email && <div className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1"><Mail size={8}/> {fatwa.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <div className="max-w-xs xl:max-w-md">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed" title={fatwa.question}>
                          {fatwa.question}
                        </p>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                        fatwa.status === 'new' ? 'bg-amber-100 text-amber-700' : 
                        fatwa.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {fatwa.status === 'new' ? 'جديدة' : fatwa.status === 'published' ? 'منشورة' : 'مسودة'}
                      </span>
                      {fatwa.answeredBy && (
                        <div className="text-[9px] text-emerald-600 mt-1.5 flex items-center justify-center gap-1">
                          <CheckCircle size={10} /> أجاب: {fatwa.answeredBy}
                        </div>
                      )}
                    </td>
                    <td className="p-5 text-right">
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded">
                        {fatwa.category || 'غير مصنف'}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => openModal(fatwa)} 
                          className="text-emerald-600 hover:text-emerald-700 font-black text-sm flex items-center gap-1"
                        >
                          <MessageSquare size={16} /> رد
                        </button>
                        <button 
                          onClick={() => setFatwaToDelete(fatwa)} 
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-20 text-center text-gray-500">
                    <div className="flex flex-col items-center opacity-40">
                      <FileText size={48} className="mb-2" />
                      <p className="text-lg font-bold">لا توجد فتاوى حالياً</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply Modal */}
      {selectedFatwa && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] transform transition-all animate-in zoom-in-95" dir="rtl">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-emerald-50/50 dark:bg-gray-700/50">
              <div className="flex items-center gap-3 font-bold text-emerald-900 dark:text-emerald-400 text-xl">
                 <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-lg shadow-emerald-200">
                    <MessageSquare size={20} />
                 </div>
                 الرد على الفتوى #{selectedFatwa.serialNumber ?? '—'}
              </div>
              <button onClick={() => setSelectedFatwa(null)} className="text-gray-400 hover:text-red-500 transition-colors">
                <XCircle size={28} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1 space-y-8">
              {/* User Info Card - تم إضافة الإيميل هنا */}
              <div className="bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-5 rounded-2xl grid grid-cols-2 md:grid-cols-5 gap-6 text-sm">
                <div className="space-y-1">
                   <p className="text-gray-400 font-bold flex items-center gap-1"><UserIcon size={14}/> السائل</p>
                   <p className="font-black text-emerald-800 dark:text-emerald-300">{selectedFatwa.name || 'مجهول'}</p>
                </div>
                <div className="space-y-1 col-span-1 md:col-span-1">
                   <p className="text-gray-400 font-bold flex items-center gap-1"><Mail size={14}/> البريد الإلكتروني</p>
                   <p className="font-black text-blue-600 dark:text-blue-400 break-all">{selectedFatwa.email || 'لا يوجد إيميل'}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-gray-400 font-bold flex items-center gap-1"><MapPin size={14}/> المنطقة</p>
                   <p className="font-black">{selectedFatwa.location}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-gray-400 font-bold flex items-center gap-1"><Calendar size={14}/> التاريخ</p>
                   <p className="font-black">{selectedFatwa.date}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-gray-400 font-bold flex items-center gap-1"><Clock size={14}/> نوع الطلب</p>
                   <span className={`px-2 py-0.5 rounded text-[10px] font-black ${selectedFatwa.wantsToPublish === false ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'}`}>
                    {selectedFatwa.wantsToPublish === false ? 'رد خاص' : 'للنشر العام'}
                   </span>
                </div>
              </div>

{selectedFatwa.email && (
                <div className="bg-amber-50/60 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <Mail size={16} className="text-amber-600 dark:text-amber-400" />
                    البريد: <span className="font-black" dir="ltr">{selectedFatwa.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={openGmailReply}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 font-black hover:bg-amber-50 dark:hover:bg-amber-900/20 transition"
                    title="يفتح Gmail مع تعبئة البريد ونص الإجابة"
                  >
                    فتح Gmail للرد <ExternalLink size={16} />
                  </button>
                </div>
              )}
              {/* Question Text */}
              <div className="space-y-3">
                <h4 className="font-black text-gray-700 dark:text-gray-300 flex items-center gap-2">
                   <div className="w-1.5 h-6 bg-amber-400 rounded-full" /> نص السؤال الوارد:
                </h4>
                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 whitespace-pre-wrap text-xl leading-relaxed text-gray-800 dark:text-gray-200 italic shadow-inner">
                  "{selectedFatwa.question}"
                </div>
              </div>

              {/* Answer Section */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <label className="text-lg font-black text-emerald-900 dark:text-emerald-400">الإجابة الشرعية المتأصلة:</label>
                    <div className="flex gap-2">
                      {/* <button 
                        type="button" 
                        onClick={handleDraftAnswer} 
                        disabled={isDrafting} 
                        className="flex items-center gap-2 text-sm font-black bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl shadow-lg transition-all disabled:opacity-50"
                      >
                        <Sparkles size={16} className={isDrafting ? 'animate-spin' : ''} />
                        {isDrafting ? 'جاري الصياغة...' : 'مسودة ذكاء اصطناعي'}
                      </button> */}

                      {/* زر إرسال الإيميل الجديد */}
                      {/* تم حذف زر الإرسال الأزرق */}
                    </div>
                 </div>
                 
                 <textarea 
                  rows="8" 
                  value={replyData.answer} 
                  onChange={(e) => setReplyData({ ...replyData, answer: e.target.value })} 
                  className="w-full p-5 rounded-2xl border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-lg leading-relaxed shadow-sm" 
                  placeholder="اكتب الجواب الشرعي هنا..." 
                />
                {aiAdminError && <p className="text-red-500 text-xs font-bold">{aiAdminError}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 dark:text-gray-400">تصنيف الفتوى:</label>
                    <select 
                      value={replyData.category} 
                      onChange={(e) => setReplyData({ ...replyData, category: e.target.value })} 
                      className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">-- اختر التصنيف --</option>
                      {categories.map((cat) => (
                        <option key={cat.id || cat._id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 dark:text-gray-400">قرار النشر:</label>
                    <select 
                      value={replyData.status} 
                      onChange={(e) => setReplyData({ ...replyData, status: e.target.value })} 
                      className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="published">✅ نشر للعامة في الأرشيف</option>
                      <option value="answered">🔒 إرسال رد خاص فقط</option>
                      <option value="draft">📁 حفظ كمسودة للمراجعة</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-700/50 flex justify-end gap-4">
              <button 
                onClick={() => setSelectedFatwa(null)} 
                className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-all"
              >
                إغلاق
              </button>
              <button 
                onClick={saveReply} 
                className="px-10 py-3 rounded-xl bg-emerald-600 text-white font-black shadow-xl hover:bg-emerald-700 active:scale-95 transition-all"
              >
                اعتماد الرد وحفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(fatwaToDelete)}
        title="حذف فتوى نهائياً"
        message={fatwaToDelete ? `أنت على وشك حذف فتوى السائل "${fatwaToDelete.name}". هل أنت متأكد؟ هذا الإجراء لا يمكن التراجع عنه.` : ''}
        confirmLabel="تأكيد الحذف"
        cancelLabel="تراجع"
        onCancel={() => setFatwaToDelete(null)}
        onConfirm={deleteFatwa}
      />
    </div>
  );
}

export default AdminFatwasPage;
// import { Download, Sparkles, XCircle, MessageSquare, CheckCircle, FileText, User as UserIcon, MapPin, Calendar, Clock, Filter } from 'lucide-react';
// import { useMemo, useState } from 'react';
// import { callGeminiAPI } from '../../../app/services/gemini';
// import ConfirmDialog from '../../../shared/ui/ConfirmDialog';
// import { useToast } from '../../../shared/ui/ToastProvider';

// function AdminFatwasPage({ currentUser, deleteFatwaById, fatwas, saveFatwaReply, categories = [] }) {
//   const { addToast } = useToast();
//   const [selectedFatwa, setSelectedFatwa] = useState(null);
//   const [replyData, setReplyData] = useState({ answer: '', category: '', status: 'published' });
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [filterCat, setFilterCat] = useState('all');
//   const [isDrafting, setIsDrafting] = useState(false);
//   const [aiAdminError, setAiAdminError] = useState('');
//   const [fatwaToDelete, setFatwaToDelete] = useState(null);

//   const displayedFatwas = useMemo(
//     () =>
//       fatwas.filter((fatwa) => {
//         const statusMatch =
//           filterStatus === 'all' ||
//           (filterStatus === 'new' && fatwa.status === 'new') ||
//           (filterStatus === 'answered' && fatwa.status !== 'new');
//         const categoryMatch = filterCat === 'all' || fatwa.category === filterCat;
//         return statusMatch && categoryMatch;
//       }),
//     [fatwas, filterStatus, filterCat],
//   );

//   const openModal = (fatwa) => {
//     setSelectedFatwa(fatwa);
//     setAiAdminError('');
//     setReplyData({
//       answer: fatwa.answer || '',
//       category: fatwa.category || (categories.length > 0 ? categories[0].name : ''),
//       status: fatwa.status === 'new' ? 'published' : fatwa.status,
//     });
//   };

//   const handleDraftAnswer = async () => {
//     setIsDrafting(true);
//     setAiAdminError('');
//     try {
//       const prompt = `أنت مساعد باحث لمفتي شرعي. اكتب مسودة إجابة شرعية متأصلة ومختصرة جداً بناءً على المذاهب الأربعة (أو الراجح منها) لهذا السؤال، لكي يراجعها المفتي قبل نشرها. اكتب الجواب مباشرة بدون مقدمات طويلة، واذكر دليلاً إن أمكن باختصار. السؤال: "${selectedFatwa.question}"`;
//       const draft = await callGeminiAPI(prompt);
//       setReplyData((current) => ({ ...current, answer: draft.trim() }));
//       addToast('تم إنشاء مسودة أولية للإجابة.', 'success');
//     } catch (error) {
//       setAiAdminError(error.message);
//       addToast(error.message, 'error');
//     } finally {
//       setIsDrafting(false);
//     }
//   };

//   const saveReply = async () => {
//     try {
//       await saveFatwaReply(selectedFatwa.id, {
//         ...replyData,
//         answeredBy: currentUser.name,
//       });
//       addToast('تم حفظ الرد بنجاح.', 'success');
//       setSelectedFatwa(null);
//     } catch (error) {
//       addToast(error.message, 'error');
//     }
//   };

//   const deleteFatwa = async () => {
//     try {
//       await deleteFatwaById(fatwaToDelete.id);
//       addToast('تم حذف الفتوى.', 'success');
//     } catch (error) {
//       addToast(error.message, 'error');
//     } finally {
//       setFatwaToDelete(null);
//     }
//   };

//   const exportCSV = () => {
//     const headers = ['المعرف', 'الاسم', 'العمر', 'الجنس', 'المكان', 'السؤال', 'الجواب', 'التصنيف', 'الحالة', 'التاريخ'];
//     const rows = displayedFatwas.map((fatwa) => [
//       fatwa.id,
//       fatwa.name || 'مجهول',
//       fatwa.age,
//       fatwa.gender,
//       fatwa.location,
//       `"${(fatwa.question || '').replace(/"/g, '""')}"`,
//       `"${(fatwa.answer || '').replace(/"/g, '""')}"`,
//       fatwa.category,
//       fatwa.status,
//       fatwa.date,
//     ]);
//     const csvContent = `data:text/csv;charset=utf-8,\uFEFF${[headers.join(','), ...rows.map((row) => row.join(','))].join('\n')}`;
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement('a');
//     link.setAttribute('href', encodedUri);
//     link.setAttribute('download', 'fatwas_export.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="space-y-6 font-tajawal pb-10" dir="rtl">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-3xl font-black text-emerald-900 dark:text-emerald-400">سجل الفتاوى</h2>
//           <p className="text-gray-500 dark:text-gray-400 mt-1">إدارة الطلبات الواردة والإجابة عليها شرعياً</p>
//         </div>
//         <button 
//           onClick={exportCSV} 
//           className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 px-5 py-2.5 rounded-xl shadow-sm hover:bg-emerald-50 transition-all font-bold"
//         >
//           <Download size={20} /> تصدير البيانات (CSV)
//         </button>
//       </div>

//       {/* Filters Bar */}
//       <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col lg:flex-row gap-4">
//         <div className="flex bg-gray-100 dark:bg-gray-900/50 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 w-fit">
//           <button 
//             onClick={() => setFilterStatus('all')} 
//             className={`px-6 py-2 rounded-lg text-sm font-black transition-all ${filterStatus === 'all' ? 'bg-white dark:bg-gray-700 shadow-md text-emerald-700 dark:text-emerald-400' : 'text-gray-500 hover:text-gray-700'}`}
//           >
//             الكل
//           </button>
//           <button 
//             onClick={() => setFilterStatus('new')} 
//             className={`px-6 py-2 rounded-lg text-sm font-black transition-all flex items-center gap-2 ${filterStatus === 'new' ? 'bg-white dark:bg-gray-700 shadow-md text-amber-600' : 'text-gray-500 hover:text-amber-500'}`}
//           >
//             بانتظار الرد
//             {fatwas.filter(f => f.status === 'new').length > 0 && (
//               <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
//                 {fatwas.filter(f => f.status === 'new').length}
//               </span>
//             )}
//           </button>
//           <button 
//             onClick={() => setFilterStatus('answered')} 
//             className={`px-6 py-2 rounded-lg text-sm font-black transition-all ${filterStatus === 'answered' ? 'bg-white dark:bg-gray-700 shadow-md text-emerald-700 dark:text-emerald-400' : 'text-gray-500 hover:text-gray-700'}`}
//           >
//             تم الرد
//           </button>
//         </div>

//         <div className="hidden lg:block flex-1" />

//         <div className="flex items-center gap-2">
//             <Filter size={18} className="text-gray-400" />
//             <select 
//               value={filterCat} 
//               onChange={(e) => setFilterCat(e.target.value)} 
//               className="min-w-[200px] p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm font-bold text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
//             >
//               <option value="all">جميع التصنيفات</option>
//               {categories.map((cat) => (
//                 <option key={cat.id || cat._id} value={cat.name}>{cat.name}</option>
//               ))}
//             </select>
//         </div>
//       </div>

//       {/* Main Table */}
//       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600 text-gray-500">
//               <tr>
//                 <th className="p-5 font-bold text-sm text-right">المستفتي</th>
//                 <th className="p-5 font-bold text-sm text-right">موضوع السؤال</th>
//                 <th className="p-5 font-bold text-sm text-center">الحالة</th>
//                 <th className="p-5 font-bold text-sm text-right">التصنيف</th>
//                 <th className="p-5 font-bold text-sm text-center">إجراءات</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
//               {displayedFatwas.length > 0 ? (
//                 displayedFatwas.map((fatwa) => (
//                   <tr key={fatwa.id} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/5 transition-colors group">
//                     <td className="p-5 text-right">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 shrink-0">
//                            <UserIcon size={18} />
//                         </div>
//                         <div className="min-w-0">
//                           <div className="font-bold text-gray-800 dark:text-gray-200 truncate">{fatwa.name || 'مجهول'}</div>
//                           <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
//                             <MapPin size={10} /> {fatwa.location} • {fatwa.age} سنة
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="p-5 text-right">
//                       <div className="max-w-xs xl:max-w-md">
//                         <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed" title={fatwa.question}>
//                           {fatwa.question}
//                         </p>
//                       </div>
//                     </td>
//                     <td className="p-5 text-center">
//                       <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
//                         fatwa.status === 'new' ? 'bg-amber-100 text-amber-700' : 
//                         fatwa.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 
//                         'bg-gray-100 text-gray-600'
//                       }`}>
//                         {fatwa.status === 'new' ? 'جديدة' : fatwa.status === 'published' ? 'منشورة' : 'مسودة'}
//                       </span>
//                       {fatwa.answeredBy && (
//                         <div className="text-[9px] text-emerald-600 mt-1.5 flex items-center justify-center gap-1">
//                           <CheckCircle size={10} /> أجاب: {fatwa.answeredBy}
//                         </div>
//                       )}
//                     </td>
//                     <td className="p-5 text-right">
//                       <span className="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded">
//                         {fatwa.category || 'غير مصنف'}
//                       </span>
//                     </td>
//                     <td className="p-5 text-center">
//                       <div className="flex items-center justify-center gap-3">
//                         <button 
//                           onClick={() => openModal(fatwa)} 
//                           className="text-emerald-600 hover:text-emerald-700 font-black text-sm flex items-center gap-1"
//                         >
//                           <MessageSquare size={16} /> رد
//                         </button>
//                         <button 
//                           onClick={() => setFatwaToDelete(fatwa)} 
//                           className="text-red-400 hover:text-red-600 transition-colors"
//                         >
//                           <XCircle size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="p-20 text-center text-gray-500">
//                     <div className="flex flex-col items-center opacity-40">
//                       <FileText size={48} className="mb-2" />
//                       <p className="text-lg font-bold">لا توجد فتاوى حالياً</p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Reply Modal */}
//       {selectedFatwa && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//           <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] transform transition-all animate-in zoom-in-95" dir="rtl">
//             <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-emerald-50/50 dark:bg-gray-700/50">
//               <div className="flex items-center gap-3 font-bold text-emerald-900 dark:text-emerald-400 text-xl">
//                  <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-lg shadow-emerald-200">
//                     <MessageSquare size={20} />
//                  </div>
//                  الرد على الفتوى #{selectedFatwa.id}
//               </div>
//               <button onClick={() => setSelectedFatwa(null)} className="text-gray-400 hover:text-red-500 transition-colors">
//                 <XCircle size={28} />
//               </button>
//             </div>

//             <div className="p-8 overflow-y-auto flex-1 space-y-8">
//               {/* User Info Card */}
//               <div className="bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-5 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
//                 <div className="space-y-1">
//                    <p className="text-gray-400 font-bold flex items-center gap-1"><UserIcon size={14}/> السائل</p>
//                    <p className="font-black text-emerald-800 dark:text-emerald-300">{selectedFatwa.name || 'مجهول'}</p>
//                 </div>
//                 <div className="space-y-1">
//                    <p className="text-gray-400 font-bold flex items-center gap-1"><MapPin size={14}/> المنطقة</p>
//                    <p className="font-black">{selectedFatwa.location}</p>
//                 </div>
//                 <div className="space-y-1">
//                    <p className="text-gray-400 font-bold flex items-center gap-1"><Calendar size={14}/> التاريخ</p>
//                    <p className="font-black">{selectedFatwa.date}</p>
//                 </div>
//                 <div className="space-y-1">
//                    <p className="text-gray-400 font-bold flex items-center gap-1"><Clock size={14}/> الحالة</p>
//                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${selectedFatwa.wantsToPublish === false ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'}`}>
//                     {selectedFatwa.wantsToPublish === false ? 'رد خاص' : 'للنشر العام'}
//                    </span>
//                 </div>
//               </div>

//               {/* Question Text */}
//               <div className="space-y-3">
//                 <h4 className="font-black text-gray-700 dark:text-gray-300 flex items-center gap-2">
//                    <div className="w-1.5 h-6 bg-amber-400 rounded-full" /> نص السؤال الوارد:
//                 </h4>
//                 <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 whitespace-pre-wrap text-xl leading-relaxed text-gray-800 dark:text-gray-200 italic shadow-inner">
//                   "{selectedFatwa.question}"
//                 </div>
//               </div>

//               {/* Answer Section */}
//               <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                     <label className="text-lg font-black text-emerald-900 dark:text-emerald-400">الإجابة الشرعية المتأصلة:</label>
//                     <button 
//                       type="button" 
//                       onClick={handleDraftAnswer} 
//                       disabled={isDrafting} 
//                       className="flex items-center gap-2 text-sm font-black bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl shadow-lg shadow-purple-200 dark:shadow-none transition-all disabled:opacity-50"
//                     >
//                       <Sparkles size={16} className={isDrafting ? 'animate-spin' : ''} />
//                       {isDrafting ? 'جاري الصياغة...' : 'اقتراح مسودة بالذكاء الاصطناعي'}
//                     </button>
//                 </div>
                
//                 <textarea 
//                   rows="8" 
//                   value={replyData.answer} 
//                   onChange={(e) => setReplyData({ ...replyData, answer: e.target.value })} 
//                   className="w-full p-5 rounded-2xl border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-lg leading-relaxed shadow-sm" 
//                   placeholder="اكتب الجواب الشرعي هنا..." 
//                 />
//                 {aiAdminError && <p className="text-red-500 text-xs font-bold">{aiAdminError}</p>}

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-bold text-gray-600 dark:text-gray-400">تصنيف الفتوى:</label>
//                     <select 
//                       value={replyData.category} 
//                       onChange={(e) => setReplyData({ ...replyData, category: e.target.value })} 
//                       className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-bold outline-none focus:ring-2 focus:ring-emerald-500"
//                     >
//                       <option value="">-- اختر التصنيف --</option>
//                       {categories.map((cat) => (
//                         <option key={cat.id || cat._id} value={cat.name}>{cat.name}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-bold text-gray-600 dark:text-gray-400">قرار النشر:</label>
//                     <select 
//                       value={replyData.status} 
//                       onChange={(e) => setReplyData({ ...replyData, status: e.target.value })} 
//                       className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-bold outline-none focus:ring-2 focus:ring-emerald-500"
//                     >
//                       <option value="published">✅ نشر للعامة في الأرشيف</option>
//                       <option value="answered">🔒 إرسال رد خاص فقط</option>
//                       <option value="draft">📁 حفظ كمسودة للمراجعة</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-700/50 flex justify-end gap-4">
//               <button 
//                 onClick={() => setSelectedFatwa(null)} 
//                 className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-all"
//               >
//                 إغلاق
//               </button>
//               <button 
//                 onClick={saveReply} 
//                 className="px-10 py-3 rounded-xl bg-emerald-600 text-white font-black shadow-xl shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 active:scale-95 transition-all"
//               >
//                 اعتماد الرد وحفظ التغييرات
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <ConfirmDialog
//         open={Boolean(fatwaToDelete)}
//         title="حذف فتوى نهائياً"
//         message={fatwaToDelete ? `أنت على وشك حذف فتوى السائل "${fatwaToDelete.name}". هل أنت متأكد؟ هذا الإجراء لا يمكن التراجع عنه.` : ''}
//         confirmLabel="تأكيد الحذف"
//         cancelLabel="تراجع"
//         onCancel={() => setFatwaToDelete(null)}
//         onConfirm={deleteFatwa}
//       />
//     </div>
//   );
// }

// export default AdminFatwasPage;
// import { Download, Sparkles, XCircle } from 'lucide-react';
// import { useMemo, useState } from 'react';
// // تم إزالة CATEGORIES الثابتة واستبدالها بالبيانات القادمة من Props
// import { callGeminiAPI } from '../../../app/services/gemini';
// import ConfirmDialog from '../../../shared/ui/ConfirmDialog';
// import { useToast } from '../../../shared/ui/ToastProvider';

// function AdminFatwasPage({ currentUser, deleteFatwaById, fatwas, saveFatwaReply, categories = [] }) {
//   const { addToast } = useToast();
//   const [selectedFatwa, setSelectedFatwa] = useState(null);
//   const [replyData, setReplyData] = useState({ answer: '', category: '', status: 'published' });
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [filterCat, setFilterCat] = useState('all');
//   const [isDrafting, setIsDrafting] = useState(false);
//   const [aiAdminError, setAiAdminError] = useState('');
//   const [fatwaToDelete, setFatwaToDelete] = useState(null);

//   const displayedFatwas = useMemo(
//     () =>
//       fatwas.filter((fatwa) => {
//         const statusMatch =
//           filterStatus === 'all' ||
//           (filterStatus === 'new' && fatwa.status === 'new') ||
//           (filterStatus === 'answered' && fatwa.status !== 'new');
//         const categoryMatch = filterCat === 'all' || fatwa.category === filterCat;
//         return statusMatch && categoryMatch;
//       }),
//     [fatwas, filterStatus, filterCat],
//   );

//   const openModal = (fatwa) => {
//     setSelectedFatwa(fatwa);
//     setAiAdminError('');
//     setReplyData({
//       answer: fatwa.answer || '',
//       // استخدام أول تصنيف متاح كقيمة افتراضية
//       category: fatwa.category || (categories.length > 0 ? categories[0].name : ''),
//       status: fatwa.status === 'new' ? 'published' : fatwa.status,
//     });
//   };

//   const handleDraftAnswer = async () => {
//     setIsDrafting(true);
//     setAiAdminError('');
//     try {
//       const prompt = `أنت مساعد باحث لمفتي شرعي. اكتب مسودة إجابة شرعية متأصلة ومختصرة جداً بناءً على المذاهب الأربعة (أو الراجح منها) لهذا السؤال، لكي يراجعها المفتي قبل نشرها. اكتب الجواب مباشرة بدون مقدمات طويلة، واذكر دليلاً إن أمكن باختصار. السؤال: "${selectedFatwa.question}"`;
//       const draft = await callGeminiAPI(prompt);
//       setReplyData((current) => ({ ...current, answer: draft.trim() }));
//       addToast('تم إنشاء مسودة أولية للإجابة.', 'success');
//     } catch (error) {
//       setAiAdminError(error.message);
//       addToast(error.message, 'error');
//     } finally {
//       setIsDrafting(false);
//     }
//   };

//   const saveReply = async () => {
//     try {
//       await saveFatwaReply(selectedFatwa.id, {
//         ...replyData,
//         answeredBy: currentUser.name,
//       });
//       addToast('تم حفظ الرد بنجاح.', 'success');
//       setSelectedFatwa(null);
//     } catch (error) {
//       addToast(error.message, 'error');
//     }
//   };

//   const deleteFatwa = async () => {
//     try {
//       await deleteFatwaById(fatwaToDelete.id);
//       addToast('تم حذف الفتوى.', 'success');
//     } catch (error) {
//       addToast(error.message, 'error');
//     } finally {
//       setFatwaToDelete(null);
//     }
//   };

//   const exportCSV = () => {
//     const headers = ['المعرف', 'الاسم', 'العمر', 'الجنس', 'المكان', 'السؤال', 'الجواب', 'التصنيف', 'الحالة', 'التاريخ'];
//     const rows = displayedFatwas.map((fatwa) => [
//       fatwa.id,
//       fatwa.name || 'مجهول',
//       fatwa.age,
//       fatwa.gender,
//       fatwa.location,
//       `"${(fatwa.question || '').replace(/"/g, '""')}"`,
//       `"${(fatwa.answer || '').replace(/"/g, '""')}"`,
//       fatwa.category,
//       fatwa.status,
//       fatwa.date,
//     ]);
//     const csvContent = `data:text/csv;charset=utf-8,\uFEFF${[headers.join(','), ...rows.map((row) => row.join(','))].join('\n')}`;
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement('a');
//     link.setAttribute('href', encodedUri);
//     link.setAttribute('download', 'fatwas_export.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">إدارة الفتاوى</h2>
//         <button onClick={exportCSV} className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow transition">
//           <Download size={18} className="ml-2" /> تصدير CSV
//         </button>
//       </div>

//       <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
//         <div className="flex bg-gray-50 dark:bg-gray-900 p-1 rounded-lg border border-gray-200 dark:border-gray-600">
//           <button onClick={() => setFilterStatus('all')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${filterStatus === 'all' ? 'bg-white dark:bg-gray-700 shadow text-emerald-700 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'}`}>الكل</button>
//           <button onClick={() => setFilterStatus('new')} className={`px-4 py-2 rounded-md text-sm font-bold transition flex items-center ${filterStatus === 'new' ? 'bg-white dark:bg-gray-700 shadow text-amber-600' : 'text-gray-600 dark:text-gray-400'}`}>
//             بانتظار الرد
//             {fatwas.filter((fatwa) => fatwa.status === 'new').length > 0 && <span className="mr-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full">{fatwas.filter((fatwa) => fatwa.status === 'new').length}</span>}
//           </button>
//           <button onClick={() => setFilterStatus('answered')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${filterStatus === 'answered' ? 'bg-white dark:bg-gray-700 shadow text-emerald-700 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'}`}>تم الرد</button>
//         </div>

//         <div className="flex-1" />

//         <select value={filterCat} onChange={(event) => setFilterCat(event.target.value)} className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-bold text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-emerald-500">
//           <option value="all">جميع التصنيفات</option>
//           {categories.map((cat) => (
//             <option key={cat.id || cat._id} value={cat.name}>
//               {cat.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-right">
//             <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300">
//               <tr>
//                 {/* <th className="p-4 font-medium">المعرف</th> */}
//                 <th className="p-4 font-medium">المستفتي</th>
//                 <th className="p-4 font-medium max-w-xs">السؤال</th>
//                 <th className="p-4 font-medium">الحالة</th>
//                 <th className="p-4 font-medium">التصنيف</th>
//                 <th className="p-4 font-medium">إجراءات</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
//               {displayedFatwas.length > 0 ? (
//                 displayedFatwas.map((fatwa) => (
//                   <tr key={fatwa.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition">
//                     {/* <td className="p-4 text-sm">#{fatwa.id}</td> */}
//                     <td className="p-4">
//                       <div className="font-medium">{fatwa.name || 'مجهول'}</div>
//                       <div className="text-xs text-gray-500">{fatwa.location} • {fatwa.gender} • {fatwa.age}س</div>
//                     </td>
//                     <td className="p-4 truncate max-w-xs" title={fatwa.question}>{fatwa.question}</td>
//                     <td className="p-4">
//                       <span className={`px-2 py-1 text-xs rounded-full ${fatwa.status === 'new' ? 'bg-amber-100 text-amber-800' : fatwa.status === 'published' ? 'bg-emerald-100 text-emerald-800' : fatwa.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}`}>
//                         {fatwa.status === 'new' ? 'جديدة' : fatwa.status === 'published' ? 'منشورة' : fatwa.status === 'draft' ? 'مسودة' : fatwa.status}
//                       </span>
//                       {fatwa.answeredBy && <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-2 font-bold">أجاب: {fatwa.answeredBy}</div>}
//                     </td>
//                     <td className="p-4 text-sm">{fatwa.category || '-'}</td>
//                     <td className="p-4 space-x-2 space-x-reverse">
//                       <button onClick={() => openModal(fatwa)} className="text-emerald-600 hover:underline text-sm font-medium">عرض / رد</button>
//                       <button onClick={() => setFatwaToDelete(fatwa)} className="text-red-500 hover:underline text-sm font-medium">حذف</button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="p-8 text-center text-gray-500">لا توجد فتاوى مطابقة للفلتر الحالي.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {selectedFatwa && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
//             <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700">
//               <h3 className="text-xl font-bold">الرد على الفتوى #{selectedFatwa.id}</h3>
//               <button onClick={() => setSelectedFatwa(null)} className="text-gray-500 hover:text-red-500"><XCircle size={24} /></button>
//             </div>

//             <div className="p-6 overflow-y-auto flex-1 space-y-6">
//               <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex flex-wrap gap-4 text-sm text-blue-800 dark:text-blue-300">
//                 <span><strong>الاسم:</strong> {selectedFatwa.name || 'مجهول'}</span>
//                 <span><strong>العمر:</strong> {selectedFatwa.age}</span>
//                 <span><strong>الجنس:</strong> {selectedFatwa.gender}</span>
//                 <span><strong>المكان:</strong> {selectedFatwa.location}</span>
//                 <span><strong>تاريخ:</strong> {selectedFatwa.date}</span>
//                 <span className={`px-2 py-0.5 rounded-full ${selectedFatwa.wantsToPublish === false ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'}`}>
//                   <strong>تفضيل النشر:</strong> {selectedFatwa.wantsToPublish === false ? 'إجابة خاصة' : 'عامة'}
//                 </span>
//                 {selectedFatwa.email && <span dir="ltr" className="text-right"><strong>البريد:</strong> {selectedFatwa.email}</span>}
//               </div>

//               <div>
//                 <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">نص السؤال:</h4>
//                 <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 whitespace-pre-wrap text-lg">
//                   {selectedFatwa.question}
//                 </div>
//               </div>

//               <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
//                 <div>
//                   <div className="flex justify-between items-center mb-2">
//                     <label className="block font-bold">الإجابة الشرعية:</label>
//                     <button type="button" onClick={handleDraftAnswer} disabled={isDrafting} className="flex items-center text-sm font-bold bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1.5 rounded transition disabled:opacity-50" title="توليد مسودة إجابة أولية مساعدة للشيخ باستخدام الذكاء الاصطناعي">
//                       <Sparkles size={16} className="ml-1" />
//                       {isDrafting ? 'جاري استخراج مسودة إجابة...' : '✨ اقتراح مسودة إجابة (AI)'}
//                     </button>
//                   </div>
//                   <textarea rows="6" value={replyData.answer} onChange={(event) => setReplyData({ ...replyData, answer: event.target.value })} className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="اكتب الإجابة هنا بوضوح وتأصيل شرعي..." />
//                   {aiAdminError && <p className="text-red-500 text-xs mt-1">{aiAdminError}</p>}
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block font-bold mb-2">التصنيف:</label>
//                     <select value={replyData.category} onChange={(event) => setReplyData({ ...replyData, category: event.target.value })} className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
//                       <option value="">اختر تصنيفاً...</option>
//                       {categories.map((cat) => (
//                         <option key={cat.id || cat._id} value={cat.name}>
//                           {cat.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block font-bold mb-2">الإجراء / الحالة:</label>
//                     <select value={replyData.status} onChange={(event) => setReplyData({ ...replyData, status: event.target.value })} className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
//                       <option value="published">نشر للعامة</option>
//                       <option value="answered">رد خاص (لا ينشر)</option>
//                       <option value="draft">حفظ كمسودة</option>
//                       <option value="archived">أرشفة</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3 space-x-reverse">
//               <button onClick={() => setSelectedFatwa(null)} className="px-5 py-2 rounded border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition">إلغاء</button>
//               <button onClick={saveReply} className="px-5 py-2 rounded bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition">حفظ التغييرات</button>
//             </div>
//           </div>
//         </div>
//       )}

//       <ConfirmDialog
//         open={Boolean(fatwaToDelete)}
//         title="حذف الفتوى"
//         message={fatwaToDelete ? `هل أنت متأكد من حذف الفتوى رقم #${fatwaToDelete.id}؟ لا يمكن التراجع بعد الحذف.` : ''}
//         confirmLabel="حذف"
//         cancelLabel="إلغاء"
//         onCancel={() => setFatwaToDelete(null)}
//         onConfirm={deleteFatwa}
//       />
//     </div>
//   );
// }

// export default AdminFatwasPage;

// // import { Download, Sparkles, XCircle } from 'lucide-react';
// // import { useMemo, useState } from 'react';
// // import { CATEGORIES } from '../../../app/constants';
// // import { callGeminiAPI } from '../../../app/services/gemini';
// // import ConfirmDialog from '../../../shared/ui/ConfirmDialog';
// // import { useToast } from '../../../shared/ui/ToastProvider';

// // function AdminFatwasPage({ currentUser, deleteFatwaById, fatwas, saveFatwaReply }) {
// //   const { addToast } = useToast();
// //   const [selectedFatwa, setSelectedFatwa] = useState(null);
// //   const [replyData, setReplyData] = useState({ answer: '', category: '', status: 'published' });
// //   const [filterStatus, setFilterStatus] = useState('all');
// //   const [filterCat, setFilterCat] = useState('all');
// //   const [isDrafting, setIsDrafting] = useState(false);
// //   const [aiAdminError, setAiAdminError] = useState('');
// //   const [fatwaToDelete, setFatwaToDelete] = useState(null);

// //   const displayedFatwas = useMemo(
// //     () =>
// //       fatwas.filter((fatwa) => {
// //         const statusMatch =
// //           filterStatus === 'all' ||
// //           (filterStatus === 'new' && fatwa.status === 'new') ||
// //           (filterStatus === 'answered' && fatwa.status !== 'new');
// //         const categoryMatch = filterCat === 'all' || fatwa.category === filterCat;
// //         return statusMatch && categoryMatch;
// //       }),
// //     [fatwas, filterStatus, filterCat],
// //   );

// //   const openModal = (fatwa) => {
// //     setSelectedFatwa(fatwa);
// //     setAiAdminError('');
// //     setReplyData({
// //       answer: fatwa.answer || '',
// //       category: fatwa.category || CATEGORIES[0],
// //       status: fatwa.status === 'new' ? 'published' : fatwa.status,
// //     });
// //   };

// //   const handleDraftAnswer = async () => {
// //     setIsDrafting(true);
// //     setAiAdminError('');
// //     try {
// //       const prompt = `أنت مساعد باحث لمفتي شرعي. اكتب مسودة إجابة شرعية متأصلة ومختصرة جداً بناءً على المذاهب الأربعة (أو الراجح منها) لهذا السؤال، لكي يراجعها المفتي قبل نشرها. اكتب الجواب مباشرة بدون مقدمات طويلة، واذكر دليلاً إن أمكن باختصار. السؤال: "${selectedFatwa.question}"`;
// //       const draft = await callGeminiAPI(prompt);
// //       setReplyData((current) => ({ ...current, answer: draft.trim() }));
// //       addToast('تم إنشاء مسودة أولية للإجابة.', 'success');
// //     } catch (error) {
// //       setAiAdminError(error.message);
// //       addToast(error.message, 'error');
// //     } finally {
// //       setIsDrafting(false);
// //     }
// //   };

// //   const saveReply = async () => {
// //     try {
// //       await saveFatwaReply(selectedFatwa.id, {
// //         ...replyData,
// //         answeredBy: currentUser.name,
// //       });
// //       addToast('تم حفظ الرد بنجاح.', 'success');
// //       setSelectedFatwa(null);
// //     } catch (error) {
// //       addToast(error.message, 'error');
// //     }
// //   };

// //   const deleteFatwa = async () => {
// //     try {
// //       await deleteFatwaById(fatwaToDelete.id);
// //       addToast('تم حذف الفتوى.', 'success');
// //     } catch (error) {
// //       addToast(error.message, 'error');
// //     } finally {
// //       setFatwaToDelete(null);
// //     }
// //   };

// //   const exportCSV = () => {
// //     const headers = ['المعرف', 'الاسم', 'العمر', 'الجنس', 'المكان', 'السؤال', 'الجواب', 'التصنيف', 'الحالة', 'التاريخ'];
// //     const rows = displayedFatwas.map((fatwa) => [
// //       fatwa.id,
// //       fatwa.name || 'مجهول',
// //       fatwa.age,
// //       fatwa.gender,
// //       fatwa.location,
// //       `"${(fatwa.question || '').replace(/"/g, '""')}"`,
// //       `"${(fatwa.answer || '').replace(/"/g, '""')}"`,
// //       fatwa.category,
// //       fatwa.status,
// //       fatwa.date,
// //     ]);
// //     const csvContent = `data:text/csv;charset=utf-8,\uFEFF${[headers.join(','), ...rows.map((row) => row.join(','))].join('\n')}`;
// //     const encodedUri = encodeURI(csvContent);
// //     const link = document.createElement('a');
// //     link.setAttribute('href', encodedUri);
// //     link.setAttribute('download', 'fatwas_export.csv');
// //     document.body.appendChild(link);
// //     link.click();
// //     document.body.removeChild(link);
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex justify-between items-center">
// //         <h2 className="text-2xl font-bold">إدارة الفتاوى</h2>
// //         <button onClick={exportCSV} className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow transition">
// //           <Download size={18} className="ml-2" /> تصدير CSV
// //         </button>
// //       </div>

// //       <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
// //         <div className="flex bg-gray-50 dark:bg-gray-900 p-1 rounded-lg border border-gray-200 dark:border-gray-600">
// //           <button onClick={() => setFilterStatus('all')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${filterStatus === 'all' ? 'bg-white dark:bg-gray-700 shadow text-emerald-700 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'}`}>الكل</button>
// //           <button onClick={() => setFilterStatus('new')} className={`px-4 py-2 rounded-md text-sm font-bold transition flex items-center ${filterStatus === 'new' ? 'bg-white dark:bg-gray-700 shadow text-amber-600' : 'text-gray-600 dark:text-gray-400'}`}>
// //             بانتظار الرد
// //             {fatwas.filter((fatwa) => fatwa.status === 'new').length > 0 && <span className="mr-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full">{fatwas.filter((fatwa) => fatwa.status === 'new').length}</span>}
// //           </button>
// //           <button onClick={() => setFilterStatus('answered')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${filterStatus === 'answered' ? 'bg-white dark:bg-gray-700 shadow text-emerald-700 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'}`}>تم الرد</button>
// //         </div>

// //         <div className="flex-1" />

// //         <select value={filterCat} onChange={(event) => setFilterCat(event.target.value)} className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-bold text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-emerald-500">
// //           <option value="all">جميع التصنيفات</option>
// //           {CATEGORIES.map((category) => (
// //             <option key={category} value={category}>
// //               {category}
// //             </option>
// //           ))}
// //         </select>
// //       </div>

// //       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
// //         <div className="overflow-x-auto">
// //           <table className="w-full text-right">
// //             <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300">
// //               <tr>
// //                 <th className="p-4 font-medium">المعرف</th>
// //                 <th className="p-4 font-medium">المستفتي</th>
// //                 <th className="p-4 font-medium max-w-xs">السؤال</th>
// //                 <th className="p-4 font-medium">الحالة</th>
// //                 <th className="p-4 font-medium">التصنيف</th>
// //                 <th className="p-4 font-medium">إجراءات</th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
// //               {displayedFatwas.length > 0 ? (
// //                 displayedFatwas.map((fatwa) => (
// //                   <tr key={fatwa.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition">
// //                     <td className="p-4 text-sm">#{fatwa.id}</td>
// //                     <td className="p-4">
// //                       <div className="font-medium">{fatwa.name || 'مجهول'}</div>
// //                       <div className="text-xs text-gray-500">{fatwa.location} • {fatwa.gender} • {fatwa.age}س</div>
// //                     </td>
// //                     <td className="p-4 truncate max-w-xs" title={fatwa.question}>{fatwa.question}</td>
// //                     <td className="p-4">
// //                       <span className={`px-2 py-1 text-xs rounded-full ${fatwa.status === 'new' ? 'bg-amber-100 text-amber-800' : fatwa.status === 'published' ? 'bg-emerald-100 text-emerald-800' : fatwa.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}`}>
// //                         {fatwa.status === 'new' ? 'جديدة' : fatwa.status === 'published' ? 'منشورة' : fatwa.status === 'draft' ? 'مسودة' : fatwa.status}
// //                       </span>
// //                       {fatwa.answeredBy && <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-2 font-bold">أجاب: {fatwa.answeredBy}</div>}
// //                     </td>
// //                     <td className="p-4 text-sm">{fatwa.category || '-'}</td>
// //                     <td className="p-4 space-x-2 space-x-reverse">
// //                       <button onClick={() => openModal(fatwa)} className="text-emerald-600 hover:underline text-sm font-medium">عرض / رد</button>
// //                       <button onClick={() => setFatwaToDelete(fatwa)} className="text-red-500 hover:underline text-sm font-medium">حذف</button>
// //                     </td>
// //                   </tr>
// //                 ))
// //               ) : (
// //                 <tr>
// //                   <td colSpan="6" className="p-8 text-center text-gray-500">لا توجد فتاوى مطابقة للفلتر الحالي.</td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       {selectedFatwa && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
// //           <div className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
// //             <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700">
// //               <h3 className="text-xl font-bold">الرد على الفتوى #{selectedFatwa.id}</h3>
// //               <button onClick={() => setSelectedFatwa(null)} className="text-gray-500 hover:text-red-500"><XCircle size={24} /></button>
// //             </div>

// //             <div className="p-6 overflow-y-auto flex-1 space-y-6">
// //               <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex flex-wrap gap-4 text-sm text-blue-800 dark:text-blue-300">
// //                 <span><strong>الاسم:</strong> {selectedFatwa.name || 'مجهول'}</span>
// //                 <span><strong>العمر:</strong> {selectedFatwa.age}</span>
// //                 <span><strong>الجنس:</strong> {selectedFatwa.gender}</span>
// //                 <span><strong>المكان:</strong> {selectedFatwa.location}</span>
// //                 <span><strong>تاريخ:</strong> {selectedFatwa.date}</span>
// //                 <span className={`px-2 py-0.5 rounded-full ${selectedFatwa.wantsToPublish === false ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'}`}>
// //                   <strong>تفضيل النشر:</strong> {selectedFatwa.wantsToPublish === false ? 'إجابة خاصة' : 'عامة'}
// //                 </span>
// //                 {selectedFatwa.email && <span dir="ltr" className="text-right"><strong>البريد:</strong> {selectedFatwa.email}</span>}
// //               </div>

// //               <div>
// //                 <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">نص السؤال:</h4>
// //                 <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 whitespace-pre-wrap text-lg">
// //                   {selectedFatwa.question}
// //                 </div>
// //               </div>

// //               <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
// //                 <div>
// //                   <div className="flex justify-between items-center mb-2">
// //                     <label className="block font-bold">الإجابة الشرعية:</label>
// //                     <button type="button" onClick={handleDraftAnswer} disabled={isDrafting} className="flex items-center text-sm font-bold bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1.5 rounded transition disabled:opacity-50" title="توليد مسودة إجابة أولية مساعدة للشيخ باستخدام الذكاء الاصطناعي">
// //                       <Sparkles size={16} className="ml-1" />
// //                       {isDrafting ? 'جاري استخراج مسودة إجابة...' : '✨ اقتراح مسودة إجابة (AI)'}
// //                     </button>
// //                   </div>
// //                   <textarea rows="6" value={replyData.answer} onChange={(event) => setReplyData({ ...replyData, answer: event.target.value })} className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="اكتب الإجابة هنا بوضوح وتأصيل شرعي..." />
// //                   {aiAdminError && <p className="text-red-500 text-xs mt-1">{aiAdminError}</p>}
// //                 </div>
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                   <div>
// //                     <label className="block font-bold mb-2">التصنيف:</label>
// //                     <select value={replyData.category} onChange={(event) => setReplyData({ ...replyData, category: event.target.value })} className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
// //                       <option value="">اختر تصنيفاً...</option>
// //                       {CATEGORIES.map((category) => (
// //                         <option key={category} value={category}>
// //                           {category}
// //                         </option>
// //                       ))}
// //                     </select>
// //                   </div>
// //                   <div>
// //                     <label className="block font-bold mb-2">الإجراء / الحالة:</label>
// //                     <select value={replyData.status} onChange={(event) => setReplyData({ ...replyData, status: event.target.value })} className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
// //                       <option value="published">نشر للعامة</option>
// //                       <option value="answered">رد خاص (لا ينشر)</option>
// //                       <option value="draft">حفظ كمسودة</option>
// //                       <option value="archived">أرشفة</option>
// //                     </select>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3 space-x-reverse">
// //               <button onClick={() => setSelectedFatwa(null)} className="px-5 py-2 rounded border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition">إلغاء</button>
// //               <button onClick={saveReply} className="px-5 py-2 rounded bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition">حفظ التغييرات</button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       <ConfirmDialog
// //         open={Boolean(fatwaToDelete)}
// //         title="حذف الفتوى"
// //         message={fatwaToDelete ? `هل أنت متأكد من حذف الفتوى رقم #${fatwaToDelete.id}؟ لا يمكن التراجع بعد الحذف.` : ''}
// //         confirmLabel="حذف"
// //         cancelLabel="إلغاء"
// //         onCancel={() => setFatwaToDelete(null)}
// //         onConfirm={deleteFatwa}
// //       />
// //     </div>
// //   );
// // }

// // export default AdminFatwasPage;
