import Image from 'next/link'; // или обычный <img> для прототипа

export default function HomeFeed() {
  // Временные данные для прототипа
  const posts = [
    {
      id: 1,
      author: 'Айдос Н.',
      category: 'Дороги',
      status: 'В работе',
      statusColor: 'bg-yellow-100 text-yellow-700',
      description: 'Глубокая яма на перекрестке Абая - Пушкина. Машины пробивают колеса.',
      time: '2 часа назад',
      location: 'ул. Абая, 45',
    },
    {
      id: 2,
      author: 'Елена В.',
      category: 'Освещение',
      status: 'Решено',
      statusColor: 'bg-green-100 text-green-700',
      description: 'Не горят фонари во дворе уже неделю. Очень темно возвращаться домой.',
      time: 'Вчера',
      location: 'мкр. Береке, 12',
    }
  ];

  return (
    <div className="p-4 md:p-8">
      <header className="mb-6 md:hidden">
        <h1 className="text-2xl font-bold text-gray-800">Лента города</h1>
      </header>

      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Шапка поста */}
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {post.author[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{post.author}</h3>
                  <p className="text-xs text-gray-500">{post.time} • {post.location}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${post.statusColor}`}>
                {post.status}
              </span>
            </div>

            {/* Заглушка для фото (в реальности тут будет тег img или Image из Next.js) */}
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
              [Фото проблемы]
            </div>

            {/* Описание */}
            <div className="p-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{post.category}</span>
              <p className="mt-2 text-gray-800 text-sm">{post.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}