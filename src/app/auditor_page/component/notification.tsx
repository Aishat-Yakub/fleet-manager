import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import notification from '@/app/assets/images/notification.png';

export default function NotificationSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Close notifications"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-sky-50 to-blue-50">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium mb-2">
              Special Offer
            </span>
            <h4 className="text-lg font-bold text-sky-950 mb-2">Upgrade Your Fleet Management</h4>
            <p className='text-slate-600 text-sm mb-4'>Experience the next level of vehicle maintenance</p>
            
            <div className="mb-4">
              <Image
                src={notification}
                alt="Vehicle Maintenance"
                width={160}
                height={160}
                className="h-40 w-40 rounded-full mx-auto my-2"
                priority
              />
            </div>
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs text-center text-slate-500 mt-2">No credit card required • Cancel anytime</p>
          </div>
        </div>
      )}
    </div>
  );
}