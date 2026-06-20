import { useNavigate } from 'react-router-dom';

// مكون لتحليل النص وإنشاء روابط للفتاوى مع دعم أكواد الـ HTML من المحرر المنسق
export function FatwaLinkParser({ text, fatwas = [], className = '' }) {
  const navigate = useNavigate();
  const serialToIdMap = new Map(
    (fatwas || [])
      .filter((item) => item?.serialNumber !== undefined && item?.id)
      .map((item) => [String(item.serialNumber), item.id])
  );

  // إذا كان النص فارغاً
  if (!text || typeof text !== 'string') {
    return <span className={className} dir="rtl" dangerouslySetInnerHTML={{ __html: text || '' }} />;
  }

  // دالة لتحليل النص وإنشاء روابط للفتاوى
  const parseFatwaLinks = (content) => {
    if (!content) return content;

    // نمط للبحث عن إشارات للفتاوى - يبحث عن رقم بعد كلمة الفتوى
    const fatwaPattern = /(?:الفتوى|فتوى).*?(\d+)/gi;

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = fatwaPattern.exec(content)) !== null) {
      // إضافة النص (الذي يحتوي على أكواد HTML) قبل المطابقة
      if (match.index > lastIndex) {
        const textSegment = content.slice(lastIndex, match.index);
        parts.push(
          <span 
            key={`text-${lastIndex}`} 
            dangerouslySetInnerHTML={{ __html: textSegment }} 
          />
        );
      }

      // استخراج رقم الفتوى
      const fullMatch = match[0];
      const numberMatch = match[1];

      if (!numberMatch) {
        parts.push(<span key={`text-match-${match.index}`} dangerouslySetInnerHTML={{ __html: fullMatch }} />);
        lastIndex = match.index + match[0].length;
        continue;
      }

      const fatwaNumber = numberMatch.replace('#', '');
      const linkedFatwaId = serialToIdMap.get(fatwaNumber);

      if (!linkedFatwaId) {
        parts.push(<span key={`text-match-${match.index}`} dangerouslySetInnerHTML={{ __html: fullMatch }} />);
        lastIndex = match.index + match[0].length;
        continue;
      }

      // إنشاء رابط قابل للنقر
      parts.push(
        <button
          key={`fatwa-link-${match.index}`}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/fatwas/${linkedFatwaId}`);
          }}
          className="inline-flex mx-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline decoration-2 decoration-emerald-300 hover:decoration-emerald-500 transition-colors font-bold cursor-pointer"
          title={`الانتقال إلى الفتوى رقم ${fatwaNumber}`}
        >
          {/* إزالة أي وسوم HTML قد تكون علقت داخل نص الرابط بالخطأ */}
          {fullMatch.replace(/<\/?[^>]+(>|$)/g, "")}
        </button>
      );

      lastIndex = match.index + match[0].length;
    }

    // إضافة باقي النص
    if (lastIndex < content.length) {
      const remainingSegment = content.slice(lastIndex);
      parts.push(
        <span 
          key={`text-end-${lastIndex}`} 
          dangerouslySetInnerHTML={{ __html: remainingSegment }} 
        />
      );
    }

    return parts.length > 0 ? parts : <span dangerouslySetInnerHTML={{ __html: content }} />;
  };

  return (
    <div 
      dir="rtl" 
      className={`ql-editor p-0 text-right w-full block rtl ${className}`}
      style={{ textAlign: 'right', direction: 'rtl' }}
    >
      {parseFatwaLinks(text)}
    </div>
  );
}
// import { useNavigate } from 'react-router-dom';

// // مكون لتحليل النص وإنشاء روابط للفتاوى مع دعم أكواد الـ HTML من المحرر المنسق
// export function FatwaLinkParser({ text, fatwas = [], className = '' }) {
//   const navigate = useNavigate();
//   const serialToIdMap = new Map(
//     (fatwas || [])
//       .filter((item) => item?.serialNumber !== undefined && item?.id)
//       .map((item) => [String(item.serialNumber), item.id])
//   );

//   // إذا كان النص فارغاً
//   if (!text || typeof text !== 'string') {
//     return <span className={className} dangerouslySetInnerHTML={{ __html: text || '' }} />;
//   }

//   // دالة لتحليل النص وإنشاء روابط للفتاوى
//   const parseFatwaLinks = (content) => {
//     if (!content) return content;

//     // نمط للبحث عن إشارات للفتاوى - يبحث عن رقم بعد كلمة الفتوى
//     const fatwaPattern = /(?:الفتوى|فتوى).*?(\d+)/gi;

//     const parts = [];
//     let lastIndex = 0;
//     let match;

//     while ((match = fatwaPattern.exec(content)) !== null) {
//       // إضافة النص (الذي يحتوي على أكواد HTML) قبل المطابقة
//       if (match.index > lastIndex) {
//         const textSegment = content.slice(lastIndex, match.index);
//         parts.push(
//           <span 
//             key={`text-${lastIndex}`} 
//             dangerouslySetInnerHTML={{ __html: textSegment }} 
//           />
//         );
//       }

//       // استخراج رقم الفتوى
//       const fullMatch = match[0];
//       const numberMatch = match[1];

//       if (!numberMatch) {
//         parts.push(<span key={`text-match-${match.index}`} dangerouslySetInnerHTML={{ __html: fullMatch }} />);
//         lastIndex = match.index + match[0].length;
//         continue;
//       }

//       const fatwaNumber = numberMatch.replace('#', '');
//       const linkedFatwaId = serialToIdMap.get(fatwaNumber);

//       if (!linkedFatwaId) {
//         parts.push(<span key={`text-match-${match.index}`} dangerouslySetInnerHTML={{ __html: fullMatch }} />);
//         lastIndex = match.index + match[0].length;
//         continue;
//       }

//       // إنشاء رابط قابل للنقر
//       parts.push(
//         <button
//           key={`fatwa-link-${match.index}`}
//           onClick={(e) => {
//             e.preventDefault();
//             navigate(`/fatwas/${linkedFatwaId}`);
//           }}
//           className="inline-flex mx-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline decoration-2 decoration-emerald-300 hover:decoration-emerald-500 transition-colors font-bold cursor-pointer"
//           title={`الانتقال إلى الفتوى رقم ${fatwaNumber}`}
//         >
//           {/* إزالة أي وسوم HTML قد تكون علقت داخل نص الرابط بالخطأ */}
//           {fullMatch.replace(/<\/?[^>]+(>|$)/g, "")}
//         </button>
//       );

//       lastIndex = match.index + match[0].length;
//     }

//     // إضافة باقي النص
//     if (lastIndex < content.length) {
//       const remainingSegment = content.slice(lastIndex);
//       parts.push(
//         <span 
//           key={`text-end-${lastIndex}`} 
//           dangerouslySetInnerHTML={{ __html: remainingSegment }} 
//         />
//       );
//     }

//     return parts.length > 0 ? parts : <span dangerouslySetInnerHTML={{ __html: content }} />;
//   };

//   return (
//     <span className={`ql-editor p-0 text-justify w-full block ${className}`}>
//       {parseFatwaLinks(text)}
//     </span>
//   );
// }
// // import { useNavigate } from 'react-router-dom';

// // // مكون لتحليل النص وإنشاء روابط للفتاوى
// // export function FatwaLinkParser({ text, fatwas = [], className = '' }) {
// //   const navigate = useNavigate();
// //   const serialToIdMap = new Map(
// //     (fatwas || [])
// //       .filter((item) => item?.serialNumber !== undefined && item?.id)
// //       .map((item) => [String(item.serialNumber), item.id])
// //   );

// //   if (!text || typeof text !== 'string') return <span className={className}>{text || ''}</span>;

// //   // دالة لتحليل النص وإنشاء روابط للفتاوى
// //   const parseFatwaLinks = (content) => {
// //     if (!content) return content;

// //     // نمط للبحث عن إشارات للفتاوى - يبحث عن رقم بعد كلمة الفتوى
// //     const fatwaPattern = /(?:الفتوى|فتوى).*?(\d+)/gi;

// //     const parts = [];
// //     let lastIndex = 0;
// //     let match;

// //     while ((match = fatwaPattern.exec(content)) !== null) {
// //       // إضافة النص قبل المطابقة
// //       if (match.index > lastIndex) {
// //         parts.push(content.slice(lastIndex, match.index));
// //       }

// //       // استخراج رقم الفتوى
// //       const fullMatch = match[0];
// //       const numberMatch = match[1]; // الرقم مع أو بدون #

// //       if (!numberMatch) {
// //         // إذا لم يكن هناك رقم، أضف النص كما هو
// //         parts.push(fullMatch);
// //         lastIndex = match.index + match[0].length;
// //         continue;
// //       }

// //       const fatwaNumber = numberMatch.replace('#', '');
// //       const linkedFatwaId = serialToIdMap.get(fatwaNumber);

// //       if (!linkedFatwaId) {
// //         parts.push(fullMatch);
// //         lastIndex = match.index + match[0].length;
// //         continue;
// //       }

// //       // إنشاء رابط قابل للنقر
// //       parts.push(
// //         <button
// //           key={`fatwa-link-${match.index}`}
// //           onClick={(e) => {
// //             e.preventDefault();
// //             navigate(`/fatwas/${linkedFatwaId}`);
// //           }}
// //           className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline decoration-2 decoration-emerald-300 hover:decoration-emerald-500 transition-colors font-bold cursor-pointer"
// //           title={`الانتقال إلى الفتوى رقم ${fatwaNumber}`}
// //         >
// //           {fullMatch}
// //         </button>
// //       );

// //       lastIndex = match.index + match[0].length;
// //     }

// //     // إضافة باقي النص
// //     if (lastIndex < content.length) {
// //       parts.push(content.slice(lastIndex));
// //     }

// //     return parts.length > 0 ? parts : content;
// //   };

// //   return (
// //     <span className={className}>
// //       {parseFatwaLinks(text)}
// //     </span>
// //   );
// // }