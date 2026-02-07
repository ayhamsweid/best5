import React from 'react';
import { Compass, Instagram, Twitter, Facebook, MapPin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-gray-400 pt-20 pb-10 px-4 border-t border-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary p-1.5 rounded-lg">
              <Compass className="text-white w-5 h-5" />
            </div>
            <div className="text-white">
              <h2 className="text-lg font-black leading-none">دليل بشكتاش</h2>
            </div>
          </div>
          <p className="text-sm leading-relaxed mb-6">
            المنصة الموثوقة الأولى لاستكشاف معالم ومطاعم منطقة بشكتاش في اسطنبول. نقدم لكم المعلومة بكل شفافية وموضوعية.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><Facebook className="w-4 h-4" /></a>
          </div>
        </div>

        {/* Links 1 */}
        <div>
          <h3 className="text-white font-bold mb-6 text-primary">استكشف اسطنبول</h3>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">أفضل مطاعم كاديكوي</a></li>
            <li><a href="#" className="hover:text-white transition-colors">أماكن الإفطار في نيشانتاشي</a></li>
            <li><a href="#" className="hover:text-white transition-colors">دليل المقاهي في اسكودار</a></li>
            <li><a href="#" className="hover:text-white transition-colors">مطاعم السمك في بيبك</a></li>
          </ul>
        </div>

        {/* Links 2 */}
        <div>
          <h3 className="text-white font-bold mb-6 text-primary">روابط سريعة</h3>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">من نحن</a></li>
            <li><a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a></li>
            <li><a href="#" className="hover:text-white transition-colors">تواصل معنا</a></li>
            <li><a href="#" className="hover:text-white transition-colors">أعلن معنا</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-bold mb-6 text-primary">التواصل</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
              <span>سنان باشا، بشكتاش، اسطنبول، تركيا</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <span>hello@besiktasguide.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
        <p>© 2024 دليل بشكتاش. جميع الحقوق محفوظة.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <span>تصميم وتطوير بواسطة فريق بشكتاش</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;