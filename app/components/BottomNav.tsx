// Файл: app/components/BottomNav.tsx
"use client";

import Link from 'next/link';
import { Home, Map as MapIcon, PlusSquare, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 pb-safe z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        <Link href="/feed" className={`flex flex-col items-center w-full h-full justify-center ${pathname === '/feed' ? 'text-blue-600' : 'text-gray-400'}`}>
          <Home size={24} />
          <span className="text-[10px] mt-1 font-medium">Лента</span>
        </Link>
        
        <Link href="/map" className={`flex flex-col items-center w-full h-full justify-center ${pathname === '/map' ? 'text-blue-600' : 'text-gray-400'}`}>
          <MapIcon size={24} />
          <span className="text-[10px] mt-1 font-medium">Карта</span>
        </Link>

        {/* Та самая иконка для создания поста */}
        <Link href="/create" className="flex flex-col items-center justify-center -mt-6">
          <div className="bg-blue-600 text-white p-3 rounded-full shadow-lg border-4 border-white">
            <PlusSquare size={28} />
          </div>
        </Link>

        <Link href="/profile" className={`flex flex-col items-center w-full h-full justify-center ${pathname === '/profile' ? 'text-blue-600' : 'text-gray-400'}`}>
          <User size={24} />
          <span className="text-[10px] mt-1 font-medium">Профиль</span>
        </Link>
      </div>
    </div>
  );
}