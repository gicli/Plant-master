
import React, { useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File, preview: string) => void;
  onAnalyze: () => void;
  onReset?: () => void;
  isLoading: boolean;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onAnalyze, onReset, isLoading }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const processFile = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setPreview(previewUrl);
        onFileSelect(file, previewUrl);
      };
      reader.readAsDataURL(file);
    }
  }, [onFileSelect]);

  const handleReset = () => {
    setPreview(null);
    if (onReset) onReset();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
  };
  
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    processFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="flex flex-col gap-6">
      <label 
        className={`relative w-full aspect-square md:aspect-video flex flex-col items-center justify-center border-4 border-dashed rounded-3xl transition-all cursor-pointer overflow-hidden ${
          preview ? 'border-emerald-500 bg-white' : 'border-emerald-100 bg-emerald-50 hover:border-emerald-300 hover:bg-emerald-100'
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center p-8 text-center">
            <div className="mb-4">
                <UploadIcon />
            </div>
            <p className="text-lg font-bold text-emerald-800">식물 사진을 업로드하세요</p>
            <p className="text-sm text-emerald-600/70 mt-2">클릭하거나 이미지를 끌어다 놓으세요</p>
          </div>
        )}
        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>

      <div className="flex flex-col gap-3">
        <button
          onClick={onAnalyze}
          disabled={!preview || isLoading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            '식물 분석 시작'
          )}
        </button>

        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold py-2 transition-all"
        >
          <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          사진 초기화 (새로고침)
        </button>
      </div>
    </div>
  );
};
