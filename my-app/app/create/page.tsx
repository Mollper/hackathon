import { Camera, MapPin, Send } from 'lucide-react';

export default function CreatePost() {
  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Новое обращение</h1>
      
      <form className="space-y-6 bg-white p-5 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        
        {/* Зона загрузки фото */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Фото проблемы</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer bg-gray-50 group">
            <div className="space-y-2 text-center">
              <Camera className="mx-auto h-10 w-10 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <div className="flex text-sm text-gray-600 justify-center">
                <span className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 hover:text-blue-700">
                  Загрузить файл
                </span>
                <p className="pl-1">или сделайте снимок</p>
              </div>
              <p className="text-xs text-gray-500">JPG, PNG до 10MB</p>
            </div>
          </div>
        </div>

        {/* Поле описания */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
            Описание
          </label>
          <textarea
            id="description"
            rows={4}
            className="block w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
            placeholder="Что именно произошло? Опишите детали..."
          />
        </div>

        {/* Поле геолокации */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Адрес</label>
          <div className="flex rounded-2xl shadow-sm overflow-hidden border border-gray-200 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all">
            <button type="button" className="flex items-center justify-center px-4 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors border-r border-gray-200">
              <MapPin size={20} />
            </button>
            <input
              type="text"
              className="flex-1 block w-full bg-gray-50 p-4 text-sm focus:bg-white outline-none"
              placeholder="Определить автоматически или ввести адрес"
            />
          </div>
        </div>

        {/* Кнопка отправки */}
        <button
          type="button"
          className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all active:scale-[0.98]"
        >
          <Send size={18} />
          Отправить заявку
        </button>
      </form>
    </div>
  );
}