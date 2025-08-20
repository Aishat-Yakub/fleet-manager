'use client';

import React from 'react';
import Image from 'next/image';
import home from '@/app/assets/images/home.png';
import logo from '@/app/assets/logo/Logo.jpg';

export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission will be handled by the form's action
  };

  return (
    <div className="relative flex items-center justify-center p-8 bg-sky-50/10 min-h-screen">
      <div className="w-full max-w-md space-y-8">
        <div className="text-left w-full">
          <div className="w-14 h-14 md:w-20 md:h-20 flex-shrink-0 mb-4">
            <Image
              src={logo}
              alt="LASU Logo"
              width={80}
              height={80}
              className="object-cover rounded-full"
            />
          </div>
          <h2 className="text-4xl md:text-6xl text-white font-bold mb-2">Let's Get Started</h2>
          <p className="text-sm text-gray-300">Sign in to your LASU Fleet account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="Username"
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
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
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-sky-400 hover:text-sky-300">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>

      <div className="hidden lg:flex fixed top-0 right-0 h-full w-1/2 items-center justify-center p-8 bg-white rounded-2xl">
        <div className="relative w-3/4 h-1/2">
          <Image
            src={home}
            alt="Fleet of vehicles"
            width={800}
            height={600}
            className="object-contain w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
