import React from 'react'
import { navItems } from '@/constant'
import Logo from '@/app/assets/logo/Logo.jpg'
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  return (
    <div className='flex justify-between items-center px-8 py-4'>
      {/* Logo */}
      <div className='flex items-center'>
        <Image 
          src={Logo} 
          alt="LASU Fleet Manager Logo"
          width={50}
          height={50}
          className='rounded-full drop-shadow-4xl mr-4'
        />
        <span className='text-2xl text-white font-bold'>LASU Fleet</span>
      </div>
      
      {/* Navigation Links */}
      <nav className='flex items-center space-x-1 border-white bg-sky-50/10 backdrop-blur-lg border-2 p-2 rounded-full'>
        {navItems.map((item, index) => (
          <a 
            key={index} 
            href={item.href} 
            className="px-6 py-2 text-white-900 transition-colors duration-200"
          >
            {item.title}
          </a>
        ))}
        <Link href="/login">
          <button className='bg-sky-600 border-sky-900/40 border hover:bg-sky-700 px-6 py-2 rounded-full text-white ml-2 transition-colors duration-200'>
            Login
          </button>
        </Link>
      </nav>
    </div>
  )
}