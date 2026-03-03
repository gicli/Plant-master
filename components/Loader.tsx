import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 border-[6px] border-emerald-50 rounded-[2.5rem] rotate-45"></div>
        <div className="absolute inset-0 border-[6px] border-t-emerald-500 rounded-[2.5rem] animate-spin rotate-45"></div>
        <div className="absolute inset-0 flex items-center justify-center text-5xl animate-bounce">
            🌿
        </div>
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-2">식물 정보를 분석 중입니다</h3>
      <p className="text-slate-400 font-medium">AI가 이미지를 꼼꼼하게 살펴보고 있어요.</p>
    </div>
  );
};