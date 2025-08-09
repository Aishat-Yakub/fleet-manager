import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import notification from '@/app/assets/images/notification.png'

export default function AdSidebar() {
  return (
    <div className="w-80 h-full bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100 rounded-lg p-6 flex flex-col justify-between">
      <div className="mb-6">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium mb-4">Special Offer</span>
        <h1 className='text-2xl md:text-3xl font-bold text-sky-950 mb-3 leading-tight'>Upgrade Your Fleet Management</h1>
        <p className='text-slate-600 text-sm mb-6'>Experience the next level of vehicle maintenance with our premium features</p>
        
        <ul className='space-y-2 mb-4'>
          <li className='flex items-center text-sm text-slate-700'>
            <span className='text-green-500 mr-2'>✓</span> Real-time vehicle tracking
          </li>
          <li className='flex items-center text-sm text-slate-700'>
            <span className='text-green-500 mr-2'>✓</span> Automated maintenance alerts
          </li>
          <li className='flex items-center text-sm text-slate-700'>
            <span className='text-green-500 mr-2'>✓</span> 24/7 Support
          </li>
        </ul>
      </div>
      
      <div className='text-center'>
        <div className='mb-4'>
          <Image
            src={notification}
            alt="Vehicle Maintenance"
            width={200}
            height={200}
            className="h-64 w-64 rounded-full mx-auto"
          />
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          Learn More <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
    </div>
      <p className="text-xs text-center text-slate-500 mt-4">No credit card required • Cancel anytime</p>
    </div>
  );
}