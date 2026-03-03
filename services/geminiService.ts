import { GoogleGenAI, Type } from '@google/genai';
import type { PlantInfo, AnalysisResult, PlantSuggestion } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const plantInfoSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "식물의 한국어 이름 (Korean name of the plant)" },
    englishName: { type: Type.STRING, description: "식물의 일반적인 영어 이름 (Common English name of the plant)" },
    sowingTime: { type: Type.STRING, description: "씨뿌리기 혹은 묘종시기 (Sowing or seedling time)" },
    floweringSeason: { type: Type.STRING, description: "개화시기 (Flowering season)" },
    characteristics: { type: Type.STRING, description: "식물의 보편적인 정보 및 특징 (General info and characteristics)" },
    varieties: { type: Type.STRING, description: "해당 식물의 인기있는 품종 5가지 추천 (Recommend 5 popular varieties of the plant)" },
    precautions: { type: Type.STRING, description: "재배 시 주의사항 (Precautions for cultivation)" },
    specificAnswer: { type: Type.STRING, description: "사용자의 구체적인 질문에 대한 요약 답변 (Summary answer to the user's specific question, e.g., sowing time, meaning. Leave empty for general searches)" }
  }
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    isPlant: { type: Type.BOOLEAN, description: "이미지가 식물인지 여부 (Whether the image is a plant)" },
    plantInfo: plantInfoSchema,
    suggestions: {
      type: Type.ARRAY,
      description: "식물이 아니거나 명확하지 않을 경우 추천하는 2개의 식물 (2 suggested plants if not a plant or unclear)",
      items: {
        type: Type.OBJECT,
        properties: { name: { type: Type.STRING } }
      }
    }
  }
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const analyzeImage = async (file: File): Promise<AnalysisResult> => {
    const imagePart = await fileToGenerativePart(file);
    const prompt = `
    당신은 세계 최고의 식물학자 '식물도사'입니다.
    이 이미지를 분석하고, 다음의 JSON 스키마에 따라 답변해주세요.
    1.  이미지가 식물 사진이 맞는지 'isPlant' 필드에 true 또는 false로 표시해주세요.
    2.  'isPlant'가 true이면, 'plantInfo' 객체에 식물에 대한 자세한 정보를 한국어로 채워주세요. 'specificAnswer' 필드는 비워두세요.
    3.  'isPlant'가 false이거나, 식물이지만 어떤 식물인지 명확하게 식별할 수 없다면, 'isPlant'를 false로 설정하고, 사용자가 흥미로워할 만한 유사하거나 인기 있는 식물 2종류를 'suggestions' 배열에 추천해주세요. 추천 식물의 이름만 제공하면 됩니다.
    4.  항상 JSON 형식으로만 응답해야 합니다.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            }
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as AnalysisResult;
    } catch (error) {
        console.error("Error analyzing image:", error);
        throw new Error("Gemini API와의 통신에 실패했습니다. 이미지 분석에 문제가 발생했습니다.");
    }
};

// FIX: Made englishName optional to support generating images for suggestions that only provide a name.
export const generateImage = async (plantName: string, englishName?: string): Promise<string[]> => {
    const englishNamePart = englishName ? ` (${englishName})` : '';
    const prompt = `'${plantName}'${englishNamePart} plant, realistic high-quality photo, isolated on white background, studio lighting.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
                imageConfig: {
                    aspectRatio: "1:1"
                }
            }
        });

        const imageUrls: string[] = [];
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    imageUrls.push(`data:image/png;base64,${part.inlineData.data}`);
                }
            }
        }
        
        if (imageUrls.length === 0) {
            throw new Error("No image data in response");
        }

        return imageUrls;
    } catch (error) {
        console.error("Error generating image:", error);
        // Fallback to a relevant placeholder
        return [`https://picsum.photos/seed/${encodeURIComponent(plantName)}/500/500`];
    }
};

export const getPlantInfoByName = async (plantName: string): Promise<Omit<PlantInfo, 'imageUrls'>> => {
  const prompt = `
    당신은 '식물도사'라는 세계적인 식물학자입니다. 
    사용자의 검색어: '${plantName}'
    
    이 검색어에서 사용자가 정보를 원하는 식물의 이름을 파악하고, 그 식물에 대한 자세한 정보를 제공해주세요.
    
    지침:
    1. 사용자의 검색어에서 식물 이름을 추출하여 정보를 작성하세요.
    2. 사용자가 "메리골드 파종시기"처럼 구체적인 정보를 질문한 경우, 'specificAnswer' 필드에 그 질문에 대한 답변을 한 문장으로 요약해서 적어주세요. (예: "메리골드의 파종 시기는 주로 3월에서 5월 사이입니다.")
    3. 단순히 식물 이름만 입력했다면 'specificAnswer' 필드는 비워두세요.
    4. "장미 꽃말"이라고 입력하면 장미 정보를 제공하고, 'specificAnswer'에 꽃말을 적어주세요.
    
    결과는 항상 JSON 형식이어야 합니다. 
    만약 해당 식물에 대한 정보를 찾을 수 없거나 식물과 관련없는 검색어라면, 이름이 비어있는 JSON 객체를 반환해주세요. 
    모든 답변은 한국어로 해주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: plantInfoSchema,
      }
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString) as Omit<PlantInfo, 'imageUrls'>;

    if (!result.name) {
      throw new Error(`'${plantName}'에 대한 정보를 찾을 수 없습니다.`);
    }

    return result;

  } catch (error) {
    console.error("Error getting plant info by name:", error);
    if (error instanceof Error && error.message.includes('정보를 찾을 수 없습니다')) {
        throw error;
    }
    throw new Error("Gemini API와의 통신에 실패했습니다. 식물 정보 검색에 문제가 발생했습니다.");
  }
};
