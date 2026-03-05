
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface NameSearchProps {
  onSearch: (name: string) => void;
  isLoading: boolean;
}

export const NameSearch: React.FC<NameSearchProps> = ({ onSearch, isLoading }) => {
  const [plantName, setPlantName] = useState('');

  const handleSearch = () => {
    if (plantName.trim() && !isLoading) {
      onSearch(plantName.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="relative group">
        <input
          type="text"
          value={plantName}
          onChange={(e) => setPlantName(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="식물 이름 또는 궁금한 점을 입력하세요..."
          className="w-full px-8 py-6 bg-emerald-50/50 border-2 border-emerald-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-xl text-emerald-900 placeholder:text-emerald-200"
        />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl opacity-30 group-focus-within:opacity-100 transition-opacity">
          🌿
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        <button
          onClick={handleSearch}
          disabled={!plantName.trim() || isLoading}
          className={`
            relative w-full py-5 rounded-2xl font-black text-lg tracking-tight transition-all duration-300
            flex items-center justify-center gap-3 overflow-hidden
            ${isLoading 
              ? 'bg-emerald-600 text-white cursor-wait opacity-80' 
              : !plantName.trim() || isLoading 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_20px_40px_-15px_rgba(20,184,166,0.4)] hover:from-emerald-600 hover:to-teal-700 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]'}
          `}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>정보 검색 중...</span>
            </div>
          ) : (
            <>
              <Search size={22} strokeWidth={3} />
              <span>식물 정보 검색하기</span>
            </>
          )}
          
          {plantName.trim() && !isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
          )}
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {['메리골드 파종시기', '몬스테라 관리법', '튤립 꽃말'].map(tag => (
          <button 
            key={tag}
            onClick={() => setPlantName(tag)}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full hover:bg-emerald-100 transition-all border border-emerald-100 hover:border-emerald-300 hover:shadow-sm"
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
};
