"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

interface Post {
  author_id: string;
  title: string;
  description: string;
  category: string;
  status: string;
}

const CATEGORY_OPTIONS = [
  { value: '', label: 'Все категории' },
  { value: 'road', label: 'Дороги' },
  { value: 'utilities', label: 'ЖКХ' },
  { value: 'lighting', label: 'Освещение' },
  { value: 'garbage', label: 'Мусор' },
  { value: 'greenery', label: 'Озеленение' },
  { value: 'transport', label: 'Транспорт' },
  { value: 'safety', label: 'Безопасность' },
  { value: 'other', label: 'Другое' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Все статусы' },
  { value: 'pending', label: 'Новая' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'resolved', label: 'Решено' },
  { value: 'rejected', label: 'Отклонено' },
];

const STATUS_STYLE: Record<string, string> = {
  pending:     'bg-red-100 text-red-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  resolved:    'bg-green-100 text-green-700',
  rejected:    'bg-gray-100 text-gray-600',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Новая', in_progress: 'В работе', resolved: 'Решено', rejected: 'Отклонено',
};

const CATEGORY_LABEL: Record<string, string> = {
  road: '🛣️ Дороги', utilities: '🔧 ЖКХ', lighting: '💡 Освещение',
  garbage: '🗑️ Мусор', greenery: '🌳 Озеленение', transport: '🚌 Транспорт',
  safety: '🛡️ Безопасность', other: '📌 Другое',
};

export default function FeedPage() {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');
  const [submitting, setSubmitting] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('posts_with_meta').select('*');
    if (filterCategory) query = query.eq('category', filterCategory);
    if (filterStatus)   query = query.eq('status', filterStatus);
    if (search)         query = query.ilike('title', `%${search}%`);
    query = sortBy === 'votes'
      ? query.order('votes', { ascending: false })
      : query.order('created_at', { ascending: false });
    const { data } = await query.limit(50);
    if (data) setPosts(data);
    setLoading(false);
  }, [filterCategory, filterStatus, search, sortBy]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  useEffect(() => {
    if (!profile) return;
    supabase.from('post_votes').select('post_id').eq('user_id', profile.id).then(({ data }) => {
      if (data) setUserVotes(new Set(data.map((v: any) => v.post_id)));
    });
  }, [profile]);

  const toggleVote = async (postId: string) => {
    if (!profile) return;
    const voted = userVotes.has(postId);
    if (voted) {
      await supabase.from('post_votes').delete().eq('post_id', postId).eq('user_id', profile.id);
      setUserVotes(prev => { const s = new Set(prev); s.delete(postId); return s; });
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, votes: p.votes - 1 } : p));
    } else {
      await supabase.from('post_votes').insert({ post_id: postId, user_id: profile.id });
      setUserVotes(prev => new Set([...prev, postId]));
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, votes: p.votes + 1 } : p));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !title || !description) return;
    setSubmitting(true);
    await supabase.from('posts').insert<Post>({
      author_id: profile.id,
      title,
      description,
      category,
      status: 'pending',
    });
    setTitle('');
    setDescription('');
    setCategory('other');
    setSubmitting(false);
    loadPosts();
  };

  const deletePost = async (postId: string) => {
    if (!profile) return;
    if (!confirm('Удалить этот пост?')) return;
    await supabase.from('posts').delete().eq('id', postId).eq('author_id', profile.id);
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-black mb-6 text-gray-800">Городская лента</h1>

      {profile && (
        <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-blue-100 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Сообщить о проблеме</h2>
            <Link
              href="/create"
              className="text-xs text-blue-600 font-semibold bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition"
            >
              📷 С фото →
            </Link>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Краткий заголовок (например: Яма во дворе)"
              className="border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Опишите проблему подробнее..."
              className="border border-gray-200 rounded-xl p-3 h-24 outline-none focus:border-blue-500 transition resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <div className="flex justify-between items-center gap-3">
              <select
                className="border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 bg-white flex-1"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORY_OPTIONS.filter(c => c.value).map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition whitespace-nowrap"
              >
                {submitting ? 'Отправка...' : 'Отправить'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Фильтры */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Поиск..."
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 flex-1 min-w-[140px]"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none bg-white"
        >
          {CATEGORY_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none bg-white"
        >
          {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none bg-white"
        >
          <option value="created_at">Новые</option>
          <option value="votes">Популярные</option>
        </select>
      </div>

      {/* Лента постов */}
      {loading ? (
        <div className="flex flex-col gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-4 bg-gray-100 m-6 rounded" />
              <div className="h-3 bg-gray-100 mx-6 mb-6 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🏙️</div>
          <p className="font-medium">Постов не найдено</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden">

              {post.media_url && (
                <div className="w-full h-52 overflow-hidden bg-gray-100">
                  <img
                    src={post.media_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {CATEGORY_LABEL[post.category] || post.category}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLE[post.status] || 'bg-gray-100 text-gray-600'}`}>
                    {STATUS_LABEL[post.status] || post.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-2 text-gray-900 leading-snug">{post.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-3">{post.description}</p>

                {post.address && (
                  <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                    📍 {post.address}
                  </p>
                )}

                <div className="flex justify-between items-center text-sm text-gray-400 border-t pt-3">
                  <span className="text-xs">👤 {post.author_name || 'Аноним'}</span>
                  <div className="flex items-center gap-3">
                    {/* Кнопка удаления — только для автора поста */}
                    {profile && post.author_id === profile.id && (
                      <button
                        onClick={() => deletePost(post.id)}
                        className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-xl hover:bg-red-50 transition"
                      >
                        🗑 Удалить
                      </button>
                    )}
                    <button
                      onClick={() => toggleVote(post.id)}
                      className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-xl transition ${
                        userVotes.has(post.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      ▲ {post.votes}
                    </button>
                    <span className="text-xs">{new Date(post.created_at).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}