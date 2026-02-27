// Файл: app/settings/page.tsx
"use client";

import { useState } from 'react';
import { ArrowLeft, User, Mail, Lock, MapPin, Save, Camera } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  
  // Исходные (фейковые) данные пользователя
  const [name, setName] = useState('Айдос Н.');
  const [email, setEmail] = useState('aidos.n@example.com');
  const [city, setCity] = useState('Актобе');
  const [password, setPassword] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);

  // Функция имитации сохранения
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Имитируем задержку сети на 1 секунду
    setTimeout(() => {
      setIsSaving(false);
      alert('Данные профиля успешно обновлены!');
      router.push('/profile'); // Возвращаем пользователя в профиль
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Шапка с кнопкой "Назад" */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Редактировать профиль</h1>
        <div className="w-10"></div> {/* Пустой блок для центрирования заголовка */}
      </div>

      <form onSubmit={handleSave} className="p-4 max-w-md mx-auto flex flex-col gap-6 mt-4">
        
        {/* Аватарка с кнопкой изменения */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-black border-4 border-white shadow-md overflow-hidden">
              {name.charAt(0)}
            </div>
            <button type="button" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg border-2 border-white hover:bg-blue-700 transition">
              <Camera size={16} />
            </button>
          </div>
          <span className="text-sm text-blue-600 font-medium cursor-pointer">Сменить фото</span>
        </div>

        {/* Поля ввода */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-5">
          
          {/* Имя */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Имя пользователя</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="text" 
                className="w-full py-3 pl-10 pr-4 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition text-sm font-medium"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Электронная почта</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="email" 
                className="w-full py-3 pl-10 pr-4 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition text-sm font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                required
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

        {/* Кнопка сохранения */}
        <button 
          type="submit"
          disabled={isSaving}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white text-lg transition-all mt-4 mb-8 ${
            isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.98]'
          }`}
        >
          {isSaving ? 'Сохранение...' : 'Сохранить изменения'} 
          {!isSaving && <Save size={20} />}
        </button>

      </form>
    </div>
  );
}