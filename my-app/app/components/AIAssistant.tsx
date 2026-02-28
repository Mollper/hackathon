// Путь: app/components/AIAssistant.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Image as ImageIcon, Video } from 'lucide-react';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // История сообщений
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Привет! Я Глория, ИИ-модератор MyVille. Какую проблему в городе нужно решить?' }
  ]);

  // Автоскролл чата вниз
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Отправляем запрос на наш бесплатный API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ой, связь прервалась. Повторите?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 flex flex-col items-end">
      
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-2rem)] md:w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Шапка */}
          <div className="bg-[#2b2d31] p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="bg-[#5181b8] p-1.5 rounded-full shadow-lg">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Глория AI</h3>
                <p className="text-[10px] text-gray-400">На связи 24/7</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-300 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Чат */}
          <div className="h-64 p-4 overflow-y-auto bg-[#19191a] flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`p-3 text-sm shadow-md ${
                msg.role === 'assistant' 
                ? 'bg-[#2b2d31] text-gray-100 rounded-2xl rounded-tl-sm w-[85%]' 
                : 'bg-[#5181b8] text-white rounded-2xl rounded-tr-sm self-end w-[85%]'
              }`}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-[#2b2d31] text-gray-400 p-3 rounded-2xl rounded-tl-sm w-[60%] text-xs flex items-center gap-2">
                <Bot size={14} className="animate-pulse" /> Печатает...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Ввод */}
          <div className="p-3 bg-[#19191a] border-t border-[#2b2d31]">
            <div className="flex items-center gap-2 bg-[#2b2d31] rounded-xl border border-[#3a3b3c] p-1 focus-within:border-[#5181b8] transition-colors">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Написать Глории..." 
                className="flex-1 bg-transparent text-sm p-2 text-white outline-none placeholder-gray-500"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-[#5181b8] text-white p-2 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
          
        </div>
      )}

      {/* Кнопка запуска */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-all duration-300 ${
          isOpen ? 'bg-[#2b2d31] rotate-90' : 'bg-[#5181b8] animate-bounce'
        }`}
      >
        {isOpen ? <X size={24} /> : <Bot size={28} />}
      </button>
      
    </div>
  );
}