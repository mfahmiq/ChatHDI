
import React from 'react';

interface ModalProps {
  onClose: () => void;
  onConfirm: () => void;
  count: number;
}

const ClearHistoryModal: React.FC<ModalProps> = ({ onClose, onConfirm, count }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1e1e1e] w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-6 text-center">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Hapus Semua Riwayat?</h2>
        <p className="text-gray-400 text-sm mb-8">
          Tindakan ini tidak dapat dibatalkan. Semua percakapan ({count}) akan dihapus secara permanen.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-sm font-medium hover:bg-white/5 rounded-xl transition-colors">
            Batal
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Hapus Semua
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearHistoryModal;
