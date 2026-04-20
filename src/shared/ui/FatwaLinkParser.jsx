import { useNavigate } from 'react-router-dom';

// مكون لتحليل النص وإنشاء روابط للفتاوى
export function FatwaLinkParser({ text, className = '' }) {
  const navigate = useNavigate();

  if (!text || typeof text !== 'string') return <span className={className}>{text || ''}</span>;

  // دالة لتحليل النص وإنشاء روابط للفتاوى
  const parseFatwaLinks = (content) => {
    if (!content) return content;

    // نمط للبحث عن إشارات للفتاوى - يبحث عن رقم بعد كلمة الفتوى
    const fatwaPattern = /(?:الفتوى|فتوى).*?(\d+)/gi;

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = fatwaPattern.exec(content)) !== null) {
      // إضافة النص قبل المطابقة
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }

      // استخراج رقم الفتوى
      const fullMatch = match[0];
      const numberMatch = match[1]; // الرقم مع أو بدون #

      if (!numberMatch) {
        // إذا لم يكن هناك رقم، أضف النص كما هو
        parts.push(fullMatch);
        lastIndex = match.index + match[0].length;
        continue;
      }

      const fatwaNumber = numberMatch.replace('#', '');

      // إنشاء رابط قابل للنقر
      parts.push(
        <button
          key={`fatwa-link-${match.index}`}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/fatwas/${fatwaNumber}`);
          }}
          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline decoration-2 decoration-emerald-300 hover:decoration-emerald-500 transition-colors font-bold cursor-pointer"
          title={`الانتقال إلى الفتوى رقم ${fatwaNumber}`}
        >
          {fullMatch}
        </button>
      );

      lastIndex = match.index + match[0].length;
    }

    // إضافة باقي النص
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  };

  return (
    <span className={className}>
      {parseFatwaLinks(text)}
    </span>
  );
}