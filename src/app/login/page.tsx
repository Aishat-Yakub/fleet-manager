'use client';

import React, { useState, FormEvent } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import home from '@/app/assets/images/home.png';
import logo from '@/app/assets/logo/Logo.jpg';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!username || !password) return; // simple frontend validation

    try {
      await login({ username, password });
    } catch (err) {
      // error is already handled in AuthContext, optional extra handling here
      console.error('Login page error:', err);
    }
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
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
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
