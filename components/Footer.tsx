import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 border-t border-slate-100 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <span className="font-black text-slate-900">식물도사</span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-slate-400">
            <a href="#" className="hover:text-emerald-600 transition-colors">이용약관</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">문의하기</a>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">&copy; {new Date().getFullYear()} Plant Master</p>
            <p className="text-[10px] text-slate-300 mt-1">Powered by Google Gemini</p>
          </div>
        </div>
      </div>
    </footer>
  );
};