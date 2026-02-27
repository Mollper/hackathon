import Link from 'next/link';
import { ArrowRight, ShieldCheck, Smartphone, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-200">
      
      {/* Навигация лендинга */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-2xl font-black text-blue-600 tracking-tighter">MyVille</div>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
            Войти
          </Link>
          <Link href="/login" className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg shadow-blue-500/30 transition-all active:scale-95">
            Присоединиться
          </Link>
        </div>
      </nav>

      {/* Главный экран */}
      <header className="max-w-6xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-8 border border-blue-100">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
          Версия 1.0 уже доступна
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6 max-w-4xl">
          Сделаем наш город <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
            лучше вместе
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed">
          Единое приложение горожанина. Сообщайте о проблемах ЖКХ, дорог и освещения в один клик. ИИ автоматически направит заявку в нужный отдел.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Обе кнопки теперь ведут на логин */}
          <Link href="/login" className="px-8 py-4 text-base font-bold text-white bg-gray-900 hover:bg-gray-800 rounded-full shadow-xl transition-all flex items-center justify-center gap-2 group">
            Сообщить о проблеме
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/login" className="px-8 py-4 text-base font-bold text-gray-900 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 rounded-full transition-all flex items-center justify-center">
            Открыть ленту города
          </Link>
        </div>
      </header>

      {/* Блок преимуществ */}
      <section className="bg-gray-50 py-24 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><Smartphone size={28} /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Всё в одном месте</h3>
            <p className="text-gray-500 leading-relaxed">Не нужно искать номера инстанций. Одно приложение для всех проблем.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6"><Zap size={28} /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Модерация</h3>
            <p className="text-gray-500 leading-relaxed">Нейросеть автоматически определяет категорию проблемы по тексту и фото.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6"><ShieldCheck size={28} /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Прозрачный статус</h3>
            <p className="text-gray-500 leading-relaxed">Отслеживайте статус решения вашей проблемы в реальном времени.</p>
          </div>
        </div>
      </section>
    </div>
  );
}