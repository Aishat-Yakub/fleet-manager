'use client';

import { navItems } from '@/constant';
import Link from 'next/link';


type MobileNavProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {


  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu Panel */}
      <div className="fixed right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl p-6">
        {/* Close Button */}
        <div className="flex justify-end mb-8">
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Navigation Links */}
        <nav className="space-y-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block px-6 py-3 text-sky-950 hover:bg-sky-100 hover:text-sky-600 font-bold rounded-full transition-colors duration-200"
              onClick={onClose}
            >
              {item.title}
            </a>
          ))}
          
          <Link
            href="/login"
            className="block bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-full text-center transition-colors duration-200"
            onClick={onClose}
          >
            Login
          </Link>
        </nav>
      </div>
    </div>
  );
}
