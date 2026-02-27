"use client";

import dynamic from 'next/dynamic';
import { MapPin, Info } from 'lucide-react';

// Важно: отключаем SSR для карты
const Map = dynamic(() => import('../components/MapComponent'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center">Загрузка карты...</div>
});

export default function MapPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <MapPin className="text-blue-600" /> Карта проблем
          </h1>
          <p className="text-sm text-gray-500">Кликните по карте, чтобы отметить проблему</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-2xl flex items-center gap-2 text-blue-700 text-sm font-medium">
          <Info size={18} /> 12 активных меток
        </div>
      </div>

      <div className="flex-1 relative">
        <Map />
      </div>
    </div>
  );
}