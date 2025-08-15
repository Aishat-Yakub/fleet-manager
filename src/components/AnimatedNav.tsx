"use client";

import { useEffect, useRef } from 'react';
import { navItems } from '@/constant';
import Link from 'next/link';
import { gsap } from 'gsap';

type AnimatedNavProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AnimatedNav({ isOpen, onClose }: AnimatedNavProps) {

  const overlayRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Show overlay
      gsap.to(overlayRef.current, {
        opacity: 1,
        display: 'block',
        duration: 0.3,
        ease: 'power2.inOut'
      });

      // Slide in menu
      gsap.fromTo(menuRef.current,
        { x: '100%' },
        {
          x: '0%',
          duration: 0.4,
          ease: 'power3.out'
        }
      );

      // Stagger menu items
      const menuItems = menuRef.current?.querySelectorAll('a');
      if (menuItems && menuItems.length > 0) {
        gsap.fromTo(
          menuItems,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.3,
            delay: 0.2,
            ease: 'back.out(1.7)'
          }
        );
      }
    } else {
      // Slide out menu
      gsap.to(menuRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => {
          // Hide overlay after menu slides out
          if (overlayRef.current) {
            gsap.to(overlayRef.current, {
              opacity: 0,
              display: 'none',
              duration: 0.2
            });
          }
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="lg:hidden">
      {/* Overlay */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-40 opacity-0 hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu Panel */}
      <div 
        ref={menuRef}
        className="fixed right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl p-6 z-50"
      >
        {/* Close Button */}
        <div className="flex justify-end mb-8">
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
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
