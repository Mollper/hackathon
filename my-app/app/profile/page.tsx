"use client";

import { useState, useEffect } from 'react';
import { Settings, Award, CheckCircle, Clock, Moon, Sun } from 'lucide-react';
import Link from 'next/link'; // <-- Добавили импорт для перехода по страницам

export default function ProfilePage() {
  const [isDark, setIsDark] = useState(false);

  // При заходе в профиль проверяем, какая тема сейчас сохранена
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      setIsDark(true);
    }
  }, []);

  // Функция переключения: меняет всё приложение и сохраняет навсегда
  const toggleGlobalTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <div className="p-4 md:p-8 transition-colors duration-300">
      
      {/* Шапка с умной кнопкой и настройками */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Мой профиль</h1>
        
        {/* Обернули кнопки в один блок, чтобы они стояли рядом */}
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleGlobalTheme}
            className="p-3 rounded-2xl bg-white transition-all shadow-sm border border-gray-200 flex items-center gap-2 font-medium text-sm text-gray-900"
          >
            {isDark ? <><Sun size={18} className="text-yellow-500" /> Светлая</> : <><Moon size={18} className="text-blue-600" /> Темная</>}
          </button>

          {/* <-- НОВАЯ КНОПКА НАСТРОЕК --> */}
          <Link 
            href="/settings"
            className="p-3 rounded-2xl bg-white transition-all shadow-sm border border-gray-200 flex items-center justify-center text-gray-900 hover:bg-gray-50 active:scale-95"
          >
            <Settings size={20} />
          </Link>
        </div>
      </div>

      {/* Карточка пользователя */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 relative overflow-hidden">
        <div className="w-24 h-24 min-w-[6rem] bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg z-10">
          А
        </div>
        
        <div className="flex-1 text-center md:text-left z-10">
          <h2 className="text-2xl font-bold mb-1 text-gray-900">Айдос Н.</h2>
          <p className="text-sm mb-3 text-gray-500">Петропавловск</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
            <Award size={14} /> Активный горожанин
          </div>
        </div>
      </div>

      {/* Блок статистики */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
            <CheckCircle size={24} />
          </div>
          <span className="text-3xl font-black mb-1 text-gray-900">12</span>
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Решено</span>
        </div>
        
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-3">
            <Clock size={24} />
          </div>
          <span className="text-3xl font-black mb-1 text-gray-900">3</span>
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">В работе</span>
        </div>
      </div>

      {/* История обращений */}
      <h3 className="text-xl font-bold mb-4 text-gray-900">Мои обращения</h3>
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-5">
        <div className="flex justify-between items-center border-b border-gray-50 pb-5">
          <div>
            <p className="font-semibold text-base mb-1 text-gray-900">Глубокая лужа у подъезда</p>
            <p className="text-xs text-gray-500">ул. Абая 45 • 2 дня назад</p>
          </div>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-wider">
            В работе
          </span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-base mb-1 text-gray-900">Сломанная скамейка</p>
            <p className="text-xs text-gray-500">Парк Победы • Неделю назад</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
            Решено
          </span>
        </div>
      </div>

    </div>
  );
}