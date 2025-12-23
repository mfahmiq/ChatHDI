
import React, { useState, useEffect, useRef } from 'react';
import { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onCreateChat: () => void;
  onOpenModal: (type: any) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, activeSessionId, onSelectSession, onCreateChat, onOpenModal, isOpen, toggleSidebar, theme, onToggleTheme 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Logic: Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = (type: any) => {
    onOpenModal(type);
    setIsDropdownOpen(false); // Auto-close after selection
  };

  const handleRefresh = () => {
    setIsDropdownOpen(false);
    window.location.reload();
  };

  return (
    <div className={`${isOpen ? 'w-64' : 'w-0'} bg-gray-50 dark:bg-[#171717] flex flex-col transition-all duration-300 border-r border-gray-200 dark:border-white/5 overflow-hidden z-20`}>
      {/* Top Header & Dropdown */}
      <div className="p-3 relative flex items-center justify-between gap-1" ref={dropdownRef}>
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex-1 flex items-center justify-between p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/5 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#00A3FF] rounded-full flex items-center justify-center font-bold text-white text-[10px] shadow-sm">H</div>
            <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">ChatHDI</span>
          </div>
          <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
        </button>
        
        <button 
          onClick={toggleSidebar}
          className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5 rounded-lg transition-colors"
          title="Tutup Sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-3 right-3 mt-1 bg-white dark:bg-[#2f2f2f] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top">
            <button onClick={() => handleAction('pptx')} className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-left text-gray-700 dark:text-gray-200">
              <span className="text-orange-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></span>
              Buat Presentasi (PPTX)
            </button>
            <button onClick={() => handleAction('image')} className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-left text-gray-700 dark:text-gray-200">
              <span className="text-purple-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></span>
              Buat Gambar (AI Image)
            </button>
            <button onClick={() => handleAction('video')} className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-left text-gray-700 dark:text-gray-200">
              <span className="text-cyan-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></span>
              Buat Video (AI Video)
            </button>
            <div className="mx-4 my-1 border-t border-gray-100 dark:border-white/5"></div>
            <button onClick={() => handleAction('database')} className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-left text-gray-700 dark:text-gray-200">
              <span className="text-gray-500 dark:text-gray-300"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg></span>
              Database Hidrogen
            </button>
            <button onClick={() => handleAction('clearHistory')} className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-left text-red-500 dark:text-red-400">
              <span className="text-red-500 dark:text-red-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></span>
              Hapus Semua Riwayat
            </button>
            <div className="mx-4 my-1 border-t border-gray-100 dark:border-white/5"></div>
            <button onClick={handleRefresh} className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-left text-green-600 dark:text-green-500">
              <span className="text-green-600 dark:text-green-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></span>
              Cek Update & Refresh
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-3 py-2">
        <button 
          onClick={onCreateChat}
          className="flex items-center gap-2 w-full p-2.5 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-[14px] font-medium text-gray-700 dark:text-gray-200 shadow-sm"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
          Chat Baru
        </button>
      </div>

      <div className="px-3 py-1">
        <div className="relative group">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="Cari percakapan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#2f2f2f] border border-gray-200 dark:border-none rounded-lg py-2.5 pl-9 pr-3 text-xs text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-blue-500/30 focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-0.5 mt-4 scrollbar-hide">
        {filteredSessions.length > 0 ? (
          filteredSessions.map(session => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`w-full text-left p-2.5 rounded-lg text-[13px] truncate transition-all ${activeSessionId === session.id ? 'bg-gray-200 dark:bg-[#2f2f2f] text-gray-900 dark:text-white font-medium shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-[#2f2f2f]/50 text-gray-600 dark:text-gray-400'}`}
            >
              {session.title || 'Untitled Chat'}
            </button>
          ))
        ) : (
          <div className="p-4 text-center">
             <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Tidak ada riwayat</p>
          </div>
        )}
      </div>

      {/* Footer & Theme Toggle */}
      <div className="p-3 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#171717] space-y-1 transition-colors">
        <button 
          onClick={onToggleTheme}
          className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-white/5 transition-all text-left text-gray-700 dark:text-gray-200 text-sm group"
        >
          <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-white/5 flex items-center justify-center group-hover:bg-gray-300 dark:group-hover:bg-white/10 transition-colors">
            {theme === 'dark' ? (
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
            ) : (
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            )}
          </div>
          <span className="font-medium">Mode {theme === 'dark' ? 'Terang' : 'Gelap'}</span>
        </button>

        <button className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-white/5 transition-all text-left group">
          <div className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-base shadow-lg ring-1 ring-white/10">K</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">Karyawan HDI</p>
            <p className="text-[11px] text-gray-500 truncate group-hover:text-gray-400 transition-colors">Tim Proyek Hidrogen</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
