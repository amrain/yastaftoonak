import { Info } from 'lucide-react';
import IslamicStar from '../../../shared/icons/IslamicStar';

function AboutPage({ themeColors }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center min-h-[60vh]">
      <div className="inline-block p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-full mb-6 text-emerald-600 dark:text-emerald-400">
        <Info className="h-12 w-12" />
      </div>
      <h1 className={`text-4xl md:text-5xl font-bold mb-8 font-reem ${themeColors.primaryText}`}>من نحن</h1>
      <div className={`${themeColors.card} p-10 rounded-tl-3xl rounded-br-3xl shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden`}>
        <IslamicStar className="absolute -top-10 -right-10 w-40 h-40 text-emerald-50 dark:text-emerald-900/20" />
        <p className={`text-xl leading-loose font-amiri ${themeColors.textMain} relative z-10`}>
          "يستفتونك" هي منصة إلكترونية شرعية تابعة لـ <strong className="text-amber-600 dark:text-amber-400">ملتقى العلم والإصلاح في غزة</strong>.
          نهدف إلى توفير مرجعية دينية موثوقة للمسلمين في كل مكان، للإجابة على تساؤلاتهم واستفساراتهم
          الفقهية والعقدية وفق منهج أهل السنة والجماعة، وبإشراف نخبة من العلماء والدعاة المختصين.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
