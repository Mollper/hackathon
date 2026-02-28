"use client";

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, User, Mail, Lock, MapPin, Save, Camera, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function SettingsPage() {
  const router = useRouter();
  const { profile, loading, updateProfile, signOut, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Заполняем поля реальными данными из профиля
  useEffect(() => {
    if (profile) {
      setName(profile.full_name || '');
      setCity(profile.city || '');
    }
  }, [profile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (!name.trim()) { setError('Введите имя'); return; }
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Загружаем аватар если выбран
      let avatar_url = profile.avatar_url;
      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop();
        const path = `avatars/${profile.id}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(path, avatarFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('media').getPublicUrl(path);
        avatar_url = urlData.publicUrl;
      }

      // 2. Обновляем профиль в таблице users
      const { error: profileError } = await updateProfile({
        full_name: name,
        city,
        avatar_url,
      });
      if (profileError) throw new Error(profileError);

      // 3. Меняем пароль если заполнен
      if (password) {
        if (password.length < 6) throw new Error('Пароль должен быть не менее 6 символов');
        const { error: pwError } = await supabase.auth.updateUser({ password });
        if (pwError) throw pwError;
      }

      await refreshProfile();
      setSuccess(true);
      setPassword('');
      setTimeout(() => router.push('/profile'), 1000);
    } catch (err: any) {
      setError(err.message || 'Ошибка при сохранении');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-400">Загрузка...</div>;
  }

  if (!profile) {
    router.push('/login');
    return null;
  }

  const initials = profile.full_name?.charAt(0)?.toUpperCase() || '?';
  const currentAvatar = avatarPreview || profile.avatar_url;

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Шапка */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Редактировать профиль</h1>
        <div className="w-10" />
      </div>

      <form onSubmit={handleSave} className="p-4 max-w-md mx-auto flex flex-col gap-6 mt-4">

        {/* Аватар */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden">
              {currentAvatar ? (
                <img src={currentAvatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black">
                  {initials}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg border-2 border-white hover:bg-blue-700 transition"
            >
              <Camera size={16} />
            </button>
          </div>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleAvatarChange} />
          <span className="text-sm text-blue-600 font-medium cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            Сменить фото
          </span>
        </div>

        {/* Уведомления */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-2xl text-center">❌ {error}</div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-4 rounded-2xl text-center">✅ Сохранено!</div>
        )}

        {/* Поля */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-5">

          {/* Email — только для отображения, не редактируется */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Электронная почта</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                className="w-full py-3 pl-10 pr-4 bg-gray-100 border border-transparent rounded-xl text-sm font-medium text-gray-400 cursor-not-allowed"
                value={profile.email}
                disabled
              />
            </div>
            <span className="text-xs text-gray-400">Email нельзя изменить</span>
          </div>

          {/* Имя */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Имя и Фамилия</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                className="w-full py-3 pl-10 pr-4 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition text-sm font-medium"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Город */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ваш город</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                className="w-full py-3 pl-10 pr-4 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition text-sm font-medium"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          {/* Пароль */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Новый пароль</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full py-3 pl-10 pr-4 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition text-sm font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <span className="text-xs text-gray-400">Оставьте пустым, если не хотите менять</span>
          </div>
        </div>

        {/* Сохранить */}
        <button
          type="submit"
          disabled={isSaving}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white text-lg transition-all ${
            isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.98]'
          }`}
        >
          {isSaving ? 'Сохранение...' : <><Save size={20} /> Сохранить изменения</>}
        </button>

        {/* Выйти */}
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-red-600 text-lg border-2 border-red-100 hover:bg-red-50 transition mb-8"
        >
          <LogOut size={20} /> Выйти из аккаунта
        </button>

      </form>
    </div>
  );
}