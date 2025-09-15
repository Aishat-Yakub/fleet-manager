'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import home from '@/app/assets/images/home.png';
import logo from '@/app/assets/logo/Logo.jpg';
import { login } from '@/middleware/authMiddleware'; // middleware login

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const vehicle_id = formData.get('vehicle_id') as string;
    const password = formData.get('password') as string;

    try {
      const user = await login(vehicle_id, password);
      console.log('Logged in user:', user);

      // Save user in localStorage
      localStorage.setItem('user', JSON.stringify(user));

      // Role-based redirect
      switch (user.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'owner':
          router.push('/owners');
          break;
        case 'manager':
          router.push('/manager_page');
          break;
        case 'auditor':
          router.push('/auditor_page');
          break;
        default:
          setError('Role not recognized. Contact support.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
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
          <h2 className="text-4xl md:text-6xl text-white font-bold mb-2">Let&apos;s Get Started</h2>
          <p className="text-sm text-gray-300">Sign in to your LASU Fleet account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Email</label>
              <input
                id="Enter your vehicle id"
                name="vehicle_id"
                type="text"
                placeholder="Enter your vehicle id"
                className="appearance-none bg-white/20 text-white backdrop-blur-lg rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                className="appearance-none bg-white/20 back text-white  lack rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 ounded-b-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
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
