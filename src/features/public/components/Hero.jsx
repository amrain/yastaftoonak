import { Send } from 'lucide-react';
import IslamicStar from '../../../shared/icons/IslamicStar';

function Hero() {
  return (
    <div className="relative py-24 overflow-hidden bg-islamic">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-block mb-4 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <IslamicStar className="w-8 h-8 text-amber-400 animate-pulse" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 font-reem tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-amber-200 drop-shadow-lg leading-[1.5] pb-2">
          يستفتونك
        </h1>
        <p className="text-xl md:text-2xl text-amber-50 mb-10 max-w-2xl mx-auto leading-relaxed font-tajawal drop-shadow">
          منصة شرعية موثوقة لاستقبال الفتاوى والإجابة عليها وفق الكتاب والسنة، بإشراف ثلة من علماء ودعاة غزة.
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => document.getElementById('fatwa-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-emerald-950 font-bold py-4 px-10 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all transform hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] flex items-center text-lg"
          >
            <Send className="ml-2 h-5 w-5" /> أرسل سؤالك الآن
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
