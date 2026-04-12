
import React, { useState, useCallback, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { NameSearch } from './components/NameSearch';
import { PlantInfoCard } from './components/PlantInfoCard';
import { Loader } from './components/Loader';
import { SuggestionModal } from './components/SuggestionModal';
import { getPlantInfoByName, analyzeImage, generateImage } from './services/geminiService';
import type { PlantInfo, PlantSuggestion } from './types';
import { Footer } from './components/Footer';

type Tab = 'image' | 'name';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('image');
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<PlantSuggestion[] | null>(null);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<number>(0);

  const resetState = () => {
    setPlantInfo(null);
    setError(null);
    setSelectedFile(null);
    setOriginalImagePreview(null);
    setSuggestions(null);
    setShowSuggestionsModal(false);
    setSearchKey(prev => prev + 1);
  };

  const handleFileSelect = (file: File, preview: string) => {
    setSelectedFile(file);
    setOriginalImagePreview(preview);
    setPlantInfo(null);
    setError(null);
  };

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) {
      setError('이미지를 먼저 선택해주세요.');
      return;
    }

    setIsLoading(true);
    setPlantInfo(null);
    setError(null);
    setSuggestions(null);
    setShowSuggestionsModal(false);

    try {
      const result = await analyzeImage(selectedFile);

      if (!result.isPlant) {
        const suggestionsData = result.suggestions || [];
        const suggestionsWithImages = await Promise.all(
          suggestionsData.map(async (suggestion) => {
            const imageUrls = await generateImage(suggestion.name);
            return { name: suggestion.name, imageUrls };
          })
        );
        setSuggestions(suggestionsWithImages);
        setShowSuggestionsModal(true);
      } else if (result.plantInfo) {
        const imageUrls = await generateImage(result.plantInfo.name, result.plantInfo.englishName);
        setPlantInfo({ ...result.plantInfo, imageUrls });
      } else {
         throw new Error('식물 정보를 분석할 수 없습니다.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '이미지 분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile]);

  const handleNameSearch = useCallback(async (plantName: string) => {
    if (!plantName) {
      setError('식물 이름을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    resetState();

    try {
      const info = await getPlantInfoByName(plantName);
      const imageUrls = await generateImage(info.name, info.englishName);
      setPlantInfo({ ...info, imageUrls });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '정보 검색 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-emerald-50 text-slate-800">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Tab Selection */}
          <div className="flex bg-white rounded-xl shadow-sm p-1 border border-emerald-100">
            <button
              onClick={() => { setActiveTab('image'); resetState(); }}
              className={`flex-1 py-3 rounded-lg font-bold transition-all ${activeTab === 'image' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-800 hover:bg-emerald-50'}`}
            >
              사진으로 찾기
            </button>
            <button
              onClick={() => { setActiveTab('name'); resetState(); }}
              className={`flex-1 py-3 rounded-lg font-bold transition-all ${activeTab === 'name' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-800 hover:bg-emerald-50'}`}
            >
              이름으로 찾기
            </button>
          </div>

          {/* Input Sections */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-emerald-100 relative">
            <div className="flex justify-end mb-4">
              <button
                onClick={resetState}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full transition-all border border-emerald-100"
              >
                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                전체 초기화
              </button>
            </div>

            {activeTab === 'image' ? (
              <FileUpload key={searchKey} onFileSelect={handleFileSelect} onAnalyze={handleAnalyze} isLoading={isLoading} />
            ) : (
              <NameSearch key={searchKey} onSearch={handleNameSearch} isLoading={isLoading} />
            )}
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            {isLoading ? (
              <Loader />
            ) : plantInfo ? (
              <PlantInfoCard info={plantInfo} originalImageUrl={originalImagePreview} />
            ) : !error && (
              <div className="text-center py-12 opacity-50">
                <div className="text-6xl mb-4">🌿</div>
                <p className="text-lg text-emerald-900 font-medium">검색을 시작하여 식물 정보를 확인하세요.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {showSuggestionsModal && suggestions && (
        <SuggestionModal 
          suggestions={suggestions}
          onClose={() => setShowSuggestionsModal(false)}
        />
      )}
      <Footer />
    </div>
  );
};

export default App;
