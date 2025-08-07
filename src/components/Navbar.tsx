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
          className='rounded-full mr-4'
        />
        <span className='text-xl font-bold'>LASU Fleet</span>
      </div>
      
      {/* Navigation Links */}
      <nav className='flex items-center space-x-2 bg-white/10 p-2 rounded-full'>
        {navItems.map((item, index) => (
          <a 
            key={index} 
            href={item.href} 
            className="px-6 py-2 hover:bg-black/20 hover:rounded-full hover:text-white transition-colors duration-200"
          >
            {item.title}
          </a>
        ))}
        <Link href="/login">
          <button className='bg-black/50 hover:bg-black/70 px-6 py-2 rounded-full text-white ml-2 transition-colors duration-200'>
            Login
          </button>
        </Link>
      </nav>
    </div>
  )
}