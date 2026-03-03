
import React from 'react';
import type { PlantInfo } from '../types';

interface PlantInfoCardProps {
  info: PlantInfo;
  originalImageUrl?: string | null;
}

const InfoSection: React.FC<{ title: string; children: React.ReactNode; icon: string }> = ({ title, children, icon }) => (
    <div className="bg-emerald-100/60 p-4 rounded-xl shadow-sm border border-emerald-200/40">
        <h3 className="text-lg font-bold text-emerald-900 flex items-center mb-2">
            <span className="text-xl mr-2">{icon}</span>
            {title}
        </h3>
        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{children}</p>
    </div>
);

export const PlantInfoCard: React.FC<PlantInfoCardProps> = ({ info, originalImageUrl }) => {
  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-emerald-200/50 overflow-hidden animate-fade-in">
        <div className="p-6 md:p-10">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-extrabold text-emerald-800 mb-2">{info.name}</h2>
              <p className="text-slate-400 font-medium italic text-lg">{info.englishName}</p>
            </div>
            
            {info.specificAnswer && (
              <div className="mb-10 p-6 bg-emerald-100 border-l-8 border-emerald-500 rounded-r-2xl shadow-sm flex items-start gap-4">
                 <div className="text-4xl">💡</div>
                 <div>
                    <h3 className="text-lg font-bold text-emerald-800 mb-1 uppercase tracking-wider">궁금증 해결</h3>
                    <p className="text-emerald-900 font-semibold text-xl leading-snug">{info.specificAnswer}</p>
                 </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Image Column */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    {originalImageUrl && (
                        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-emerald-100 group">
                          <img 
                              src={originalImageUrl} 
                              alt="Original" 
                              className="w-full h-auto object-cover aspect-square"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] font-bold py-1 px-2 backdrop-blur-sm text-center">
                            📸 내가 올린 사진
                          </div>
                        </div>
                    )}
                    
                    {info.imageUrls && info.imageUrls.length > 0 && (
                        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-emerald-100 group">
                          <img 
                              src={info.imageUrls[0]} 
                              alt={info.name} 
                              className="w-full h-auto object-cover aspect-square"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] font-bold py-1 px-2 backdrop-blur-sm text-center">
                            🌿 AI 추천 이미지
                          </div>
                        </div>
                    )}
                </div>

                {/* Info Column */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min">
                    <InfoSection title="씨앗/묘종 시기" icon="🌱">{info.sowingTime}</InfoSection>
                    <InfoSection title="개화 시기" icon="🌸">{info.floweringSeason}</InfoSection>
                    <div className="md:col-span-2">
                      <InfoSection title="식물 특징" icon="🌿">{info.characteristics}</InfoSection>
                    </div>
                    <InfoSection title="추천 품종" icon="🍀">{info.varieties}</InfoSection>
                    <InfoSection title="재배 주의사항" icon="⚠️">{info.precautions}</InfoSection>
                </div>
            </div>
        </div>
    </div>
  );
};

// Add fade-in animation
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
    animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
`;
document.head.appendChild(style);
