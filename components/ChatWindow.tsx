
import React, { useState, useRef, useEffect } from 'react';
import { ChatSession, Message, GroundingSource } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatWindowProps {
  session: ChatSession | undefined;
  onSendMessage: (text: string) => void;
  isTyping: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ session, onSendMessage, isTyping }) => {
  const [input, setInput] = useState('');
  const [visibleSources, setVisibleSources] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session?.messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      onSendMessage(input);
      setInput('');
    }
  };

  const toggleSources = (messageId: string) => {
    setVisibleSources(prev => {
      const next = new Set(prev);
      if (next.has(messageId)) next.delete(messageId);
      else next.add(messageId);
      return next;
    });
  };

  if (!session || session.messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-white dark:bg-[#212121] transition-colors duration-300 relative">
        <div className="w-16 h-16 bg-[#00A3FF] rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20 transform rotate-12 transition-transform hover:rotate-0 duration-500 cursor-default">
          <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-900 dark:text-white">ChatHDI</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-xl mb-12 leading-relaxed text-sm px-6">
          Asisten AI cerdas untuk riset dan pengembangan proyek hidrogen Anda.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl w-full px-4 mb-8">
          <button onClick={() => onSendMessage("Apa itu hidrogen hijau?")} className="p-4 rounded-2xl bg-gray-50 dark:bg-[#2f2f2f] border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] transition-all text-left shadow-sm">
            <span className="text-gray-700 dark:text-gray-200 text-[13px] font-medium">Apa itu hidrogen hijau?</span>
          </button>
          <button onClick={() => onSendMessage("Cara kerja fuel cell hidrogen")} className="p-4 rounded-2xl bg-gray-50 dark:bg-[#2f2f2f] border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] transition-all text-left shadow-sm">
            <span className="text-gray-700 dark:text-gray-200 text-[13px] font-medium">Cara kerja fuel cell hidrogen</span>
          </button>
        </div>

        <div className="mt-auto w-full max-w-4xl pb-10 px-4">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan tentang proyek hidrogen..." 
              className="w-full bg-white dark:bg-[#2f2f2f] border border-gray-300 dark:border-white/10 rounded-full py-3.5 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-[15px] transition-all"
            />
            <button 
              type="submit"
              disabled={isTyping || !input.trim()} 
              className={`absolute right-1.5 p-2 rounded-full transition-all ${input.trim() && !isTyping ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md hover:scale-105' : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#212121] transition-colors duration-300">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-0 py-8 scroll-smooth scrollbar-hide">
        <div className="max-w-4xl mx-auto space-y-12 pb-12 px-4">
          {session.messages.map((msg) => (
            <div key={msg.id} className={`flex gap-5 animate-in fade-in slide-in-from-bottom-2 duration-500 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-5 max-w-[92%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs shadow-md ring-1 ring-black/5 dark:ring-white/5 ${msg.role === 'assistant' ? 'bg-[#00A3FF] text-white' : 'bg-orange-600 text-white'}`}>
                  {msg.role === 'assistant' ? 'H' : 'K'}
                </div>
                <div className="space-y-6 w-full overflow-hidden">
                  <div className={`markdown-content ${msg.role === 'user' ? 'bg-gray-100 dark:bg-[#2f2f2f] p-4 px-6 rounded-3xl text-gray-800 dark:text-gray-200 shadow-sm' : 'text-gray-900 dark:text-gray-100'}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                  
                  {/* Tombol Lihat Sumber & Detail Referensi */}
                  {msg.groundingSources && msg.groundingSources.length > 0 && (
                    <div className="space-y-3">
                      <button 
                        onClick={() => toggleSources(msg.id)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-gray-600 dark:text-gray-400 text-[11px] font-bold uppercase tracking-wider group"
                      >
                        <svg className={`w-3.5 h-3.5 text-blue-500 transition-transform duration-300 ${visibleSources.has(msg.id) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                        {visibleSources.has(msg.id) ? 'Sembunyikan Sumber' : 'Lihat Sumber'}
                      </button>

                      {visibleSources.has(msg.id) && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-2 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 shadow-inner">
                          <div className="flex items-center gap-2 mb-2">
                             <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Daftar Referensi Lengkap</p>
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {msg.groundingSources.map((source, idx) => (
                              <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 hover:border-blue-500/50 group transition-all">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="text-[13px] font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-500 truncate block transition-colors">{source.title}</span>
                                  <span className="text-[11px] text-gray-500 truncate block mt-0.5">{source.uri}</span>
                                </div>
                                <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-500 self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {msg.type === 'image' && msg.mediaUrl && (
                    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-lg mt-4">
                      <img src={msg.mediaUrl} alt="AI Generated" className="w-full h-auto object-cover" />
                    </div>
                  )}

                  {msg.type === 'video' && msg.mediaUrl && (
                    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-lg mt-4 bg-black aspect-video">
                      <video src={msg.mediaUrl} controls className="w-full h-full" />
                    </div>
                  )}

                  {msg.type === 'pptx' && (
                    <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 flex items-center gap-4 mt-4 shadow-sm group hover:border-orange-500/30 transition-all cursor-pointer">
                      <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-gray-800 dark:text-white">Presentasi Diunduh</p>
                        <p className="text-xs text-gray-500">File PPTX profesional telah siap.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-5 justify-start animate-pulse">
              <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs bg-[#00A3FF] text-white">H</div>
              <div className="bg-gray-50 dark:bg-white/5 px-6 py-3 rounded-2xl border border-gray-200 dark:border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 md:p-8 bg-gradient-to-t from-white dark:from-[#212121] via-white dark:via-[#212121] to-transparent">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex items-center group">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              placeholder={isTyping ? "Sedang memproses..." : "Tanyakan tentang proyek hidrogen..."}
              className="w-full bg-white dark:bg-[#2f2f2f] border border-gray-300 dark:border-white/10 rounded-full py-3.5 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm text-gray-900 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-[15px] transition-all disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={isTyping || !input.trim()} 
              className={`absolute right-1.5 p-2 rounded-full transition-all ${input.trim() && !isTyping ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md hover:scale-105' : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            </button>
          </form>
          <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-[0.2em] font-medium opacity-50">ChatHDI AI • Hydrogen Assistant</p>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
