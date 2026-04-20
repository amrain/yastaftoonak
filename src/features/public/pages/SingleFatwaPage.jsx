import { ChevronRight, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchFatwaById } from '../../../services/api/fatwaApi';
import IslamicStar from '../../../shared/icons/IslamicStar';
import { FatwaLinkParser } from '../../../shared/ui/FatwaLinkParser';

function SingleFatwaPage({ fatwas, themeColors }) {  const navigate = useNavigate();
  const { fatwaId } = useParams();
  const [remoteFatwa, setRemoteFatwa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fatwa = fatwas.find((item) => String(item.id) === fatwaId) || remoteFatwa;

  useEffect(() => {
    let active = true;

    async function loadFatwa() {
      if (fatwa) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const { fatwa: fetchedFatwa } = await fetchFatwaById(fatwaId);
        if (active) {
          setRemoteFatwa(fetchedFatwa);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadFatwa();

    return () => {
      active = false;
    };
  }, [fatwa, fatwaId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center min-h-[60vh]">
        <p className="text-xl">جاري تحميل الفتوى...</p>
      </div>
    );
  }

  if (!fatwa) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center min-h-[60vh]">
        <p className="text-xl">{error || 'عذراً، الفتوى غير موجودة.'}</p>
        <button onClick={() => navigate('/fatwas')} className="text-emerald-600 mt-4 hover:underline">
          العودة للفتاوى
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 min-h-[60vh] animate-in fade-in duration-300">
      <button onClick={() => navigate('/fatwas')} className="text-emerald-600 dark:text-emerald-400 mb-8 flex items-center hover:underline font-bold transition-colors">
        <ChevronRight className="w-5 h-5 ml-1" /> العودة لقائمة الفتاوى
      </button>

      <div className="bg-white dark:bg-gray-800 w-full rounded-3xl shadow-xl overflow-hidden flex flex-col border-t-4 border-amber-500">
        <div className="p-4 md:px-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/80">
          <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold px-4 py-1.5 rounded-full">
            {fatwa.category}
          </span>
          <span className="text-sm text-gray-500 flex items-center"><Clock className="w-4 h-4 ml-1 opacity-70" /> {fatwa.date}</span>
        </div>

        <div className="p-6 md:p-10">
          {/* <div className="mb-8 relative">
            <div className="absolute -right-4 md:-right-6 top-0 bottom-0 w-1 bg-amber-400 rounded-l-md" />
            <h3 className={`!font-salaf text-2xl md:text-3xl font-normal ${themeColors.textMain} leading-loose text-justify pr-4 md:pr-6`}>
              <span className="text-amber-500 ml-3 font-sans text-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/30 w-8 h-8 inline-flex items-center justify-center rounded-full">س</span>
              {fatwa.question}
            </h3>
          </div> */}
          <div className="mb-8 relative">
  {/* الخط الجانبي الأصفر */}
  <div className="absolute -right-4 md:-right-6 top-0 bottom-0 w-1 bg-amber-400 rounded-l-md" />
  
  <h3 className={`!font-salaf text-2xl md:text-3xl font-normal ${themeColors.textMain} leading-[2] text-justify pr-4 md:pr-6`}>
    <span className="text-amber-500 ml-3 font-sans text-base border border-amber-200 bg-amber-50 dark:bg-amber-900/30 w-8 h-8 inline-flex items-center justify-center rounded-full">س</span>
    {fatwa.question}
  </h3>
</div>

          <div className="flex items-center justify-center my-8 opacity-40">
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-emerald-600" />
            <IslamicStar className="w-6 h-6 text-emerald-600 mx-4" />
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-emerald-600" />
          </div>

          <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-6 md:p-8 rounded-tl-3xl rounded-br-3xl border border-emerald-100 dark:border-emerald-800/50">
            <p className={`!font-salaf ${themeColors.textMain} text-xl md:text-2xl leading-[2] text-justify pr-4 md:pr-6`}>
              <span className="text-emerald-600 dark:text-emerald-400 font-sans font-bold ml-3 text-lg border border-emerald-200 bg-emerald-100 dark:bg-emerald-900/50 w-9 h-9 inline-flex items-center justify-center rounded-full shadow-sm">ج</span>
              <FatwaLinkParser text={fatwa.answer} />
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
          {fatwa.serialNumber ? <span>رقم الفتوى: #{fatwa.serialNumber}</span> : <span />}
          {fatwa.answeredBy && <span>أجاب: {fatwa.answeredBy}</span>}
        </div>
      </div>
    </div>
  );
}

export default SingleFatwaPage;
