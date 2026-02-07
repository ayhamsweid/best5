import React from 'react';
import { Mail } from 'lucide-react';

const Newsletter: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#e6fcf0] border border-primary/10 rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 text-primary">
                    <Mail className="w-8 h-8" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">لا تفوت أي جديد في بشكتاش</h2>
                <p className="text-gray-600 mb-10 max-w-lg">
                    اشترك في نشرتنا الإخبارية لتصلك أحدث الأدلة والعروض الحصرية أسبوعياً.
                </p>

                <form className="w-full max-w-lg flex flex-col md:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                    <input 
                        type="email" 
                        placeholder="بريدك الإلكتروني" 
                        className="flex-grow py-4 px-6 rounded-xl border-none focus:ring-2 focus:ring-primary shadow-sm text-gray-800"
                    />
                    <button type="submit" className="bg-primary hover:bg-green-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-green-500/30 transition-all">
                        اشترك الآن
                    </button>
                </form>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;