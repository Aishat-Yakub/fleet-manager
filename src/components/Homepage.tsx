import React from 'react';
import Navbar from './Navbar';
import Image from 'next/image';
import homeImage from '../app/assets/images/home.png';

export default function Homepage() {
  return (
    <div className='min-h-screen bg-sky-50'>
      <Navbar/>
        {/* content */}
        <div className='container mx-auto px-8 py-12'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-12'>
            <div className='max-w-2xl'>
              <h1 className='text-5xl md:text-6xl lg:text-8xl font-bold mb-4 text-sky-950'>One platform 
                <span className='text-sky-600 text-4xl lg:text-8xl block'>
                    Total fleet control. 
                </span>
              </h1>     
              <p className='text-gray-800 text-lg'>
              Keep your fleet running smoothly with LASU Fleet Manager — manage maintenance, repairs, and operations for vehicles, drivers, fuel, and equipment all in one place, while turning your data into insights that keep things moving
              </p>
            </div>
            {/* image */}
            <div className='w-full md:w-1/2 lg:w-[45%] xl:w-1/2'>
              <div className='relative w-full h-[400px] md:h-[500px] lg:h-[600px]'>
                <Image 
                  src={homeImage} 
                  alt='Fleet management dashboard' 
                  className='rounded-lg object-contain'
                  fill
                  priority
                />
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
