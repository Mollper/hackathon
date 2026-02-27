// Файл: app/components/MapComponent.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockPosts } from '../data/mockPosts'; // Импортируем нашу "базу"

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapComponent() {
  return (
    <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100">
      <MapContainer 
        center={[50.2839, 57.1670]} // Фокус на центре города
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />
        
        {/* Отрисовываем маркеры прямо из нашей базы данных */}
        {mockPosts.map((post) => (
          <Marker key={post.id} position={[post.lat, post.lng]} icon={icon}>
            <Popup>
              <div className="p-1">
                <span className="text-xs text-blue-500 font-bold uppercase">{post.category}</span>
                <h3 className="font-bold text-sm my-1">{post.title}</h3>
                <p className="text-xs text-gray-600">{post.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}