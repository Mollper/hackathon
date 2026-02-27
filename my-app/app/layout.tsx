"use client"; 

import AIAssistant from './components/AIAssistant';
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusSquare, User, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 1. Получаем текущий путь для подсветки активных кнопок
  const pathname = usePathname();
  
  // 2. Скрываем боковые панели на Главной (/) и Входе (/login)
  const isFullScreenPage = pathname === '/' || pathname === '/login';

  // 3. Скрипт для мгновенного включения темной темы (чтобы экран не моргал)
  const themeScript = `
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  `;

  // Если это Главная страница или Логин — отдаем пустой макет
  if (isFullScreenPage) {
    return (
      <html lang="ru">
        <head>
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        </head>
        <body className="bg-gray-50 text-gray-900 min-h-screen">{children}</body>
      </html>
    );
  }

  // Если это само приложение — отдаем макет с меню, ИИ и статистикой
  return (
    <html lang="ru">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      
      <body className="bg-gray-50 text-gray-900 min-h-screen pb-16 md:pb-0 flex justify-center transition-colors duration-300">
        
        {/* ЛЕВЫЙ САЙДБАР (Навигация) */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0 transition-colors duration-300">
          <div className="p-6 font-black text-2xl text-blue-600 tracking-tight">MyVille</div>
          <nav className="flex flex-col gap-2 px-4 mt-2">
            <Link href="/feed" className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-lg font-medium transition-colors ${pathname === '/feed' ? 'bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}><Home size={22} /> Лента</Link>
            <Link href="/map" className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-lg font-medium transition-colors ${pathname === '/map' ? 'bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}><MapPin size={22} /> Карта</Link>
            <Link href="/create" className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-lg font-medium transition-colors ${pathname === '/create' ? 'bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}><PlusSquare size={22} /> Сообщить</Link>
            <Link href="/profile" className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-lg font-medium transition-colors ${pathname === '/profile' ? 'bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}><User size={22} /> Профиль</Link>
          </nav>
        </aside>

        {/* ЦЕНТР (Основной контент) */}
        <main className="flex-1 max-w-2xl w-full md:border-r border-gray-100 min-h-screen transition-colors duration-300">
          {children}
        </main>
        
        {/* НАШ ИИ-ПОМОЩНИК */}
        <AIAssistant />

        {/* ПРАВЫЙ САЙДБАР (Инфо-панель) */}
        <aside className="hidden lg:block w-80 bg-gray-50 h-screen sticky top-0 p-6 transition-colors duration-300">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6 transition-colors duration-300">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-600" /> Сводка за неделю
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Решено проблем</span>
                <span className="font-bold text-green-600">142</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">В работе акимата</span>
                <span className="font-bold text-yellow-600">38</span>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-3xl p-5 border border-red-100 dark:border-red-900/30 transition-colors duration-300">
            <h3 className="font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
              <AlertTriangle size={18} /> Штормовое предупреждение
            </h3>
            <p className="text-xs text-red-600 dark:text-red-300 leading-relaxed">
              Сегодня ожидается усиление ветра до 20 м/с. Будьте осторожны возле деревьев и рекламных щитов.
            </p>
          </div>
        </aside>

        {/* НИЖНЯЯ ПАНЕЛЬ (Для мобильных) */}
        <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-100 flex justify-around p-3 z-50 pb-safe transition-colors duration-300">
          <Link href="/feed" className={`flex flex-col items-center hover:text-blue-600 ${pathname === '/feed' ? 'text-blue-600' : 'text-gray-500'}`}><Home size={24} /><span className="text-[10px] mt-1">Лента</span></Link>
          <Link href="/create" className={`flex flex-col items-center hover:text-blue-600 ${pathname === '/create' ? 'text-blue-600' : 'text-gray-500'}`}><PlusSquare size={24} /><span className="text-[10px] mt-1">Создать</span></Link>
          <Link href="/profile" className={`flex flex-col items-center hover:text-blue-600 ${pathname === '/profile' ? 'text-blue-600' : 'text-gray-500'}`}><User size={24} /><span className="text-[10px] mt-1">Профиль</span></Link>
        </nav>

      </body>
    </html>
  );
}