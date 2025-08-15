'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import home from '@/app/assets/images/home.png'
import logo from '@/app/assets/logo/Logo.jpg'

export default function LoginPage() {
  return (
    <>
      {/* Left side - Login Form */}
      <div className="relative flex items-center justify-center p-8 bg-sky-50/10 min-h-screen">
        {/* Logo and text positioned at top-left */}
        <div className="absolute top-8 left-8 right-8 md:pl-20 pr-4 pt-4 flex items-center justify-between gap-4">
          {/* Logo + Title */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-20 md:h-20 flex-shrink-0">
              <div className="w-full h-full relative rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                <Image
                  src={logo}
                  alt="LASU Logo"
                  fill
                  className="object-cover"
                  priority  
                />
              </div>
            </div>
            <span className='text-xl text-white font-bold whitespace-nowrap'>
              LASU Fleet <br /> Manager
            </span>
          </div>

          {/* Back to home arrow */}
          <Link 
            href="/" 
            className='inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200'
            aria-label="Back to home"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 sm:h-5 sm:w-5 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </div>

        {/* left content */}
        <div className="w-full max-w-md space-y-8">
          <div className="text-left w-full">
            <h2 className="text-4xl md:text-6xl text-white font-bold mb-2">
              Let&apos;s Get Started
            </h2>
            <p className="text-sm text-gray-300">
              Sign in to your LASU Fleet account
            </p>
          </div>
          
          <form className="mt-8 space-y-6" action="#" method="POST">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-white hover:text-sky-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Home Image */}
      <div className="hidden lg:flex items-center justify-center bg-sky-50 p-12 border-4 border-sky-50/40 rounded-2xl relative overflow-hidden w-full h-full min-h-[600px]">
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <div className="w-full h-full max-w-[800px] max-h-[600px] relative">
            <Image
              src={home}
              alt="LASU Fleet Dashboard"
              fill
              className="object-contain"
              priority
              quality={100}
              sizes="(max-width: 1200px) 100vw, 800px"
            />
          </div>
        </div>
      </div>
    </>
  );
}
