
import React, { useState, useCallback } from 'react';
import { Search, Camera } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File, preview: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const UploadIcon = () => (
    <div className="relative">
      <div className="absolute -inset-4 bg-emerald-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
      <Camera className="h-16 w-16 text-emerald-500 relative z-10" strokeWidth={1.5} />
    </div>
);

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onAnalyze, isLoading }) => {
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
    <div className="flex flex-col gap-8">
      <label 
        className={`relative w-full aspect-square md:aspect-[16/9] flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] transition-all cursor-pointer overflow-hidden group ${
          preview 
            ? 'border-emerald-500 bg-white ring-4 ring-emerald-50' 
            : 'border-emerald-200 bg-emerald-50/30 hover:border-emerald-400 hover:bg-emerald-50'
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative w-full h-full">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <p className="text-white font-bold bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">사진 변경하기</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center p-12 text-center">
            <UploadIcon />
            <div className="mt-6 space-y-2">
              <p className="text-xl font-black text-slate-800 tracking-tight">식물 사진을 올려주세요</p>
              <p className="text-sm text-slate-500 font-medium">클릭하거나 이미지를 이곳에 끌어다 놓으세요</p>
            </div>
          </div>
        )}
        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>

      <div className="flex flex-col gap-4">
        <button
          onClick={onAnalyze}
          disabled={!preview || isLoading}
          className={`
            relative w-full py-5 rounded-2xl font-black text-lg tracking-tight transition-all duration-300
            flex items-center justify-center gap-3 overflow-hidden
            ${isLoading 
              ? 'bg-emerald-600 text-white cursor-wait opacity-80' 
              : !preview 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_20px_40px_-15px_rgba(20,184,166,0.4)] hover:from-emerald-600 hover:to-teal-700 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]'}
          `}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>식물 분석 중...</span>
            </div>
          ) : (
            <>
              <Search size={22} strokeWidth={3} />
              <span>식물 분석 시작하기</span>
            </>
          )}
          
          {preview && !isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
          )}
        </button>
      </div>
    </div>
  );
};
