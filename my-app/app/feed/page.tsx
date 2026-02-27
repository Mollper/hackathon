"use client";

import { useState } from 'react';
import { mockPosts } from '../data/mockPosts';

export default function FeedPage() {
  // Загружаем нашу "базу" в изменяемое состояние
  const [posts, setPosts] = useState(mockPosts);

  // Состояния для полей формы
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('ЖКХ');

  // Функция отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Останавливаем перезагрузку страницы

    if (!title || !description) return; // Проверка на пустые поля

    const newPost = {
      id: Date.now(), // Генерируем уникальный номер
      title: title,
      description: description,
      category: category,
      status: "Новая",
      author: "Текущий Пользователь", // В будущем здесь будет имя из профиля
      date: "28 Февраля 2026",
      // Ставим координаты где-то в центре Актобе для реалистичности
      lat: 50.2850 + (Math.random() * 0.01), 
      lng: 57.1600 + (Math.random() * 0.01),
    };

    // Добавляем новый пост в САМОЕ НАЧАЛО массива
    setPosts([newPost, ...posts]);

    // Очищаем форму после отправки
    setTitle('');
    setDescription('');
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-black mb-6 text-gray-800">Городская лента</h1>
      
      {/* --- ФОРМА СОЗДАНИЯ ПОСТА --- */}
      <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-blue-100 mb-8">
        <h2 className="text-xl font-bold mb-4">Сообщить о проблеме</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Краткий заголовок (например: Яма во дворе)" 
            className="border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          
          <textarea 
            placeholder="Опишите проблему подробнее..." 
            className="border border-gray-200 rounded-xl p-3 h-24 outline-none focus:border-blue-500 transition resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="flex justify-between items-center">
            <select 
              className="border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="ЖКХ">ЖКХ</option>
              <option value="Дороги">Дороги</option>
              <option value="Освещение">Освещение</option>
              <option value="Экология">Экология</option>
            </select>

            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition"
            >
              Отправить заявку
            </button>
          </div>
        </form>
      </div>

      {/* --- ЛЕНТА ПОСТОВ --- */}
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">
                  {post.category}
                </span>
                <h3 className="text-xl font-bold mt-2 text-gray-900">{post.title}</h3>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                post.status === 'Решено' ? 'bg-green-100 text-green-700' : 
                post.status === 'В работе' ? 'bg-yellow-100 text-yellow-700' : 
                'bg-red-100 text-red-700'
              }`}>
                {post.status}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{post.description}</p>
            
            <div className="flex justify-between items-center text-sm text-gray-400 border-t pt-4 mt-2">
              <span>Автор: {post.author}</span>
              <span>{post.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}