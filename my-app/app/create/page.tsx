// Файл: app/create/page.tsx
"use client";

import { useState, useRef } from 'react';
import { Camera, MapPin, Navigation, Send, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreatePostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Обработка загрузки фото/видео
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Создаем временную ссылку на файл для предпросмотра
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
    }
  };

  // Получение локации с GPS телефона
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setAddress('Определяем геопозицию...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // В реальном проекте здесь можно перевести координаты в улицу через API карты
          setAddress(`Координаты: ${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`);
        },
        () => setAddress('Не удалось получить локацию')
      );
    }
  };

  // Имитация отправки
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Имитируем задержку сети (как будто отправляем на наш ИИ)
    setTimeout(() => {
      setIsLoading(false);
      alert('Заявка успешно отправлена в акимат!');
      router.push('/feed'); // Перекидываем обратно в ленту
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Шапка для телефона */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex justify-center items-center">
        <h1 className="text-lg font-bold text-gray-800">Новое обращение</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-6 max-w-md mx-auto">
        
        {/* БЛОК 1: Загрузка фото/видео */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">Медиа</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="h-48 bg-white border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden relative"
          >
            {mediaPreview ? (
              <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <div className="bg-blue-50 p-4 rounded-full text-blue-600 mb-2">
                  <Camera size={32} />
                </div>
                <span className="text-sm font-medium text-gray-500">Сделать фото или загрузить</span>
              </>
            )}
          </div>
          <input 
            type="file" 
            accept="image/*,video/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        {/* БЛОК 2: Описание проблемы */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">Что случилось?</label>
          <textarea 
            placeholder="Подробно опишите проблему..." 
            className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:border-blue-500 min-h-[120px] resize-none text-base"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* БЛОК 3: Адрес и Карта */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">Где это находится?</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Ввести адрес вручную..." 
                className="w-full py-3 pl-10 pr-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 text-sm"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            {/* Кнопка включения GPS */}
            <button 
              type="button"
              onClick={handleGetLocation}
              className="bg-blue-100 text-blue-700 p-3 rounded-xl flex items-center justify-center active:bg-blue-200 transition"
              title="Мое местоположение"
            >
              <Navigation size={20} />
            </button>
          </div>
        </div>

        {/* Кнопка отправки (фиксированная внизу над меню) */}
        <button 
          type="submit"
          disabled={isLoading || !description}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white text-lg transition-all ${
            isLoading || !description ? 'bg-gray-300' : 'bg-blue-600 active:bg-blue-700 shadow-lg shadow-blue-200'
          }`}
        >
          {isLoading ? 'Отправка...' : 'Отправить в акимат'} <Send size={20} />
        </button>

      </form>
    </div>
  );
}