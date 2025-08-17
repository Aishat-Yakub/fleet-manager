'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import home from '@/app/assets/images/home.png';
import logo from '@/app/assets/logo/Logo.jpg';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  

  const { user,login, isLoading, error } = useAuth(); 
  const router = useRouter();

  useEffect(() => {
    console.log("Logged in user:", user);
    if (user) {
      switch (user.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'manager':
          router.push('/manager');
          break;
        case 'owner':
          router.push('/owners');
          break;
        case 'auditor':
          router.push('/auditor');
          break;
        default:
          router.push('/');
      }
    }
  }, [user, router]);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <>
      <div className="relative flex items-center justify-center p-8 bg-sky-50/10 min-h-screen">
        <div className="absolute top-8 left-8 right-8 md:pl-20 pr-4 pt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-20 md:h-20 flex-shrink-0">
              <div className="w-full h-full relative rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                <Image src={logo} alt="LASU Logo" fill className="object-cover" priority />
              </div>
            </div>
            <span className="text-xl text-white font-bold whitespace-nowrap">
              LASU Fleet <br /> Manager
            </span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
            aria-label="Back to home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-left w-full">
            <h2 className="text-4xl md:text-6xl text-white font-bold mb-2">Let&apos;s Get Started</h2>
            <p className="text-sm text-gray-300">Sign in to your LASU Fleet account</p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-200">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-sky-400 hover:text-sky-300">Forgot your password?</a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex fixed top-0 right-0 h-full w-1/2 items-center justify-center p-8 bg-white rounded-2xl">
        <div className="relative w-3/4 h-1/2">
          <Image
            src={home}
            alt="A fleet of vehicles"
            width={800}
            height={600}
            className="object-contain w-full h-full"
            priority
          />
        </div>
      </div>
    </>
  );
}
