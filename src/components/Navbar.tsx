'use client';

import React, { useState } from 'react';
import { navItems } from '@/constant';
import Logo from '@/app/assets/logo/Logo.jpg';
import Image from 'next/image';
import Link from 'next/link';
import MobileNav from './MobileNav';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <div className='flex justify-between items-center px-4 md:px-8 py-4'>
        {/* Logo */}
        <div className='flex items-center'>
          <Image
            src={Logo} 
            alt="LASU Fleet Manager Logo"
            width={60}
            height={60}
            className='rounded-full drop-shadow-4xl mr-3 md:mr-4 w-10 h-10 md:w-12 md:h-12'
            priority
          />
          <span className='text-lg md:text-xl text-sky-950 font-bold whitespace-nowrap'>
            LASU Fleet Manager
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className='hidden lg:flex items-center border-sky-800 bg-sky-50/10 backdrop-blur-lg border-2 p-1.5 rounded-full'>
          {navItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.href} 
              className="px-4 py-1.5 md:px-6 md:py-2 text-sm md:text-base text-sky-950 hover:bg-sky-100 hover:text-sky-600 font-bold rounded-full transition-colors duration-200"
            >
              {item.title}
            </Link>
          ))}
          <Link href="/login" className="ml-1 md:ml-2">
            <button className='bg-sky-600 border-sky-600/40 border hover:bg-sky-700 px-4 py-1.5 md:px-6 md:py-2 text-sm md:text-base font-bold rounded-full text-white transition-colors duration-200 whitespace-nowrap'>
              Login
            </button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 text-sky-950 hover:bg-sky-100 rounded-full transition-colors duration-200"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}