
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100 w-full shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <span className="text-xl" role="img" aria-label="plant">🌿</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
              식물도사
            </h1>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mt-1">Plant Master</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">가이드</a>
          <a href="#" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">커뮤니티</a>
          <button className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold hover:bg-emerald-100 transition-colors">
            로그인
          </button>
        </nav>
      </div>
    </header>
  );
};
