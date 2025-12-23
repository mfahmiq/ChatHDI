
import React, { useState } from 'react';
import { generateAIImage } from '../../services/geminiService';

interface ModalProps {
  onClose: () => void;
  onComplete: (type: 'image', content: string, mediaUrl: string) => void;
}

const ImageModal: React.FC<ModalProps> = ({ onClose, onComplete }) => {
  const [desc, setDesc] = useState('');
  const [quality, setQuality] = useState('Low');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!desc) return;
    
    // Check key if quality is High (Gemini 3 Pro)
    if (quality === 'High' && typeof window !== 'undefined' && (window as any).aistudio) {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
      }
    }

    setIsLoading(true);
    try {
      const url = await generateAIImage(desc, quality);
      if (url) {
        onComplete('image', `Selesai membuat gambar: ${desc}`, url);
        onClose();
      }
    } catch (error: any) {
      console.error(error);
      const msg = error?.message || "";
      if (msg.includes("Requested entity was not found")) {
        alert("Model gambar tidak ditemukan. Pastikan API Key Anda memiliki akses ke model preview.");
      } else {
        alert("Gagal membuat gambar. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1e1e1e] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">Buat Gambar AI</h2>
              <p className="text-xs text-gray-500">Powered by Gemini Image</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Deskripsi Gambar</label>
            <textarea 
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Contoh: Mobil fuel cell hidrogen futuristik di kota bersih dengan langit biru"
              className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 h-24 focus:outline-none focus:ring-1 focus:ring-purple-500/50 resize-none text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Kualitas</label>
            <select 
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            >
              <option value="Low">Cepat (Low - 2.5 Flash)</option>
              <option value="High">Detail (High - 3 Pro)</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-sm font-medium hover:bg-white/5 rounded-xl transition-colors">
            Tutup
          </button>
          <button 
            onClick={handleGenerate}
            disabled={isLoading || !desc}
            className={`flex-1 py-3 rounded-xl bg-purple-600 text-white text-sm font-medium transition-all flex items-center justify-center gap-2 ${isLoading || !desc ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700 shadow-lg shadow-purple-900/20'}`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg> Buat Gambar</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
