'use client';

import React from 'react'
import AuditorsPage from './component/main';

export default function page() {
  return (
    <div className='min-h-screen bg-transparent'>
      <main className='max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6'>
        <AuditorsPage />
      </main>
    </div>
  )
}
