import React from 'react'
import Navbar from './Navbar'

export default function Homepage() {
  return (
    <div className='min-h-screen'>
      <Navbar/>

      {/* content */}
      <div className='container mx-auto px-8 py-12'>
        <div className='max-w-2xl'>
          <h1 className='text-5xl md:text-5xl lg:text-7xl font-bold mb-4'>One platform <br />
          Total fleet control.</h1>
          <p className='text-white/50 text-lg'>A fleet management system for LASU</p>
        </div>
      </div>
    </div>
  )
}
