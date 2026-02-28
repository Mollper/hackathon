"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, MapPin, ThumbsUp, Send, Trash2 } from 'lucide-react';
import Link from 'next/link';

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-red-100 text-red-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
  rejected: 'bg-gray-100 text-gray-600',
};
const STATUS_LABEL: Record<string, string> = {
  pending: 'Новая', in_progress: 'В работе', resolved: 'Решено', rejected: 'Отклонено',
};
const CATEGORY_LABEL: Record<string, string> = {
  road: '🛣️ Дороги', utilities: '🔧 ЖКХ', lighting: '💡 Освещение',
  garbage: '🗑️ Мусор', greenery: '🌳 Озеленение', transport: '🚌 Транспорт',
  safety: '🛡️ Безопасность', other: '📌 Другое',
};

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { profile } = useAuth();

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadPost();
    loadComments();
  }, [id]);

  useEffect(() => {
    if (!profile || !id) return;
    supabase.from('post_votes').select('id').eq('post_id', id).eq('user_id', profile.id).single().then(({ data }) => setVoted(!!data));
  }, [profile, id]);

  const loadPost = async () => {
    const { data } = await supabase.from('posts_with_meta').select('*').eq('id', id).single();
    if (data) setPost(data);
    setLoading(false);
  };

  const loadComments = async () => {
    const { data } = await supabase.from('comments').select('*, users(full_name, avatar_url)').eq('post_id', id).order('created_at', { ascending: true });
    if (data) setComments(data);
  };

  const toggleVote = async () => {
    if (!profile) { router.push('/login'); return; }
    if (voted) {
      await supabase.from('post_votes').delete().eq('post_id', id).eq('user_id', profile.id);
      setVoted(false);
      setPost((p: any) => ({ ...p, votes: p.votes - 1 }));
    } else {
      await supabase.from('post_votes').insert({ post_id: id, user_id: profile.id });
      setVoted(true);
      setPost((p: any) => ({ ...p, votes: p.votes + 1 }));
    }
  };

  // ✅ ФИКС: удаление поста
  const deletePost = async () => {
    if (!confirm('Удалить этот пост? Это действие нельзя отменить.')) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (!error) router.push('/feed');
  };

  const submitComment = async () => {
    if (!profile || !commentText.trim()) return;
    setSubmittingComment(true);
    await supabase.from('comments').insert({ post_id: id, author_id: profile.id, content: commentText.trim() });
    setCommentText('');
    await loadComments();
    setSubmittingComment(false);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-400">Загрузка...</div>;
  if (!post) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-gray-500">Пост не найден</p>
      <Link href="/feed" className="text-blue-600 font-semibold">← Вернуться в ленту</Link>
    </div>
  );

  const canDelete = profile && (profile.id === post.author_id || profile.role === 'admin');

  return (
    <div className="max-w-2xl mx-auto pb-24">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-gray-100 transition text-gray-600">
          <ArrowLeft size={22} />
        </button>
        <span className="font-bold text-gray-900 truncate flex-1">{post.title}</span>
        <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${STATUS_STYLE[post.status] || 'bg-gray-100 text-gray-600'}`}>
          {STATUS_LABEL[post.status] || post.status}
        </span>
        {/* ✅ ФИКС: кнопка удаления */}
        {canDelete && (
          <button onClick={deletePost} className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition shrink-0" title="Удалить пост">
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {post.media_url && (
        <div className="w-full h-64 bg-gray-100 overflow-hidden">
          <img src={post.media_url} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-4 md:p-6">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          {CATEGORY_LABEL[post.category] || post.category}
        </span>
        <h1 className="text-2xl font-black text-gray-900 mt-3 mb-3 leading-tight">{post.title}</h1>
        <p className="text-gray-600 leading-relaxed mb-5">{post.description}</p>

        {post.address && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-5 bg-gray-50 p-3 rounded-2xl">
            <MapPin size={16} className="text-blue-500 shrink-0" />
            <span>{post.address}</span>
          </div>
        )}

        <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
              {post.author_avatar ? <img src={post.author_avatar} alt="" className="w-full h-full object-cover" /> : (post.author_name?.[0] || '?')}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{post.author_name || 'Аноним'}</p>
              <p className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
          <button onClick={toggleVote} className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition ${voted ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            <ThumbsUp size={16} /> {post.votes}
          </button>
        </div>

        <h2 className="font-bold text-gray-900 mb-4 text-lg">
          Комментарии {comments.length > 0 && <span className="text-gray-400 font-normal text-base">({comments.length})</span>}
        </h2>

        {comments.length === 0 && <p className="text-gray-400 text-sm text-center py-6">Пока нет комментариев. Будьте первым!</p>}

        <div className="flex flex-col gap-4 mb-6">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-tr from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                {c.users?.avatar_url ? <img src={c.users.avatar_url} alt="" className="w-full h-full object-cover" /> : (c.users?.full_name?.[0] || '?')}
              </div>
              <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-900">{c.users?.full_name || 'Аноним'}</span>
                  <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString('ru-RU')}</span>
                </div>
                <p className="text-sm text-gray-600">{c.content}</p>
              </div>
            </div>
          ))}
        </div>

        {profile ? (
          <div className="flex gap-3 items-end">
            <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
              {profile.avatar_url ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" /> : (profile.full_name?.[0] || '?')}
            </div>
            <div className="flex-1 flex gap-2">
              <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Написать комментарий..." rows={1} className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-blue-500 resize-none transition"
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment(); } }} />
              <button onClick={submitComment} disabled={submittingComment || !commentText.trim()} className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-40 transition shrink-0">
                <Send size={18} />
              </button>
            </div>
          </div>
        ) : (
          <Link href="/login" className="block text-center text-sm text-blue-600 font-semibold bg-blue-50 p-4 rounded-2xl hover:bg-blue-100 transition">
            Войдите чтобы оставить комментарий
          </Link>
        )}
      </div>
    </div>
  );
}