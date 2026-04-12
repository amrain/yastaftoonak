import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AdminLoginPage from '../features/admin/pages/AdminLoginPage';
import AdminApp from '../features/admin/AdminApp';
import PublicApp from '../features/public/PublicApp';
import AboutPage from '../features/public/pages/AboutPage';
import ContactPage from '../features/public/pages/ContactPage';
import FatwaArchivePage from '../features/public/pages/FatwaArchivePage';
import HomePage from '../features/public/pages/HomePage';
import PrivacyPage from '../features/public/pages/PrivacyPage';
import SingleFatwaPage from '../features/public/pages/SingleFatwaPage';
import { useAppController } from './useAppController';

function AppRouter() {
  const controller = useAppController();

  return (
    <BrowserRouter>
      <RouterEffects />
      <Routes>
        <Route path="/" element={<PublicApp controller={controller} />}>
          <Route index element={<HomePage controller={controller} />} />
          <Route path="fatwas" element={<FatwaArchivePage controller={controller} />} />
          <Route
            path="fatwas/:fatwaId"
            element={<SingleFatwaPage fatwas={controller.fatwas} themeColors={controller.themeColors} />}
          />
          <Route path="about" element={<AboutPage themeColors={controller.themeColors} />} />
          <Route path="contact" element={<ContactPage themeColors={controller.themeColors} />} />
          <Route path="privacy" element={<PrivacyPage themeColors={controller.themeColors} />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage controller={controller} />} />
        <Route
          path="/admin/*"
          element={<RequireAdmin controller={controller}><AdminApp controller={controller} /></RequireAdmin>}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function RouterEffects() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.ctrlKey &&
        event.shiftKey &&
        (event.key === 'l' || event.key === 'L' || event.key === 'م')
      ) {
        navigate('/admin/login');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return null;
}

function RequireAdmin({ controller, children }) {
  if (!controller.authReady) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحقق من الجلسة...</div>;
  }

  if (!controller.currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default AppRouter;
