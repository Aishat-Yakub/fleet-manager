import React from 'react'
import { navItems } from '@/constant'
import Logo from '@/app/assets/logo/Logo.jpg'
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  return (
    <div className='flex justify-between items-center px-8 py-4'>
      {/* Logo */}
      <div className='flex items-center pl-6 md:pl-12'>
        <Image
          src={Logo} 
          alt="LASU Fleet Manager Logo"
          width={60}
          height={60}
          className='rounded-full drop-shadow-4xl mr-4 w-12 h-12 md:w-14 md:h-14'
        />
        <span className='text-lg md:text-xl text-sky-950 font-bold'>LASU Fleet Manager</span>
      </div>
      
      {/* Navigation Links */}
      <nav className='flex items-center border-sky-800 bg-sky-50/10 backdrop-blur-lg border-2 p-2 rounded-full'>
        {navItems.map((item, index) => (
          <a 
            key={index} 
            href={item.href} 
            className="px-6 py-2 text-sky-950 hover:bg-sky-100 hover:text-sky-600 font-bold rounded-full transition-colors duration-200"
          >
            {item.title}
          </a>
        ))}
        <Link href="/login">
          <button className='bg-sky-600 border-sky-600/40 border hover:bg-sky-700 px-6 py-2 font-bold rounded-full text-white ml-2 transition-colors duration-200'>
            Login
          </button>
        </Link>
      </nav>
    </div>
  )
}