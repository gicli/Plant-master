import React from 'react';
import type { PlantSuggestion } from '../types';

interface SuggestionModalProps {
  suggestions: PlantSuggestion[];
  onClose: () => void;
}

const SuggestionCard: React.FC<{ suggestion: PlantSuggestion }> = ({ suggestion }) => (
    <div className="bg-slate-50/50 rounded-3xl border border-slate-100 p-4 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
        <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 shadow-sm">
          <img 
              src={suggestion.imageUrls[0]} 
              alt={suggestion.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
          />
        </div>
        <h3 className="font-black text-slate-900 text-sm">{suggestion.name}</h3>
    </div>
);

export const SuggestionModal: React.FC<SuggestionModalProps> = ({ suggestions, onClose }) => {
  return (
    <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-[3rem] shadow-[0_48px_96px_-12px_rgba(0,0,0,0.2)] w-full max-w-xl p-8 md:p-12 transform animate-in zoom-in-95 slide-in-from-bottom-8 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">Analysis Result</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">식물을 찾을 수 없습니다</h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-slate-500 font-medium leading-relaxed mb-10">
            사진 속 식물을 정확하게 식별하기 어렵습니다. <br />
            대신 이런 식물들은 어떠신가요?
        </p>
        <div className="grid grid-cols-2 gap-6">
            {suggestions.map((suggestion, index) => (
                <SuggestionCard key={index} suggestion={suggestion} />
            ))}
        </div>
        <button 
          onClick={onClose}
          className="w-full mt-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  );
};
