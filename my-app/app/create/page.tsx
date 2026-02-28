"use client";

import { useState, useRef } from 'react';
import { Camera, MapPin, Navigation, Send, X, Image } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const CATEGORY_OPTIONS = [
  { value: 'road',      label: '🛣️ Дороги' },
  { value: 'utilities', label: '🔧 ЖКХ' },
  { value: 'lighting',  label: '💡 Освещение' },
  { value: 'garbage',   label: '🗑️ Мусор' },
  { value: 'greenery',  label: '🌳 Озеленение' },
  { value: 'transport', label: '🚌 Транспорт' },
  { value: 'safety',    label: '🛡️ Безопасность' },
  { value: 'other',     label: '📌 Другое' },
];

export default function CreatePostPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Файл слишком большой. Максимум 5MB');
        return;
      }
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('GPS недоступен на этом устройстве');
      return;
    }
    setGpsLoading(true);
    setAddress('Определяем геопозицию...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (pos.coords.accuracy > 500) {
          navigator.geolocation.getCurrentPosition(
            (pos2) => {
              const latVal = parseFloat(pos2.coords.latitude.toFixed(5));
              const lngVal = parseFloat(pos2.coords.longitude.toFixed(5));
              setLat(latVal);
              setLng(lngVal);
              setAddress(`${latVal}, ${lngVal}`);
              setGpsLoading(false);
              setError(null);
            },
            () => {
              const latVal = parseFloat(pos.coords.latitude.toFixed(5));
              const lngVal = parseFloat(pos.coords.longitude.toFixed(5));
              setLat(latVal);
              setLng(lngVal);
              setAddress(`${latVal}, ${lngVal}`);
              setGpsLoading(false);
            },
            { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
          );
          return;
        }
        const latVal = parseFloat(pos.coords.latitude.toFixed(5));
        const lngVal = parseFloat(pos.coords.longitude.toFixed(5));
        setLat(latVal);
        setLng(lngVal);
        setAddress(`${latVal}, ${lngVal}`);
        setGpsLoading(false);
        setError(null);
      },
      (err) => {
        setAddress('');
        setGpsLoading(false);
        if (err.code === 1) setError('Разрешите доступ к геолокации в настройках браузера');
        else if (err.code === 2) setError('GPS недоступен. Попробуйте на улице');
        else setError('Не удалось получить локацию, попробуйте ещё раз');
      },
      { timeout: 15000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) { router.push('/login'); return; }
    setIsLoading(true);
    setError(null);

    try {
      let media_url: string | null = null;
      if (mediaFile) {
        try {
          const ext = mediaFile.name.split('.').pop();
          const path = `posts/${profile.id}/${Date.now()}.${ext}`;
          const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(path, mediaFile);
          if (!uploadError) {
            const { data: urlData } = supabase.storage.from('media').getPublicUrl(path);
            media_url = urlData.publicUrl;
          }
        } catch {
          // Storage недоступен — продолжаем без фото
        }
      }

      const postData: Record<string, unknown> = {
        author_id: profile.id,
        title: title.trim(),
        description: description.trim(),
        category,
        status: 'pending',
      };
      if (address && address !== 'Определяем геопозицию...') postData.address = address;
      if (lat !== null) postData.lat = lat;
      if (lng !== null) postData.lng = lng;
      if (media_url) postData.media_url = media_url;

      const { error: insertError } = await supabase.from('posts').insert(postData);
      if (insertError) throw insertError;

      router.push('/feed');
    } catch (err: any) {
      setError(err.message || 'Ошибка при отправке');
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = !isLoading && title.trim().length > 2 && description.trim().length > 2;

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Шапка */}
      <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-500 text-sm font-medium hover:text-gray-800 transition"
        >
          ← Назад
        </button>
        <h1 className="text-base font-bold text-gray-800">Новое обращение</h1>
        <div className="w-14" />
      </div>

      <form onSubmit={handleSubmit} className="px-4 pt-5 pb-6 flex flex-col gap-5 max-w-lg mx-auto">

        {/* Фото */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Фото <span className="text-gray-400 font-normal">(необязательно)</span>
          </label>

          {mediaPreview ? (
            <div className="relative h-44 rounded-2xl overflow-hidden border-2 border-blue-300">
              <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={removeMedia}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              {/* Камера */}
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 h-24 bg-white border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-1.5 active:bg-gray-50 transition"
              >
                <div className="bg-blue-50 p-2 rounded-full text-blue-500">
                  <Camera size={22} />
                </div>
                <span className="text-xs font-medium text-gray-500">Камера</span>
              </button>

              {/* Галерея */}
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="flex-1 h-24 bg-white border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-1.5 active:bg-gray-50 transition"
              >
                <div className="bg-purple-50 p-2 rounded-full text-purple-500">
                  <Image size={22} />
                </div>
                <span className="text-xs font-medium text-gray-500">Галерея</span>
              </button>
            </div>
          )}

          {/* Скрытые инпуты */}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            ref={cameraInputRef}
            onChange={handleFileChange}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={galleryInputRef}
            onChange={handleFileChange}
          />
        </div>

        {/* Заголовок */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Заголовок <span className="text-red-400">*</span></label>
          <input
            type="text"
            placeholder="Кратко: Яма на дороге, сломан фонарь..."
            className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 outline-none focus:border-blue-500 text-base bg-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            required
          />
        </div>

        {/* Категория */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Категория</label>
          <select
            className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 outline-none focus:border-blue-500 bg-white text-base appearance-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Описание */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Описание <span className="text-red-400">*</span></label>
          <textarea
            placeholder="Подробно опишите проблему: что случилось, насколько опасно, как давно..."
            className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 outline-none focus:border-blue-500 min-h-[110px] resize-none text-base bg-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Адрес + GPS */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Местоположение <span className="text-gray-400 font-normal">(необязательно)</span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Адрес или нажмите GPS →"
                className="w-full py-3.5 pl-9 pr-3 rounded-2xl border border-gray-200 outline-none focus:border-blue-500 text-sm bg-white"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={gpsLoading}
              className={`px-4 rounded-2xl flex items-center justify-center transition font-medium text-sm gap-1.5
                ${gpsLoading ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-700 active:bg-blue-200'}`}
            >
              <Navigation size={18} className={gpsLoading ? 'animate-spin' : ''} />
              {gpsLoading ? '' : 'GPS'}
            </button>
          </div>
          {lat && lng && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              ✅ Координаты сохранятся на карте
            </p>
          )}
        </div>

        {/* Ошибка */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3.5 rounded-2xl flex items-start gap-2">
            <span>❌</span>
            <span>{error}</span>
          </div>
        )}

        {/* Кнопка */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white text-base transition-all
            ${canSubmit
              ? 'bg-blue-600 active:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-200'
              : 'bg-gray-300 cursor-not-allowed'
            }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Отправка...
            </span>
          ) : (
            <><Send size={18} /> Отправить в акимат</>
          )}
        </button>

      </form>
    </div>
  );
}
