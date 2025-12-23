
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { ChatSession, Message, ModalState } from './types';
import { v4 as uuidv4 } from 'uuid';
import PPTXModal from './components/Modals/PPTXModal';
import ImageModal from './components/Modals/ImageModal';
import VideoModal from './components/Modals/VideoModal';
import ClearHistoryModal from './components/Modals/ClearHistoryModal';
import { chatWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>({ type: 'none' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('chathdi_theme') as 'light' | 'dark') || 'dark';
  });

  // Sinkronisasi class dark pada element html
  useEffect(() => {
    localStorage.setItem('chathdi_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load History
  useEffect(() => {
    const saved = localStorage.getItem('chathdi_sessions');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSessions(parsed);
      if (parsed.length > 0 && !activeSessionId) setActiveSessionId(parsed[0].id);
    }
  }, []);

  // Save History
  useEffect(() => {
    localStorage.setItem('chathdi_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const createNewChat = () => {
    const newId = uuidv4();
    const newSession: ChatSession = {
      id: newId,
      title: 'Chat Baru',
      messages: [],
      updatedAt: Date.now(),
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
  };

  const handleSendMessage = async (text: string) => {
    let currentId = activeSessionId;
    let currentSessions = [...sessions];

    if (!currentId) {
      currentId = uuidv4();
      const newSession: ChatSession = { id: currentId, title: text.substring(0, 30), messages: [], updatedAt: Date.now() };
      currentSessions = [newSession, ...currentSessions];
      setSessions(currentSessions);
      setActiveSessionId(currentId);
    }

    const userMsg: Message = { id: uuidv4(), role: 'user', content: text, timestamp: Date.now() };
    setSessions(prev => prev.map(s => s.id === currentId ? { ...s, messages: [...s.messages, userMsg], title: s.messages.length === 0 ? text.substring(0, 30) : s.title, updatedAt: Date.now() } : s));
    setIsTyping(true);

    try {
      const result = await chatWithGemini(currentSessions.find(s => s.id === currentId)?.messages.concat(userMsg).map(m => ({ role: m.role, content: m.content })) || []);
      const assistantMsg: Message = { id: uuidv4(), role: 'assistant', content: result.text || 'Maaf, terjadi kesalahan.', timestamp: Date.now(), groundingSources: result.sources || [], searchEntryPoint: result.searchEntryPoint };
      setSessions(prev => prev.map(s => s.id === currentId ? { ...s, messages: [...s.messages, assistantMsg], updatedAt: Date.now() } : s));
    } catch (error) {
      console.error(error);
    } finally { setIsTyping(false); }
  };

  const clearAllHistory = () => { setSessions([]); setActiveSessionId(null); setModalState({ type: 'none' }); };
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const addMediaMessage = (type: 'image' | 'video' | 'pptx', content: string, mediaUrl?: string) => {
    if (!activeSessionId) createNewChat();
    const mediaMsg: Message = { id: uuidv4(), role: 'assistant', content, type, mediaUrl, timestamp: Date.now() };
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, mediaMsg], updatedAt: Date.now() } : s));
  };

  return (
    <div className="flex h-screen bg-white dark:bg-[#0d0d0d] transition-colors duration-300">
      <Sidebar 
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onCreateChat={createNewChat}
        onOpenModal={(type) => setModalState({ type })}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      
      <main className="flex-1 flex flex-col relative bg-white dark:bg-[#212121] transition-colors duration-300">
        {!isSidebarOpen && (
          <div className="absolute top-4 left-4 z-30">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 rounded-xl bg-white dark:bg-[#2f2f2f] hover:bg-gray-100 dark:hover:bg-[#3f3f3f] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 shadow-lg active:scale-95 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        )}
        <ChatWindow session={activeSession} onSendMessage={handleSendMessage} isTyping={isTyping} />
      </main>

      {/* Modals */}
      {modalState.type === 'pptx' && <PPTXModal onClose={() => setModalState({ type: 'none' })} onComplete={addMediaMessage} />}
      {modalState.type === 'image' && <ImageModal onClose={() => setModalState({ type: 'none' })} onComplete={addMediaMessage} />}
      {modalState.type === 'video' && <VideoModal onClose={() => setModalState({ type: 'none' })} onComplete={addMediaMessage} />}
      {modalState.type === 'clearHistory' && <ClearHistoryModal onClose={() => setModalState({ type: 'none' })} onConfirm={clearAllHistory} count={sessions.length} />}
    </div>
  );
};

export default App;
