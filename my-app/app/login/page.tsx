"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, UserPlus, User } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Импортируем наш клиент базы

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Состояние для имени
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  // Основная функция обработки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      // --- ЛОГИКА ВХОДА ---
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert("Ошибка входа: " + error.message);
      } else {
        router.push('/feed');
      }
    } else {
      // --- ЛОГИКА РЕГИСТРАЦИИ ---
      // 1. Создаем пользователя в Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        alert("Ошибка регистрации: " + authError.message);
      } else if (data.user) {
        // 2. Если Auth прошел, записываем имя в нашу таблицу users
        const { error: dbError } = await supabase
          .from('users')
          .insert([{ 
            id: data.user.id, 
            email, 
            full_name: fullName,
            role: 'citizen' 
          }]);

        if (dbError) {
          alert("Ошибка БД: " + dbError.message);
        } else {
          alert("Аккаунт создан! Теперь войдите.");
          setIsLogin(true); // Переключаем на вход
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-blue-600 mb-2">MyVille</h1>
          <p className="text-gray-500 text-sm">
            {isLogin ? 'Войдите, чтобы делать город лучше' : 'Создайте аккаунт и присоединяйтесь'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Поле "Имя" показывается ТОЛЬКО при регистрации */}
          {!isLogin && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Имя и Фамилия</label>
              <div className="flex rounded-2xl bg-gray-50 border border-gray-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all p-1">
                <div className="pl-3 flex items-center text-gray-400"><User size={18} /></div>
                <input 
                  required 
                  type="text" 
                  placeholder="Иван Иванов" 
                  className="flex-1 bg-transparent p-3 text-sm outline-none"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <div className="flex rounded-2xl bg-gray-50 border border-gray-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all p-1">
              <div className="pl-3 flex items-center text-gray-400"><Mail size={18} /></div>
              <input 
                required 
                type="email" 
                placeholder="example@mail.com" 
                className="flex-1 bg-transparent p-3 text-sm outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Пароль</label>
            <div className="flex rounded-2xl bg-gray-50 border border-gray-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all p-1">
              <div className="pl-3 flex items-center text-gray-400"><Lock size={18} /></div>
              <input 
                required 
                type="password" 
                placeholder="••••••••" 
                className="flex-1 bg-transparent p-3 text-sm outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all active:scale-[0.98] mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Загрузка...' : (
              <>
                {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                {isLogin ? 'Войти' : 'Зарегистрироваться'}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-blue-600 font-bold hover:underline"
          >
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </div>
      </div>
    </div>
  );
}