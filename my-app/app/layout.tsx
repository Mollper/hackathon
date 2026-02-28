"use client";

import AIAssistant from './components/AIAssistant';
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusSquare, User, MapPin, TrendingUp, AlertTriangle, Info, CheckCircle, Shield } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { supabase } from './lib/supabase';

const ALERT_STYLES: Record<string, { bg: string; border: string; title: string; text: string; icon: React.ReactNode }> = {
  warning: { bg: 'bg-red-50',    border: 'border-red-100',    title: 'text-red-700',    text: 'text-red-600',    icon: <AlertTriangle size={18} /> },
  danger:  { bg: 'bg-orange-50', border: 'border-orange-100', title: 'text-orange-700', text: 'text-orange-600', icon: <AlertTriangle size={18} /> },
  info:    { bg: 'bg-blue-50',   border: 'border-blue-100',   title: 'text-blue-700',   text: 'text-blue-600',   icon: <Info size={18} /> },
  success: { bg: 'bg-green-50',  border: 'border-green-100',  title: 'text-green-700',  text: 'text-green-600',  icon: <CheckCircle size={18} /> },
};

function RightSidebar() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ resolved: 0, in_progress: 0 });
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    supabase
      .from('posts')
      .select('status')
      .gte('created_at', weekAgo.toISOString())
      .then(({ data }) => {
        if (data) {
          setStats({
            resolved:    data.filter(p => p.status === 'resolved').length,
            in_progress: data.filter(p => p.status === 'in_progress').length,
          });
        }
      });

    supabase
      .from('alerts')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setAlerts(data);
      });
  }, []);

  return (
    <aside className="hidden lg:block w-80 bg-gray-50 h-screen sticky top-0 p-6 overflow-y-auto transition-colors duration-300">
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-blue-600" /> Сводка за неделю
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Решено проблем</span>
            <span className="font-bold text-green-600">{stats.resolved}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">В работе акимата</span>
            <span className="font-bold text-yellow-600">{stats.in_progress}</span>
          </div>
        </div>
      </div>

      {alerts.length > 0 ? alerts.map((alert) => {
        const style = ALERT_STYLES[alert.type] || ALERT_STYLES.info;
        return (
          <div key={alert.id} className={`${style.bg} rounded-3xl p-5 border ${style.border} mb-4 transition-colors duration-300`}>
            <h3 className={`font-bold ${style.title} mb-2 flex items-center gap-2`}>
              {style.icon} {alert.title}
            </h3>
            <p className={`text-xs ${style.text} leading-relaxed`}>{alert.message}</p>
          </div>
        );
      }) : (
        <div className="bg-green-50 rounded-3xl p-5 border border-green-100">
          <h3 className="font-bold text-green-700 mb-2 flex items-center gap-2">
            <CheckCircle size={18} /> Всё спокойно
          </h3>
          <p className="text-xs text-green-600 leading-relaxed">Активных предупреждений нет</p>
        </div>
      )}

      {profile?.role === 'admin' && (
        <Link
          href="/admin"
          className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-2xl font-semibold text-sm hover:bg-gray-700 transition"
        >
          <Shield size={16} /> Панель администратора
        </Link>
      )}
    </aside>
  );
}


function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullScreenPage = pathname === '/' || pathname === '/login';

  const themeScript = `
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  `;

  if (isFullScreenPage) {
    return (
      <html lang="ru">
        <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
        <body className="bg-gray-50 text-gray-900 min-h-screen">
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="ru">
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className="bg-gray-50 text-gray-900 min-h-screen pb-16 md:pb-0 flex justify-center transition-colors duration-300">

        {/* ЛЕВЫЙ САЙДБАР */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0 transition-colors duration-300">
          <div className="p-6 font-black text-2xl text-blue-600 tracking-tight">MyVille</div>
          <nav className="flex flex-col gap-2 px-4 mt-2">
            <Link href="/feed"    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-lg font-medium transition-colors ${pathname === '/feed'    ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}><Home size={22} /> Лента</Link>
            <Link href="/map"     className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-lg font-medium transition-colors ${pathname === '/map'     ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}><MapPin size={22} /> Карта</Link>
            <Link href="/create"  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-lg font-medium transition-colors ${pathname === '/create'  ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}><PlusSquare size={22} /> Сообщить</Link>
            <Link href="/profile" className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-lg font-medium transition-colors ${pathname === '/profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}><User size={22} /> Профиль</Link>
          </nav>
        </aside>

        {/* ЦЕНТР */}
        <main className="flex-1 max-w-2xl w-full md:border-r border-gray-100 min-h-screen transition-colors duration-300">
          {children}
        </main>

        <AIAssistant />
        <RightSidebar />

        {/* НИЖНЯЯ ПАНЕЛЬ (мобильная) */}
        <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-100 flex justify-around p-3 z-50 transition-colors duration-300">
          <Link href="/feed"    className={`flex flex-col items-center hover:text-blue-600 ${pathname === '/feed'    ? 'text-blue-600' : 'text-gray-500'}`}><Home size={24} /><span className="text-[10px] mt-1">Лента</span></Link>
          <Link href="/map"     className={`flex flex-col items-center hover:text-blue-600 ${pathname === '/map'     ? 'text-blue-600' : 'text-gray-500'}`}><MapPin size={24} /><span className="text-[10px] mt-1">Карта</span></Link>
          <Link href="/create"  className={`flex flex-col items-center hover:text-blue-600 ${pathname === '/create'  ? 'text-blue-600' : 'text-gray-500'}`}><PlusSquare size={24} /><span className="text-[10px] mt-1">Создать</span></Link>
          <Link href="/profile" className={`flex flex-col items-center hover:text-blue-600 ${pathname === '/profile' ? 'text-blue-600' : 'text-gray-500'}`}><User size={24} /><span className="text-[10px] mt-1">Профиль</span></Link>
        </nav>

      </body>
    </html>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}
