import { useNavigate } from 'react-router-dom';
import FatwaForm from '../components/FatwaForm';
import Hero from '../components/Hero';
import PublishedFatwas from '../components/PublishedFatwas';

function HomePage({ controller }) {
  const navigate = useNavigate();

  if (controller.loadingFatwas) {
    return <div className="min-h-[60vh] flex items-center justify-center text-xl">جاري تحميل المحتوى...</div>;
  }

  return (
    <>
      <Hero />
      <FatwaForm
        createFatwa={controller.createFatwa}
        setShowSuccessModal={controller.setShowSuccessModal}
        showSuccessModal={controller.showSuccessModal}
        themeColors={controller.themeColors}
      />
      <PublishedFatwas
        fatwas={controller.fatwas}
        isHomePage
        onFatwaClick={(fatwaId) => navigate(`/fatwas/${fatwaId}`)}
        onOpenArchive={() => navigate('/fatwas')}
        themeColors={controller.themeColors}
      />
    </>
  );
}

export default HomePage;
