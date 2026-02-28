"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

const STATUS_COLOR: Record<string, string> = {
  pending:     '#ef4444',
  in_progress: '#f59e0b',
  resolved:    '#22c55e',
  rejected:    '#9ca3af',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Новая', in_progress: 'В работе', resolved: 'Решено', rejected: 'Отклонено',
};

const CATEGORY_LABEL: Record<string, string> = {
  road: '🛣️ Дороги', utilities: '🔧 ЖКХ', lighting: '💡 Освещение',
  garbage: '🗑️ Мусор', greenery: '🌳 Озеленение', transport: '🚌 Транспорт',
  safety: '🛡️ Безопасность', other: '📌 Другое',
};

function createColoredIcon(status: string) {
  const color = STATUS_COLOR[status] || '#9ca3af';
  return L.divIcon({
    html: `<div style="
      width:18px;height:18px;
      border-radius:50% 50% 50% 0;
      background:${color};
      transform:rotate(-45deg);
      border:2px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    className: '',
    iconSize: [18, 18],
    iconAnchor: [9, 18],
    popupAnchor: [0, -20],
  });
}

interface Post {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  lat: number | string;
  lng: number | string;
  author_name?: string;
  votes?: number;
  address?: string;
  media_url?: string;
  created_at: string;
}

interface MapComponentProps {
  posts?: Post[];
}

export default function MapComponent({ posts = [] }: MapComponentProps) {
  // Фильтруем только посты с валидными координатами
  const validPosts = posts.filter(p => {
    const lat = parseFloat(String(p.lat));
    const lng = parseFloat(String(p.lng));
    return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
  });

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100">
      <MapContainer
        center={[50.2839, 57.1670]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />

        {validPosts.map((post) => {
          const lat = parseFloat(String(post.lat));
          const lng = parseFloat(String(post.lng));
          return (
            <Marker
              key={post.id}
              position={[lat, lng]}
              icon={createColoredIcon(post.status)}
            >
              <Popup maxWidth={260}>
                <div className="p-1">
                  {/* Фото если есть */}
                  {post.media_url && (
                    <img
                      src={post.media_url}
                      alt={post.title}
                      className="w-full h-28 object-cover rounded-lg mb-2"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}

                  {/* Категория и статус */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-blue-600 font-semibold">
                      {CATEGORY_LABEL[post.category] || post.category}
                    </span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full ml-2"
                      style={{
                        background: (STATUS_COLOR[post.status] || '#9ca3af') + '20',
                        color: STATUS_COLOR[post.status] || '#9ca3af',
                      }}
                    >
                      {STATUS_LABEL[post.status] || post.status}
                    </span>
                  </div>

                  <p className="font-bold text-sm text-gray-900 mb-1">{post.title}</p>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{post.description}</p>

                  {post.address && (
                    <p className="text-xs text-gray-400 mb-2">📍 {post.address}</p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-400 border-t pt-2 mb-2">
                    <span>{post.author_name || 'Аноним'}</span>
                    <span>▲ {post.votes ?? 0}</span>
                  </div>

                  <Link
                    href={`/posts/${post.id}`}
                    className="block text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg py-1.5 transition"
                  >
                    Подробнее →
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}