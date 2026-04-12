import { BookOpen, Send } from 'lucide-react';
import IslamicStar from '../../../shared/icons/IslamicStar';

function Footer({  onNavigate }) {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 border-t-4 border-amber-500 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-16 -mr-16 text-gray-800 opacity-50">
        <IslamicStar className="w-64 h-64" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-6">
              <BookOpen className="h-7 w-7 text-amber-500 ml-2" />
              <h3 className="text-2xl font-bold text-white font-reem tracking-wider">يستفتونك</h3>
            </div>
            <p className="text-sm">
              منصة شرعية موثوقة تابعة لملتقى العلم والإصلاح في غزة، تهدف إلى إيصال الفتوى الشرعية المبنية
              على الكتاب والسنة بفهم سلف الأمة إلى كافة المسلمين.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => onNavigate('home')} className="hover:text-amber-500 transition">الرئيسية</button></li>
              <li><button onClick={() => onNavigate('fatwas')} className="hover:text-amber-500 transition">الأسئلة المجاب عنها</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-amber-500 transition">عن الملتقى</button></li>
              <li><button onClick={() => onNavigate('privacy')} className="hover:text-amber-500 transition">سياسة الخصوصية</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">تواصل معنا</h4>
            <ul className="space-y-2 text-sm">
              <li>غزة - فلسطين</li>
              <li>
                <a
                  href="https://t.me/moltgaalelm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0088cc] transition inline-flex items-center gap-2 mt-1"
                >
                  <Send size={14} /> t.me/moltgaalelm
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          <p  className="cursor-default select-none transition-colors hover:text-gray-400" title=" ">
            © {new Date().getFullYear()} ملتقى العلم والإصلاح. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
