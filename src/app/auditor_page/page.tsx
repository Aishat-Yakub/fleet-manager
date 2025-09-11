'use client';

import React from 'react'
import AuditorsPage from './component/main';
import Image from 'next/image';
import Logo from '@/app/assets/logo/Logo.jpg'
import NotificationSidebar from './component/notification';

export default function page() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white border border-b-black/10 sticky top-0 z-10'>
        <div className='max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-2 md:space-x-4'>
              <div className='flex-shrink-0'>
                <Image
                  src={Logo}
                  alt="Fleet Manager Logo"
                  width={50}
                  height={50}
                  className='h-10 w-10 md:h-12 md:w-12 rounded-full object-cover'
                />
              </div>
              <h1 className='text-lg sm:text-xl font-bold text-gray-900 whitespace-nowrap'>
                FLEET MANAGER
              </h1>
            </div>
            <div className='ml-4 flex items-center'>
              <NotificationSidebar />
            </div>
          </div>
        </div>
      </header>
      <main className='max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6'>
        <AuditorsPage />
      </main>
    </div>
  )
}
