"use client";

import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { FC } from 'react';

interface MapComponentProps {
  posts: any[];
}

const Map = dynamic(() => import('../components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">
      Загрузка карты...
    </div>
  ),
}) as unknown as FC<MapComponentProps>;

export default function MapPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('posts_with_meta')
      .select('*')
      .not('lat', 'is', null)
      .not('lng', 'is', null)
      .then(({ data }) => {
        if (data) setPosts(data);
        setLoading(false);
      });
  }, []);

  const activeCount = posts.filter((p) => p.status !== 'resolved' && p.status !== 'rejected').length;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <MapPin className="text-blue-600" /> Карта проблем
          </h1>
          <p className="text-sm text-gray-500">Кликните по метке, чтобы посмотреть проблему</p>
        </div>
        {!loading && (
          <div className="bg-blue-50 p-3 rounded-2xl flex items-center gap-2 text-blue-700 text-sm font-medium">
            <MapPin size={18} />
            {activeCount} активных {activeCount === 1 ? 'метка' : activeCount < 5 ? 'метки' : 'меток'}
          </div>
        )}
      </div>

      <div className="flex-1 relative">
        {/* Передаём реальные посты в MapComponent */}
        <Map posts={posts} />
      </div>
    </div>
  );
}