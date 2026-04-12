import { useNavigate } from 'react-router-dom';
import PublishedFatwas from '../components/PublishedFatwas';

function FatwaArchivePage({ controller }) {
  const navigate = useNavigate();

  if (controller.loadingFatwas) {
    return <div className="min-h-[60vh] flex items-center justify-center text-xl">جاري تحميل الفتاوى...</div>;
  }

  return (
    <div className="min-h-[60vh] pt-10">
      <PublishedFatwas
        fatwas={controller.fatwas}
        categories={controller.categories} // <--- أضف هذا السطر هنا
        isHomePage={false}
        onFatwaClick={(fatwaId) => navigate(`/fatwas/${fatwaId}`)}
        onOpenArchive={() => {}}
        themeColors={controller.themeColors}
      />
    </div>
  );
}

export default FatwaArchivePage;
