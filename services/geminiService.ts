
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

/**
 * Helper to handle "Requested entity was not found" errors (404).
 */
const handleApiError = async (error: any) => {
  const errorMessage = error?.message || String(error);
  if (errorMessage.includes("Requested entity was not found")) {
    if (typeof window !== 'undefined' && (window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
    }
  }
  throw error;
};

export const chatWithGemini = async (messages: { role: string; content: string }[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const history = messages.slice(0, -1).map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const lastMessage = messages[messages.length - 1].content;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history.concat([{ role: 'user', parts: [{ text: lastMessage }] }]),
      config: {
        systemInstruction: `You are ChatHDI, a state-of-the-art AI search engine. 
        Your mission is to provide information that is accurate, comprehensive, and perfectly formatted.

        Markdown & Formatting Rules:
        - Organize complex information into Markdown tables whenever possible (e.g., comparisons, lists of data, specs).
        - Use clean headings (## and ###) for logical structure.
        - DO NOT display raw markdown symbols like '###' or '**' in the final intent; ensure the text flows naturally within the markdown structure.
        - Avoid excessive bolding. Use bold text sparingly for critical keywords only.
        - Use bullet points for readability.
        - For every factual claim, try to provide a citation or reference if search results allow.
        - If search grounding is used, ensure the output text contains natural links [Source Title](URL) if relevant.
        
        Hydrogen Focus:
        - If the query is about Hydrogen technology, provide high-level technical details and use industry-standard terminology.`,
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text;
    const metadata = response.candidates?.[0]?.groundingMetadata;
    const groundingChunks = metadata?.groundingChunks || [];
    const searchEntryPoint = metadata?.searchEntryPoint?.renderedContent;
    
    // Extracting web links from grounding chunks
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web || chunk.maps)
      .map((chunk: any) => {
        if (chunk.web) {
          return {
            title: chunk.web.title || "Website Source",
            uri: chunk.web.uri
          };
        } else if (chunk.maps) {
          return {
            title: chunk.maps.title || "Google Maps Place",
            uri: chunk.maps.uri
          };
        }
        return null;
      })
      .filter((s: any) => s !== null);

    return { text, sources, searchEntryPoint };
  } catch (error) {
    return handleApiError(error);
  }
};

export const generateAIImage = async (prompt: string, quality: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: quality === 'High' ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    return handleApiError(error);
  }
};

export const generateAIVideo = async (prompt: string, duration: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    let op = operation;
    while (!op.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      op = await ai.operations.getVideosOperation({ operation: op });
    }

    const downloadLink = op.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
      const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    }
    return null;
  } catch (error) {
    return handleApiError(error);
  }
};

export const generatePPTXContent = async (topic: string, slidesCount: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a detailed presentation outline for the topic: "${topic}". 
                 Include exactly ${slidesCount} slides. 
                 For each slide, provide a Title and 3-4 bullet points.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "content"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    return handleApiError(error);
  }
};
