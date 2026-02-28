"use client";

import { useState, useEffect } from 'react';
import { Settings, CheckCircle, Clock, Moon, Sun, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  citizen:   { label: '👤 Активный горожанин', color: 'bg-amber-100 text-amber-700' },
  moderator: { label: '🛡️ Модератор',          color: 'bg-blue-100 text-blue-700' },
  admin:     { label: '⚡ Администратор',       color: 'bg-purple-100 text-purple-700' },
};

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  pending:     { label: 'Новая',      className: 'bg-red-100 text-red-700' },
  in_progress: { label: 'В работе',   className: 'bg-yellow-100 text-yellow-700' },
  resolved:    { label: 'Решено',     className: 'bg-green-100 text-green-700' },
  rejected:    { label: 'Отклонено',  className: 'bg-gray-100 text-gray-600' },
};

export default function ProfilePage() {
  const { profile, loading } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [stats, setStats] = useState({ resolved: 0, inProgress: 0, rejected: 0 });

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') setIsDark(true);
  }, []);

  useEffect(() => {
    if (!profile) return;
    supabase
      .from('posts')
      .select('*')
      .eq('author_id', profile.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) {
          setPosts(data);
          setStats({
            resolved:   data.filter(p => p.status === 'resolved').length,
            inProgress: data.filter(p => p.status === 'in_progress').length,
            rejected:   data.filter(p => p.status === 'rejected').length,
          });
        }
      });
  }, [profile]);

  const toggleTheme = () => {
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

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Сегодня';
    if (days === 1) return '1 день назад';
    if (days < 7) return `${days} дн. назад`;
    if (days < 30) return `${Math.floor(days / 7)} нед. назад`;
    return `${Math.floor(days / 30)} мес. назад`;
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-screen">
      <p className="text-gray-400">Загрузка...</p>
    </div>
  );

  if (!profile) return (
    <div className="p-8 flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-gray-600">Вы не вошли в аккаунт</p>
      <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold">
        Войти
      </Link>
    </div>
  );

  const initials = profile.full_name?.charAt(0)?.toUpperCase() || profile.email?.charAt(0)?.toUpperCase() || '?';
  const roleInfo = ROLE_LABELS[profile.role] || ROLE_LABELS.citizen;

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">

      {/* Шапка */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Мой профиль</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl bg-white shadow-sm border border-gray-200 flex items-center gap-1.5 font-medium text-sm text-gray-700"
          >
            {isDark ? <><Sun size={16} className="text-yellow-500" /> Свет</> : <><Moon size={16} className="text-blue-600" /> Темная</>}
          </button>
          <Link href="/settings" className="p-2.5 rounded-2xl bg-white shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
            <Settings size={20} />
          </Link>
        </div>
      </div>

      {/* Карточка пользователя */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 mb-6">
        <div className="w-20 h-20 shrink-0 rounded-full overflow-hidden shadow-md">
          {profile.avatar_url
            ? <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">{initials}</div>
          }
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900 truncate">{profile.full_name || 'Без имени'}</h2>
          <p className="text-sm text-gray-400 mb-2 truncate">{profile.city || 'Город не указан'}</p>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${roleInfo.color}`}>
            {roleInfo.label}
          </span>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
            <CheckCircle size={20} />
          </div>
          <span className="text-2xl font-black text-gray-900">{stats.resolved}</span>
          <span className="text-xs text-gray-400 mt-0.5 text-center">Решено</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-2">
            <Clock size={20} />
          </div>
          <span className="text-2xl font-black text-gray-900">{stats.inProgress}</span>
          <span className="text-xs text-gray-400 mt-0.5 text-center">В работе</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-10 h-10 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mb-2">
            <XCircle size={20} />
          </div>
          <span className="text-2xl font-black text-gray-900">{stats.rejected}</span>
          <span className="text-xs text-gray-400 mt-0.5 text-center">Отклонено</span>
        </div>
      </div>

      {/* Ссылка на админку для админов */}
      {profile.role === 'admin' && (
        <Link
          href="/admin"
          className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-2xl font-semibold text-sm hover:bg-gray-700 transition mb-6"
        >
          ⚡ Панель администратора
        </Link>
      )}

      {/* Мои обращения */}
      <h3 className="text-lg font-bold mb-3 text-gray-900">Мои обращения ({posts.length})</h3>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {posts.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Вы ещё не создавали обращений</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {posts.map((post) => {
              const s = STATUS_LABEL[post.status] || STATUS_LABEL.pending;
              return (
                <Link href={`/posts/${post.id}`} key={post.id} className="flex justify-between items-center p-4 hover:bg-gray-50 transition">
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="font-semibold text-sm text-gray-900 truncate">{post.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(post.created_at)}</p>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${s.className}`}>
                    {s.label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}