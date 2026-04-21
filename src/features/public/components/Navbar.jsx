import { BookOpen, Menu, Moon, Sun, X } from 'lucide-react';
import { globalStyles } from '../../../app/theme';
import logo from '../../../assets/image/logo.png'; // قم بتعديل المسار حسب مكان الصورة لديك

function Navbar({
  darkMode,
  isMenuOpen,
  onNavigate,
  onToggleDarkMode,
  onToggleMenu,
  pathname,
}) {
  return (
    <nav className="bg-emerald-800 text-white shadow-lg sticky top-0 z-50 border-b border-amber-500/30 dark:bg-emerald-900">
      <style>{globalStyles}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => onNavigate('home')} className="flex items-center hover:opacity-80 transition">
              <img 
                src={logo} 
                alt="شعار يستفتونك" 
                className="h-10 w-auto ml-2 object-contain" // أضفنا ml-2 بدل mr-2 لأن الموقع عربي
              />
              <span className="font-reem font-bold text-3xl mr-2 tracking-wide text-transparent bg-clip-text bg-gradient-to-l from-white to-amber-200">
                يستفتونك
              </span>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-6 space-x-reverse">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-amber-400 transition font-medium ${pathname === '/' ? 'text-amber-400' : ''}`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => onNavigate('fatwas')}
              className={`hover:text-amber-400 transition font-medium ${
                pathname.startsWith('/fatwas') ? 'text-amber-400' : ''
              }`}
            >
              الأسئلة المجاب عنها
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`hover:text-amber-400 transition font-medium ${pathname === '/about' ? 'text-amber-400' : ''}`}
            >
              من نحن
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className={`hover:text-amber-400 transition font-medium ${pathname === '/contact' ? 'text-amber-400' : ''}`}
            >
              تواصل معنا
            </button>
            <button onClick={onToggleDarkMode} className="p-2 rounded-full hover:bg-emerald-700 transition">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={onToggleDarkMode} className="p-2 rounded-full hover:bg-emerald-700 transition mr-2">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={onToggleMenu} className="p-2 rounded-md hover:bg-emerald-700 focus:outline-none">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-emerald-800 border-t border-emerald-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => onNavigate('home')}
              className={`block w-full text-right px-3 py-2 rounded-md hover:bg-emerald-700 ${pathname === '/' ? 'text-amber-400' : ''}`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => onNavigate('fatwas')}
              className={`block w-full text-right px-3 py-2 rounded-md hover:bg-emerald-700 ${
                pathname.startsWith('/fatwas') ? 'text-amber-400' : ''
              }`}
            >
              الأسئلة المجاب عنها
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`block w-full text-right px-3 py-2 rounded-md hover:bg-emerald-700 ${pathname === '/about' ? 'text-amber-400' : ''}`}
            >
              من نحن
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className={`block w-full text-right px-3 py-2 rounded-md hover:bg-emerald-700 ${pathname === '/contact' ? 'text-amber-400' : ''}`}
            >
              تواصل معنا
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
