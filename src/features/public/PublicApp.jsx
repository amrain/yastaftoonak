import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

function PublicApp({ controller }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (page) => {
    const routes = {
      home: '/',
      fatwas: '/fatwas',
      about: '/about',
      contact: '/contact',
      privacy: '/privacy',
      login: '/admin/login',
    };

    navigate(routes[page] || '/');
    controller.setIsMenuOpen(false);
  };

  return (
    <div dir="rtl" className={`min-h-screen font-tajawal transition-colors duration-300 ${controller.themeColors.background} ${controller.themeColors.textMain}`}>
      <Navbar
        darkMode={controller.darkMode}
        isMenuOpen={controller.isMenuOpen}
        onNavigate={handleNavigate}
        onToggleDarkMode={() => controller.setDarkMode(!controller.darkMode)}
        onToggleMenu={() => controller.setIsMenuOpen(!controller.isMenuOpen)}
        pathname={location.pathname}
      />

      <main>
        <Outlet />
      </main>

      <Footer   onNavigate={handleNavigate} />
    </div>
  );
}

export default PublicApp;
