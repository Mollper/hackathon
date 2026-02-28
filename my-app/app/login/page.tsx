"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, UserPlus, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

type Screen = 'login' | 'register' | 'check-email';

export default function LoginPage() {
  const [screen, setScreen] = useState<Screen>('login');
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      if (error.includes('Invalid login')) setError('Неверный email или пароль');
      else if (error.includes('Email not confirmed')) setError('Сначала подтвердите email — проверьте почту');
      else setError(error);
    } else {
      router.push('/feed');
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) { setError('Пароль минимум 6 символов'); return; }
    if (!fullName.trim()) { setError('Введите имя'); return; }
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    if (error) {
      if (error.includes('already registered')) setError('Этот email уже зарегистрирован');
      else setError(error);
    } else {
      setScreen('check-email');
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (!error) setResendSuccess(true);
    setResendLoading(false);
  };

  if (screen === 'check-email') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        {/* Кнопка назад */}
        <Link href="/" className="fixed top-6 left-6 flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">На главную</span>
        </Link>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={32} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Проверьте почту</h1>
          <p className="text-gray-500 text-sm mb-2">Мы отправили письмо на</p>
          <p className="font-bold text-blue-600 mb-6">{email}</p>
          <p className="text-gray-400 text-xs mb-8 leading-relaxed">
            Нажмите на ссылку в письме чтобы подтвердить аккаунт. Если письма нет — проверьте папку «Спам».
          </p>

          {resendSuccess ? (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-2xl mb-4">
              ✅ Письмо отправлено повторно
            </div>
          ) : (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="w-full py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 disabled:opacity-50 transition mb-4"
            >
              {resendLoading ? 'Отправка...' : '📨 Отправить письмо повторно'}
            </button>
          )}

          <button
            onClick={() => setScreen('login')}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition mx-auto"
          >
            <ArrowLeft size={14} /> Вернуться ко входу
          </button>
        </div>
      </div>
    );
  }

  const isLogin = screen === 'login';

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      {/* Кнопка назад на главную */}
      <Link href="/" className="fixed top-6 left-6 flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors group">
        <div className="w-9 h-9 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
          <ArrowLeft size={16} />
        </div>
        <span className="hidden sm:inline font-medium">На главную</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-blue-600 mb-2">MyVille</h1>
          <p className="text-gray-500 text-sm">
            {isLogin ? 'Войдите, чтобы делать город лучше' : 'Создайте аккаунт и присоединяйтесь'}
          </p>
        </div>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-2xl text-center">
            ❌ {error}
          </div>
        )}

        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Имя и Фамилия</label>
              <div className="flex rounded-2xl bg-gray-50 border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition p-1">
                <div className="pl-3 flex items-center text-gray-400"><User size={18} /></div>
                <input
                  required
                  type="text"
                  placeholder="Иван Иванов"
                  autoComplete="name"
                  className="flex-1 bg-transparent p-3 text-sm outline-none"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <div className="flex rounded-2xl bg-gray-50 border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition p-1">
              <div className="pl-3 flex items-center text-gray-400"><Mail size={18} /></div>
              <input
                required
                type="email"
                placeholder="example@mail.com"
                autoComplete="email"
                className="flex-1 bg-transparent p-3 text-sm outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Пароль</label>
            <div className="flex rounded-2xl bg-gray-50 border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition p-1">
              <div className="pl-3 flex items-center text-gray-400"><Lock size={18} /></div>
              <input
                required
                type="password"
                placeholder="••••••••"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                className="flex-1 bg-transparent p-3 text-sm outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {!isLogin && <p className="text-xs text-gray-400 mt-1 ml-1">Минимум 6 символов</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-md transition mt-2"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            ) : isLogin ? <><LogIn size={18} /> Войти</> : <><UserPlus size={18} /> Зарегистрироваться</>}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
          <button
            type="button"
            onClick={() => { setScreen(isLogin ? 'register' : 'login'); setError(null); }}
            className="text-blue-600 font-bold hover:underline"
          >
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </div>
      </div>
    </div>
  );
}
