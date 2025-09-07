import React from 'react'
// import problems from '@/app/assets/images/problems.jpeg'
// import Image from 'next/image'

export default function ProblemsPage() {
  return (
    <div className='min-h-screen bg-sky-50'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-12 pl-12'>
            <div className='max-w-2xl'>
              <h1 className='text-5xl md:text-6xl lg:text-8xl font-bold mb-4 text-sky-950'>  
                Problems
              </h1>     
              <p className='text-gray-800 text-lg'>
              Keep your fleet running smoothly with LASU Fleet Manager — manage maintenance, repairs, and operations for vehicles, drivers, fuel, and equipment all in one place, while turning your data into insights that keep things moving
              </p>
            </div>
          </div>
    </div>
  )
}
