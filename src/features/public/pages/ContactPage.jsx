import { Mail, MapPin, Phone } from 'lucide-react';
import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

function ContactPage({ themeColors }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center min-h-[60vh]">
      <div className="inline-block p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-full mb-6 text-emerald-600 dark:text-emerald-400">
        <Mail className="h-12 w-12" />
      </div>
      <h1 className={`text-4xl md:text-5xl font-bold mb-6 font-reem ${themeColors.primaryText}`}>تواصل معنا</h1>
      <p className={`text-lg mb-8 ${themeColors.textMain}`}>للاستفسارات الإدارية والملاحظات، يسعدنا تواصلكم معنا.</p>

      <div className={`max-w-lg mx-auto text-right ${themeColors.card} p-8 rounded-xl shadow-md mb-12`}>
        <p className={`mb-4 flex items-center ${themeColors.textMain}`}><MapPin className="ml-3 h-5 w-5 text-emerald-600" /> <strong>العنوان:</strong> &nbsp; فلسطين - قطاع غزة</p>
        <p className={`flex items-center ${themeColors.textMain}`}><Phone className="ml-3 h-5 w-5 text-emerald-600" /> <strong>الهاتف:</strong> &nbsp; +970 000 000 000</p>
      </div>

      <h3 className={`text-2xl font-bold mb-6 font-tajawal ${themeColors.primaryText}`}>حساباتنا على منصات التواصل الاجتماعي</h3>
      <div className="flex flex-wrap justify-center gap-4 py-8 px-4 font-tajawal">
        <a href="https://facebook.com/moltgaalelm" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-3 bg-[#1877F2] text-white rounded-xl shadow-lg hover:bg-[#166fe5] hover:scale-105 transition-all duration-300"><FaFacebook size={24} /><span className="font-bold">فيس بوك</span></a>
        <a href="https://instagram.com/MOLTGAALELM" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-3 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white rounded-xl shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-300"><FaInstagram size={24} /><span className="font-bold">انستقرام</span></a>
        <a href="https://x.com/Moltgaalelm" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-3 bg-[#000000] text-white rounded-xl shadow-lg hover:bg-[#1a1a1a] hover:scale-105 transition-all duration-300"><FaXTwitter size={22} /><span className="font-bold">منصة X</span></a>
        <a href="https://www.youtube.com/@moltgaalelm" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-3 bg-[#FF0000] text-white rounded-xl shadow-lg hover:bg-[#cc0000] hover:scale-105 transition-all duration-300"><FaYoutube size={26} /><span className="font-bold">يوتيوب</span></a>
        <a href="https://wa.me/970XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-3 bg-[#25D366] text-white rounded-xl shadow-lg hover:bg-[#20bd5a] hover:scale-105 transition-all duration-300"><FaWhatsapp size={24} /><span className="font-bold">واتساب</span></a>
      </div>
    </div>
  );
}

export default ContactPage;
