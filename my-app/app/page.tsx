"use client";

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Smartphone, Zap, MapPin, MessageSquare, TrendingUp, Star, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState<Set<string>>(new Set());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setVisible(prev => new Set([...prev, e.target.id]));
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isVisible = (id: string) => visible.has(id);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden" style={{ fontFamily: "'Georgia', serif" }}>

      {/* Sticky Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 py-4' : 'py-7'}`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-black tracking-tighter" style={{ fontFamily: "'Georgia', serif" }}>
            <span className="text-white">My</span><span className="text-blue-400">Ville</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <a href="#about" className="hover:text-white transition-colors">О проекте</a>
            <a href="#how" className="hover:text-white transition-colors">Как работает</a>
            <a href="#reviews" className="hover:text-white transition-colors">Отзывы</a>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="px-5 py-2 text-sm font-semibold text-white/70 hover:text-white transition-colors">
              Войти
            </Link>
            <Link href="/login" className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-all shadow-lg shadow-blue-600/25">
              Начать
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-indigo-600/8 rounded-full blur-[80px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-10" style={{ fontFamily: 'system-ui, sans-serif' }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Версия 1.0 — уже доступна горожанам
          </div>

          <h1 className="text-5xl md:text-8xl font-black leading-[0.95] tracking-tight mb-8">
            <span className="block text-white">Сделаем</span>
            <span className="block text-white">наш город</span>
            <span className="block bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent">
              лучше вместе
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/40 mb-12 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'system-ui, sans-serif' }}>
            Платформа для городских обращений. Сообщайте о проблемах, голосуйте за важные заявки, следите за их решением в реальном времени.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="group px-8 py-4 text-base font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-2" style={{ fontFamily: 'system-ui, sans-serif' }}>
              Сообщить о проблеме
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/feed" className="px-8 py-4 text-base font-semibold text-white/70 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all flex items-center justify-center" style={{ fontFamily: 'system-ui, sans-serif' }}>
              Открыть ленту города
            </Link>
          </div>
        </div>

        <a href="#about" className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20 hover:text-white/50 transition-colors animate-bounce">
          <ChevronDown size={28} />
        </a>
      </section>

      {/* Stats */}
      <section id="about" className="py-20 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { num: '2 000+', label: 'Жителей уже с нами' },
            { num: '450+', label: 'Проблем решено' },
            { num: '12', label: 'Районов охвачено' },
            { num: '94%', label: 'Довольных жителей' },
          ].map((s, i) => (
            <div
              key={i}
              id={`stat-${i}`}
              data-animate
              className="text-center transition-all duration-700"
              style={{
                opacity: isVisible(`stat-${i}`) ? 1 : 0,
                transform: isVisible(`stat-${i}`) ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${i * 100}ms`
              }}
            >
              <div className="text-4xl md:text-5xl font-black text-white mb-2">{s.num}</div>
              <div className="text-sm text-white/40" style={{ fontFamily: 'system-ui, sans-serif' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div
            id="problem"
            data-animate
            className="mb-20 transition-all duration-700"
            style={{ opacity: isVisible('problem') ? 1 : 0, transform: isVisible('problem') ? 'translateY(0)' : 'translateY(40px)' }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold mb-6 tracking-widest uppercase" style={{ fontFamily: 'system-ui, sans-serif' }}>
              🔴 Проблема
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white/90 max-w-3xl leading-tight mb-6">
              Горожане не знают, куда сообщать о проблемах
            </h2>
            <p className="text-lg text-white/40 max-w-2xl leading-relaxed" style={{ fontFamily: 'system-ui, sans-serif' }}>
              Дороги, освещение, мусор, ЖКХ — каждая проблема требует отдельного звонка, поиска нужного ведомства, ожидания. Большинство жалоб просто теряются.
            </p>
          </div>

          <div
            id="solution"
            data-animate
            className="transition-all duration-700"
            style={{ opacity: isVisible('solution') ? 1 : 0, transform: isVisible('solution') ? 'translateY(0)' : 'translateY(40px)' }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6 tracking-widest uppercase" style={{ fontFamily: 'system-ui, sans-serif' }}>
              🎯 Задача
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white/90 max-w-3xl leading-tight mb-6">
              Создать MVP городского приложения для обращений жителей
            </h2>
            <p className="text-lg text-white/40 max-w-2xl leading-relaxed" style={{ fontFamily: 'system-ui, sans-serif' }}>
              Одна платформа — для всех городских проблем. Пишите, фотографируйте, ставьте геометку. Мы позаботимся об остальном.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-32 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div
            id="how-title"
            data-animate
            className="text-center mb-20 transition-all duration-700"
            style={{ opacity: isVisible('how-title') ? 1 : 0, transform: isVisible('how-title') ? 'translateY(0)' : 'translateY(30px)' }}
          >
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4" style={{ fontFamily: 'system-ui, sans-serif' }}>Как это работает</p>
            <h2 className="text-4xl md:text-6xl font-black text-white">Три простых шага</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Smartphone size={28} />, num: '01', title: 'Сфотографируйте', desc: 'Нашли яму, сломан фонарь или горы мусора? Откройте приложение и сделайте фото прямо на месте.' },
              { icon: <MapPin size={28} />, num: '02', title: 'Добавьте геометку', desc: 'Нажмите GPS — координаты определятся автоматически. Заявка попадёт точно в нужный район.' },
              { icon: <TrendingUp size={28} />, num: '03', title: 'Следите за статусом', desc: 'Ваша заявка появится на карте города. Другие жители могут проголосовать за неё, чтобы ускорить решение.' },
            ].map((step, i) => (
              <div
                key={i}
                id={`step-${i}`}
                data-animate
                className="relative p-8 rounded-3xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-500"
                style={{
                  opacity: isVisible(`step-${i}`) ? 1 : 0,
                  transform: isVisible(`step-${i}`) ? 'translateY(0)' : 'translateY(40px)',
                  transitionDelay: `${i * 150}ms`
                }}
              >
                <div className="absolute top-6 right-6 text-6xl font-black text-white/5">{step.num}</div>
                <div className="w-14 h-14 rounded-2xl bg-blue-600/15 text-blue-400 flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-white/40 leading-relaxed text-sm" style={{ fontFamily: 'system-ui, sans-serif' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div
            id="feat-title"
            data-animate
            className="text-center mb-20 transition-all duration-700"
            style={{ opacity: isVisible('feat-title') ? 1 : 0, transform: isVisible('feat-title') ? 'translateY(0)' : 'translateY(30px)' }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4">Всё необходимое</h2>
            <p className="text-white/40 text-lg" style={{ fontFamily: 'system-ui, sans-serif' }}>в одном приложении</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <MessageSquare size={22} />, color: 'blue', title: 'Комментарии', desc: 'Обсуждайте проблемы с соседями. Добавляйте важные детали.' },
              { icon: <TrendingUp size={22} />, color: 'emerald', title: 'Голосование', desc: 'Голосуйте за острые проблемы. Самые важные решаются первыми.' },
              { icon: <MapPin size={22} />, color: 'orange', title: 'Карта города', desc: 'Все заявки на интерактивной карте. Видите что происходит рядом.' },
              { icon: <Zap size={22} />, color: 'yellow', title: 'AI-категории', desc: 'Нейросеть автоматически определяет тип проблемы по тексту и фото.' },
              { icon: <ShieldCheck size={22} />, color: 'purple', title: 'Статусы', desc: 'Новая → В работе → Решено. Прозрачность на каждом этапе.' },
              { icon: <Star size={22} />, color: 'pink', title: 'Лента города', desc: 'Городская лента с фильтрами по категориям, районам и статусам.' },
            ].map((f, i) => {
              const colors: Record<string, string> = {
                blue: 'bg-blue-500/10 text-blue-400',
                emerald: 'bg-emerald-500/10 text-emerald-400',
                orange: 'bg-orange-500/10 text-orange-400',
                yellow: 'bg-yellow-500/10 text-yellow-400',
                purple: 'bg-purple-500/10 text-purple-400',
                pink: 'bg-pink-500/10 text-pink-400',
              };
              return (
                <div
                  key={i}
                  id={`feat-${i}`}
                  data-animate
                  className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:border-white/15 transition-all duration-300"
                  style={{
                    opacity: isVisible(`feat-${i}`) ? 1 : 0,
                    transform: isVisible(`feat-${i}`) ? 'translateY(0)' : 'translateY(30px)',
                    transitionDelay: `${i * 80}ms`
                  }}
                >
                  <div className={`w-10 h-10 rounded-xl ${colors[f.color]} flex items-center justify-center mb-4`}>
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed" style={{ fontFamily: 'system-ui, sans-serif' }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote banner */}
      <section className="py-24 px-6 bg-blue-600/5 border-y border-blue-500/10">
        <div
          id="quote"
          data-animate
          className="max-w-4xl mx-auto text-center transition-all duration-1000"
          style={{ opacity: isVisible('quote') ? 1 : 0, transform: isVisible('quote') ? 'scale(1)' : 'scale(0.97)' }}
        >
          <div className="text-6xl text-blue-400/30 font-black mb-6">"</div>
          <blockquote className="text-3xl md:text-5xl font-black text-white leading-tight mb-8">
            Город — это мы. И только мы можем сделать его лучше
          </blockquote>
          <p className="text-white/30 text-sm" style={{ fontFamily: 'system-ui, sans-serif' }}>— Команда MyVille</p>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div
            id="reviews-title"
            data-animate
            className="text-center mb-16 transition-all duration-700"
            style={{ opacity: isVisible('reviews-title') ? 1 : 0, transform: isVisible('reviews-title') ? 'translateY(0)' : 'translateY(30px)' }}
          >
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4" style={{ fontFamily: 'system-ui, sans-serif' }}>Отзывы</p>
            <h2 className="text-4xl md:text-5xl font-black text-white">Что говорят жители</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Алия М.', role: 'Жительница мкр. Береке', text: 'Наконец-то могу сообщить о яме во дворе без лишней беготни. Через 3 дня уже заделали!', stars: 5 },
              { name: 'Данияр К.', role: 'Активист, район Северный', text: 'Отличная идея. Теперь вижу все проблемы района на одной карте. Голосую за самые важные.', stars: 5 },
              { name: 'Светлана Р.', role: 'Пенсионерка', text: 'Очень просто. Сфотографировала сломанный фонарь, написала заявку — через неделю починили!', stars: 5 },
              { name: 'Олжас Н.', role: 'Предприниматель', text: 'Наконец городские проблемы стали видны. Прозрачность — это главное что нужно было.', stars: 5 },
              { name: 'Марина Б.', role: 'Учительница', text: 'Показала детям как работает гражданская ответственность. Они сами отправили заявку!', stars: 5 },
              { name: 'Ерлан С.', role: 'IT-специалист', text: 'Хорошая реализация. Карта работает быстро, интерфейс понятный. Жду новых функций.', stars: 4 },
            ].map((r, i) => (
              <div
                key={i}
                id={`review-${i}`}
                data-animate
                className="p-6 rounded-2xl border border-white/8 bg-white/[0.03] transition-all duration-500"
                style={{
                  opacity: isVisible(`review-${i}`) ? 1 : 0,
                  transform: isVisible(`review-${i}`) ? 'translateY(0)' : 'translateY(30px)',
                  transitionDelay: `${i * 100}ms`
                }}
              >
                <div className="flex gap-1 mb-4">
                  {Array(r.stars).fill(0).map((_, j) => (
                    <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                  {Array(5 - r.stars).fill(0).map((_, j) => (
                    <Star key={j} size={14} className="text-white/10" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-5" style={{ fontFamily: 'system-ui, sans-serif' }}>"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{r.name}</p>
                    <p className="text-xs text-white/30" style={{ fontFamily: 'system-ui, sans-serif' }}>{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div
          id="cta"
          data-animate
          className="max-w-3xl mx-auto text-center transition-all duration-1000"
          style={{ opacity: isVisible('cta') ? 1 : 0, transform: isVisible('cta') ? 'translateY(0)' : 'translateY(40px)' }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600/10 rounded-3xl blur-3xl" />
            <div className="relative border border-white/10 rounded-3xl p-16 bg-white/[0.02]">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                Ваш город ждёт<br />вашего голоса
              </h2>
              <p className="text-white/40 text-lg mb-10" style={{ fontFamily: 'system-ui, sans-serif' }}>
                Присоединяйтесь к тысячам жителей, которые уже делают город лучше
              </p>
              <Link href="/login" className="group inline-flex items-center gap-2 px-10 py-5 text-base font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-all shadow-2xl shadow-blue-600/30" style={{ fontFamily: 'system-ui, sans-serif' }}>
                Начать бесплатно
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xl font-black tracking-tighter">
            <span className="text-white">My</span><span className="text-blue-400">Ville</span>
          </div>
          <p className="text-white/20 text-sm" style={{ fontFamily: 'system-ui, sans-serif' }}>
            © 2026 MyVille. Сделано с ❤️ для горожан
          </p>
          <div className="flex gap-6 text-sm text-white/30" style={{ fontFamily: 'system-ui, sans-serif' }}>
            <Link href="/feed" className="hover:text-white transition-colors">Лента</Link>
            <Link href="/map" className="hover:text-white transition-colors">Карта</Link>
            <Link href="/login" className="hover:text-white transition-colors">Войти</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
