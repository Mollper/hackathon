"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';

// Фикс для иконок Leaflet (чтобы они не пропадали в Next.js)
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapComponent() {
  const [markers, setMarkers] = useState([
    { id: 1, position: [54.86, 69.13] as [number, number], title: "Яма на Абая" }, // Координаты Петропавловска
    { id: 2, position: [54.87, 69.15] as [number, number], title: "Сломан фонарь" }
  ]);

  // Функция для добавления маркера по клику
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const newMarker = {
          id: Date.now(),
          position: [e.latlng.lat, e.latlng.lng] as [number, number],
          title: "Новая проблема"
        };
        setMarkers([...markers, newMarker]);
      },
    });
    return null;
  }

  return (
    <div className="h-full w-full rounded-3xl overflow-hidden border-4 border-white shadow-xl">
      <MapContainer 
        center={[54.8667, 69.15]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {markers.map((m) => (
          <Marker key={m.id} position={m.position} icon={icon}>
            <Popup>
              <div className="font-bold">{m.title}</div>
              <button className="text-xs text-blue-600 mt-1 underline">Подробнее</button>
            </Popup>
          </Marker>
        ))}
        
        <LocationMarker />
      </MapContainer>
    </div>
  );
}