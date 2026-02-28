"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Shield, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'pending',     label: 'Новая' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'resolved',    label: 'Решено' },
  { value: 'rejected',    label: 'Отклонено' },
];

const ALERT_TYPES = [
  { value: 'info',    label: '🔵 Информация' },
  { value: 'warning', label: '🔴 Предупреждение' },
  { value: 'danger',  label: '🟠 Опасность' },
  { value: 'success', label: '🟢 Хорошие новости' },
];

const CATEGORY_LABEL: Record<string, string> = {
  road: '🛣️ Дороги', utilities: '🔧 ЖКХ', lighting: '💡 Освещение',
  garbage: '🗑️ Мусор', greenery: '🌳 Озеленение', transport: '🚌 Транспорт',
  safety: '🛡️ Безопасность', other: '📌 Другое',
};

export default function AdminPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [tab, setTab] = useState<'posts' | 'alerts'>('posts');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('warning');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && profile?.role !== 'admin') router.push('/feed');
  }, [profile, loading]);

  useEffect(() => {
    loadPosts();
    loadAlerts();
  }, []);

  const loadPosts = async () => {
    const { data } = await supabase.from('posts_with_meta').select('*').order('created_at', { ascending: false }).limit(50);
    if (data) setPosts(data);
  };

  const loadAlerts = async () => {
    const { data } = await supabase.from('alerts').select('*').order('created_at', { ascending: false });
    if (data) setAlerts(data);
  };

  const updatePostStatus = async (postId: string, status: string) => {
    await supabase.from('posts').update({ status }).eq('id', postId);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, status } : p));
  };

  // ✅ ФИКС: удаление поста из админки
  const deletePost = async (postId: string) => {
    if (!confirm('Удалить этот пост? Это действие нельзя отменить.')) return;
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (!error) setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const createAlert = async () => {
    if (!alertTitle || !alertMessage || !profile) return;
    setSaving(true);
    const { error } = await supabase.from('alerts').insert({ title: alertTitle, message: alertMessage, type: alertType, created_by: profile.id, active: true });
    if (!error) { setAlertTitle(''); setAlertMessage(''); setAlertType('warning'); loadAlerts(); }
    setSaving(false);
  };

  const toggleAlert = async (id: string, active: boolean) => {
    await supabase.from('alerts').update({ active: !active }).eq('id', id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !active } : a));
  };

  const deleteAlert = async (id: string) => {
    await supabase.from('alerts').delete().eq('id', id);
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-400">Загрузка...</div>;
  if (profile?.role !== 'admin') return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gray-900 text-white p-2 rounded-xl"><Shield size={24} /></div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Панель администратора</h1>
          <p className="text-sm text-gray-500">Управление постами и уведомлениями</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-2xl w-fit">
        <button onClick={() => setTab('posts')} className={`px-5 py-2 rounded-xl font-semibold text-sm transition ${tab === 'posts' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
          📋 Посты ({posts.length})
        </button>
        <button onClick={() => setTab('alerts')} className={`px-5 py-2 rounded-xl font-semibold text-sm transition ${tab === 'alerts' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
          🔔 Уведомления ({alerts.filter(a => a.active).length} активных)
        </button>
      </div>

      {tab === 'posts' && (
        <div className="flex flex-col gap-4">
          {posts.length === 0 && <p className="text-center text-gray-400 py-8">Нет постов</p>}
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-1">{CATEGORY_LABEL[post.category]} · {post.author_name} · {new Date(post.created_at).toLocaleDateString('ru-RU')}</p>
                  <p className="font-bold text-gray-900 truncate">{post.title}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select value={post.status} onChange={(e) => updatePostStatus(post.id, e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white font-medium">
                    {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  {/* ✅ ФИКС: кнопка удаления */}
                  <button onClick={() => deletePost(post.id)} className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition" title="Удалить пост">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'alerts' && (
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Plus size={18} /> Новое уведомление</h2>
            <div className="flex flex-col gap-3">
              <select value={alertType} onChange={(e) => setAlertType(e.target.value)} className="border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 bg-white text-sm">
                {ALERT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <input type="text" placeholder="Заголовок уведомления..." className="border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 text-sm" value={alertTitle} onChange={(e) => setAlertTitle(e.target.value)} />
              <textarea placeholder="Текст уведомления..." className="border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 text-sm resize-none h-24" value={alertMessage} onChange={(e) => setAlertMessage(e.target.value)} />
              <button onClick={createAlert} disabled={saving || !alertTitle || !alertMessage} className="bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-700 disabled:opacity-50 transition">
                {saving ? 'Сохранение...' : 'Опубликовать уведомление'}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {alerts.length === 0 && <p className="text-center text-gray-400 py-8">Нет уведомлений</p>}
            {alerts.map((alert) => (
              <div key={alert.id} className={`bg-white rounded-2xl p-5 shadow-sm border flex justify-between items-start gap-4 ${alert.active ? 'border-blue-100' : 'border-gray-100 opacity-60'}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase text-gray-400">{alert.type}</span>
                    {alert.active && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Активно</span>}
                  </div>
                  <p className="font-bold text-gray-900">{alert.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{alert.message}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleAlert(alert.id, alert.active)} className={`p-2 rounded-xl transition ${alert.active ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                    {alert.active ? <XCircle size={18} /> : <CheckCircle size={18} />}
                  </button>
                  <button onClick={() => deleteAlert(alert.id)} className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}