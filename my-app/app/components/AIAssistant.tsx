// Путь: app/components/AIAssistant.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Привет! Я Глория, ИИ-модератор MyVille. Какую проблему в городе нужно решить?' }
  ]);

  // Позиция кнопки — offset от правого нижнего угла
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const hasMoved = useRef(false);
  const startPointer = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const btnRef = useRef<HTMLDivElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // --- Drag handlers ---
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    hasMoved.current = false;
    startPointer.current = { x: e.clientX, y: e.clientY };
    startPos.current = { ...pos };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - startPointer.current.x;
    const dy = e.clientY - startPointer.current.y;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasMoved.current = true;

    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    // pos — смещение относительно дефолтной позиции (right-4 bottom-24/bottom-8)
    const newX = startPos.current.x + dx;
    const newY = startPos.current.y + dy;

    // Не даём кнопке уйти за края экрана
    const minX = -(window.innerWidth - rect.width - 16);
    const maxX = 0;
    const minY = -(window.innerHeight - rect.height - 16);
    const maxY = 0;

    setPos({
      x: Math.max(minX, Math.min(maxX, newX)),
      y: Math.max(minY, Math.min(maxY, newY)),
    });
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  const handleToggle = () => {
    // Не открываем/закрываем если был drag
    if (hasMoved.current) return;
    setIsOpen(prev => !prev);
  };

  // --- Chat ---
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ой, связь прервалась. Повторите?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={btnRef}
      className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 flex flex-col items-end"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: dragging.current ? 'none' : 'transform 0.15s ease',
        touchAction: 'none',
      }}
    >
      {/* Чат */}
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

          {/* Сообщения */}
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

      {/* Кнопка-кружок — drag handle */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={handleToggle}
        style={{ cursor: dragging.current ? 'grabbing' : 'grab' }}
      >
        <button
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-all duration-300 ${
            isOpen ? 'bg-[#2b2d31] rotate-90' : 'bg-[#5181b8] animate-bounce'
          }`}
          // Блокируем нативный клик — обрабатываем через onClick на обёртке
          onClick={(e) => e.stopPropagation()}
        >
          {isOpen ? <X size={24} /> : <Bot size={28} />}
        </button>
      </div>
    </div>
  );
}
