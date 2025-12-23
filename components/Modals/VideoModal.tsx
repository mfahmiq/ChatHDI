
import React, { useState } from 'react';
import { generateAIVideo } from '../../services/geminiService';

interface ModalProps {
  onClose: () => void;
  onComplete: (type: 'video', content: string, mediaUrl: string) => void;
}

const VideoModal: React.FC<ModalProps> = ({ onClose, onComplete }) => {
  const [desc, setDesc] = useState('');
  const [duration, setDuration] = useState('4 Detik');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!desc) return;
    
    // As per Veo guidelines, verify key selection
    if (typeof window !== 'undefined' && (window as any).aistudio) {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
        // Proceed after triggering (race condition handling as per guidelines)
      }
    }

    setIsLoading(true);
    try {
      const url = await generateAIVideo(desc, duration);
      if (url) {
        onComplete('video', `Selesai membuat video: ${desc}`, url);
        onClose();
      }
    } catch (error: any) {
      console.error(error);
      const msg = error?.message || "";
      if (msg.includes("Requested entity was not found")) {
        alert("Model Veo tidak ditemukan atau akses ditolak. Membuka pemilihan API Key...");
      } else {
        alert("Terjadi kesalahan saat membuat video. Pastikan API Key Anda mendukung Veo (Billing Aktif).");
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
            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center">
               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">Buat Video AI</h2>
              <p className="text-xs text-gray-500">Powered by Veo 3.1</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl text-xs text-blue-300">
            Catatan: Video generation membutuhkan API Key dengan billing aktif. 
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline ml-1">Info Billing</a>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Deskripsi Video</label>
            <textarea 
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Contoh: Animasi proses elektrolisis air menjadi hidrogen dan oksigen dengan efek visual modern"
              className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 h-24 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Durasi Video</label>
            <select 
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            >
              <option value="4 Detik">4 Detik</option>
              <option value="10 Detik">10 Detik</option>
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
            className={`flex-1 py-3 rounded-xl bg-cyan-600 text-white text-sm font-medium transition-all flex items-center justify-center gap-2 ${isLoading || !desc ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cyan-700 shadow-lg shadow-cyan-900/20'}`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Buat Video</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
