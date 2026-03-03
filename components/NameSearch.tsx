
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface NameSearchProps {
  onSearch: (name: string) => void;
  onReset?: () => void;
  isLoading: boolean;
}

export const NameSearch: React.FC<NameSearchProps> = ({ onSearch, onReset, isLoading }) => {
  const [plantName, setPlantName] = useState('');

  const handleSearch = () => {
    if (plantName.trim() && !isLoading) {
      onSearch(plantName.trim());
    }
  };

  const handleReset = () => {
    setPlantName('');
    if (onReset) onReset();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <input
          type="text"
          value={plantName}
          onChange={(e) => setPlantName(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="식물 이름 또는 궁금한 점을 입력하세요..."
          className="w-full px-6 py-5 bg-emerald-50 border-2 border-emerald-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-lg text-emerald-900 placeholder:text-emerald-300"
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl">
          🔍
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <button
          onClick={handleSearch}
          disabled={!plantName.trim() || isLoading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            '🌿 정보 검색하기'
          )}
        </button>
        
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold py-2 transition-all"
        >
          <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          검색 내용 초기화 (새로고침)
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {['메리골드 파종시기', '몬스테라 관리법', '튤립 꽃말'].map(tag => (
          <button 
            key={tag}
            onClick={() => setPlantName(tag)}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors border border-emerald-200"
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
};
