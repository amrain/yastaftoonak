import { BookOpen, Target, ShieldCheck, Heart } from 'lucide-react';
import IslamicStar from '../../../shared/icons/IslamicStar';

function AboutPage({ themeColors }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 min-h-[60vh]">
      
      {/* تم إزالة أيقونة رأس الصفحة لتنظيف التصميم */}

      {/* الديباجة والتعريف الرئيسي */}
      <div className={`${themeColors.card} p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden mb-10`}>
        <IslamicStar className="absolute -top-10 -right-10 w-40 h-40 text-emerald-50 dark:text-emerald-900/20" />
        
        <div className="relative z-10 text-center mb-10 border-b border-gray-100 dark:border-gray-700 pb-8">
          {/* نقل عنوان "من نحن" إلى هنا كعنوان مدمج وأنيق */}
          <h1 className={`text-3xl md:text-4xl font-bold mb-6 font-reem ${themeColors.primaryText}`}>من نحن</h1>
          <p className="text-2xl leading-relaxed font-amiri text-slate-800 dark:text-slate-200 italic">
            "الحمد لله، والصلاة والسلام على رسول الله وعلى آله وصحبه ومن والاه، وبعد.."
          </p>
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold font-amiri text-amber-700 dark:text-amber-400 mb-4">يستفتونك</h2>
          <p className={`text-xl leading-loose font-amiri ${themeColors.textMain}`}>
            هي منصة إلكترونية شرعية تابعة لـ 
            <strong className="text-amber-600 dark:text-amber-400 mx-1">
               ملتقى العلم والإصلاح في غزة
            </strong>.
            تهدف المنصة إلى توفير مرجعية شرعية موثوقة للمسلمين، للإجابة على تساؤلاتهم واستفساراتهم الفقهية والعقدية، وفق منهج أهل السنة والجماعة، وبإشراف نخبة من العلماء والدعاة المتخصصين.
          </p>
        </div>
      </div>

      {/* باقي الأقسام تبدو رائعة، سنبقي عليها */}

      {/* شبكة الرؤية والرسالة */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className={`${themeColors.card} p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md`}>
          <div className="flex items-center mb-4">
            <Target className="text-amber-600 ml-3" size={28} />
            <h3 className={`text-2xl font-bold font-amiri ${themeColors.primaryText}`}>رؤيتنا</h3>
          </div>
          <p className={`text-lg leading-relaxed font-amiri ${themeColors.textMain}`}>
            أن نكون الوجهة الرقمية الموثوقة والآمنة التي يلجأ إليها المسلم للحصول على إجابات تساؤلاته الشرعية، ولنشر الوعي الديني الرصين المرتكز على الكتاب والسنة بفهم سلف الأمة.
          </p>
        </div>

        <div className={`${themeColors.card} p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md`}>
          <div className="flex items-center mb-4">
            <BookOpen className="text-amber-600 ml-3" size={28} />
            <h3 className={`text-2xl font-bold font-amiri ${themeColors.primaryText}`}>رسالتنا</h3>
          </div>
          <p className={`text-lg leading-relaxed font-amiri ${themeColors.textMain}`}>
            تيسير وصول الفتوى الشرعية المؤصلة والمبنية على الدليل لطالبيها، وتوظيف التقنية الحديثة لخدمة العلم الشرعي، وعلاج الحيرة عند السائلين بأسلوب حكيم يراعي واقع ومآلات الأمور.
          </p>
        </div>
      </div>

      {/* قسم القيم */}
      <div className="bg-amber-50/50 dark:bg-amber-900/10 p-8 rounded-3xl border border-amber-100 dark:border-amber-900/30">
        <h3 className="text-2xl font-bold font-amiri text-amber-800 dark:text-amber-400 mb-8 flex justify-center items-center">
          <ShieldCheck className="ml-2" /> قيمنا
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <span className="block text-xl font-bold text-amber-700 dark:text-amber-500 font-amiri mb-2 underline decoration-amber-300 underline-offset-8">الأمانة العلمية</span>
            <p className={`${themeColors.textMain} text-md`}>التثبت والرجوع إلى المصادر المعتمدة.</p>
          </div>
          <div className="text-center border-y md:border-y-0 md:border-x border-amber-200 dark:border-amber-800 py-6 md:py-0 px-4">
            <span className="block text-xl font-bold text-amber-700 dark:text-amber-500 font-amiri mb-2 underline decoration-amber-300 underline-offset-8">السرية والخصوصية</span>
            <p className={`${themeColors.textMain} text-md`}>الحفاظ التام على خصوصية السائلين وأسئلتهم.</p>
          </div>
          <div className="text-center">
            <span className="block text-xl font-bold text-amber-700 dark:text-amber-500 font-amiri mb-2 underline decoration-amber-300 underline-offset-8">الوسطية والاعتدال</span>
            <p className={`${themeColors.textMain} text-md`}>تقديم الفتوى الميسرة التي لا إفراط فيها ولا تفريط.</p>
          </div>
        </div>
      </div>

      {/* الخاتمة */}
      <footer className="mt-16 text-center">
        <p className={`text-xl font-amiri leading-loose ${themeColors.textMain} max-w-2xl mx-auto italic`}>
          "نسأل الله أن يتقبل منا، وأن يجعلنا والمسلمين مفاتيح للخير مغاليق للشر، مبلغين لدينه، متبعين لسنة نبيه صلى الله عليه وسلم."
        </p>
        <Heart className="mx-auto mt-4 text-amber-600 fill-amber-600 animate-pulse" size={20} />
      </footer>
    </div>
  );
}

export default AboutPage;
// import { Info } from 'lucide-react';
// import IslamicStar from '../../../shared/icons/IslamicStar';

// function AboutPage({ themeColors }) {
//   return (
//     <div className="max-w-4xl mx-auto px-4 py-20 text-center min-h-[60vh]">
//       <div className="inline-block p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-full mb-6 text-emerald-600 dark:text-emerald-400">
//         <Info className="h-12 w-12" />
//       </div>
//       <h1 className={`text-4xl md:text-5xl font-bold mb-8 font-reem ${themeColors.primaryText}`}>من نحن</h1>
//       <div className={`${themeColors.card} p-10 rounded-tl-3xl rounded-br-3xl shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden`}>
//         <IslamicStar className="absolute -top-10 -right-10 w-40 h-40 text-emerald-50 dark:text-emerald-900/20" />
//         <p className={`text-xl leading-loose font-amiri ${themeColors.textMain} relative z-10`}>
          

//           "الحمد لله ، والصلاة والسلام على رسول الله وعلى آله وصحبه ومن والاه ، وبعد ..
// "يستفتونك" هي منصة إلكترونية شرعية تابعة لـ <strong className="text-amber-600 dark:text-amber-400">ملتقى العلم والإصلاح في غزة</strong>.
// تهدف المنصة إلى توفير مرجعية شرعية موثوقة للمسلمين، للإجابة على تساؤلاتهم واستفساراتهم الفقهية والعقدية، وفق منهج أهل السنة والجماعة، وبإشراف نخبة من العلماء والدعاة المتخصصين.

// ​رؤيتنا:
// أن نكون الوجهة الرقمية الموثوقة والآمنة التي يلجأ إليها المسلم للحصول على إجابات تساؤلاته الشرعية، ولنشر الوعي الديني الرصين المرتكز على الكتاب والسنة بفهم سلف الأمة.

// ​رسالتنا:
// تيسير وصول الفتوى الشرعية المؤصلة والمبنية على الدليل لطالبيها، وتوظيف التقنية الحديثة لخدمة العلم الشرعي، وعلاج الحيرة عند السائلين بأسلوب حكيم يراعي واقع ومآلات الأمور.

// ​قيمنا:
// • ​ *الأمانة العلمية:* التثبت والرجوع إلى المصادر المعتمدة.
// • ​ *السرية والخصوصية:* الحفاظ التام على خصوصية السائلين وأسئلتهم.
// • ​ *الوسطية والاعتدال:* تقديم الفتوى الميسرة التي لا إفراط فيها ولا تفريط.

// نسأل الله أن يتقبل منا، وأن يجعلنا والمسلمين مفاتيح للخير مغاليق للشر، مبلغين لدينه، متبعين لسنة نبيه صلى الله عليه وسلم."



//          </p>
//       </div>
//     </div>
//   );
// }

// export default AboutPage;
