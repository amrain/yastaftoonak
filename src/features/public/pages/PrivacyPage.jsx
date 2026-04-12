import { FileText } from 'lucide-react';

function PrivacyPage({ themeColors }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 min-h-[60vh]">
      <FileText className={`h-16 w-16 mx-auto mb-6 ${themeColors.primaryText} block`} />
      <h1 className={`text-4xl font-bold mb-6 font-tajawal ${themeColors.primaryText} text-center`}>سياسة الخصوصية</h1>
      <div className={`${themeColors.card} p-8 rounded-xl shadow-md ${themeColors.textMain} leading-relaxed`}>
        <h3 className="font-bold text-xl mb-3">1. جمع المعلومات</h3>
        <p className="mb-4">نحن نجمع المعلومات التي تقدمها طواعية عند إرسال فتوى (مثل العمر، الجنس، البلد). الاسم اختياري تماماً.</p>
        <h3 className="font-bold text-xl mb-3">2. استخدام المعلومات</h3>
        <p className="mb-4">تستخدم المعلومات المدخلة حصرياً لغرض تقديم الإجابة المناسبة لحالتك، وللأغراض الإحصائية الداخلية لتحسين خدماتنا.</p>
        <h3 className="font-bold text-xl mb-3">3. حماية البيانات</h3>
        <p className="mb-4">نحن نتخذ إجراءات أمنية لحماية بياناتك من الوصول غير المصرح به. لا يتم نشر أسماء المستفتين أبداً عند نشر الفتاوى على الموقع.</p>
      </div>
    </div>
  );
}

export default PrivacyPage;
