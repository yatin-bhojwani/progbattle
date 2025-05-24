
'use client'

import { lusitana } from '@/app/ui/fonts';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';



export default function LoginForm() {


    const [email, setEmail] = useState('');
   
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("ok");
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

       const { access_token } = await response.json();
       document.cookie = `jwt_token=${access_token}; path=/; Secure; SameSite=Strict`; ////creating a cookie with the jwt token to access it later
       console.log(document.cookie);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Signup failed");
      }
      router.push('/tournament');

      // Handle successful signup (redirect or show success message)
     //// window.location.href = '/dashboard'; // Example redirect
    }catch (err: unknown) {           //err in catch block is unknown - TypeScript 4.4+ treats caught errors as unknown
      if (err instanceof Error) {
      setError(err.message);
      } else {
     setError('An unknown error occurred');
  }
    } finally {
      setIsLoading(false);
    }
  };


  return (

 <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900">  

  <header className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo/Center Title */}
        <div className="flex flex-1 justify-center">
          <h1 className="text-3xl font-bold text-white">
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              ProgBattle
            </span>
          </h1>
        </div>
      </div>
    </header>

 <section className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <form 
        className="w-full space-y-6 rounded-xl bg-gray-900/80 p-8 shadow-lg ring-1 ring-purple-500/20 backdrop-blur-md" 
        onSubmit={handleSubmit}
      >
        <div className="text-center">
          <h2 className={`${lusitana.className} text-2xl font-bold text-white`}>
            Welcome Back
          </h2>
          <p className="mt-2 text-purple-200">
            Please log in to continue your journey
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-purple-200" htmlFor="email">
              Email
            </label>
            <div className="group relative">
              <input
                className="block w-full rounded-lg border border-purple-500/30 bg-gray-800 py-3 pl-10 pr-4 text-sm text-white placeholder-purple-400/70 outline-none transition-all focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-400 group-focus-within:text-pink-500" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-purple-200" htmlFor="password">
              Password
            </label>
            <div className="group relative">
              <input
                className="block w-full rounded-lg border border-purple-500/30 bg-gray-800 py-3 pl-10 pr-4 text-sm text-white placeholder-purple-400/70 outline-none transition-all focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-400 group-focus-within:text-pink-500" />
            </div>
          </div>
        </div>

        <Button 
          className="mt-6 w-full transform rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-medium text-white shadow-lg transition-all hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-[0.98]" 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Logging in...
            </span>
          ) : (
            'Login'
          )}
        </Button>
      </form>
    </section>
    <div className="absolute bottom-0 h-32 w-full bg-gradient-to-t from-gray-900 to-transparent" />
    </div>
  );
}
