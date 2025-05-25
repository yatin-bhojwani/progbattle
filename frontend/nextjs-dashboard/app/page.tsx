import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Page() {
  return (
       <main className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900">
      {/* Modern Header */}
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

          {/* Navigation Buttons */}
          <nav className="flex items-center gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-purple-600 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/20"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-transparent px-5 py-2 text-sm font-medium text-purple-200 ring-1 ring-purple-400 transition-all hover:bg-purple-900/50 hover:text-white"
            >
              Log In
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-white sm:text-6xl">
            <span className="block">Where Only The Best</span>
            <span className="block bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Makes It Through
            </span>
          </h2>
          
          
        </div>
      </section>

      {/* Gradient Bottom Decoration */}
      <div className="absolute bottom-0 h-32 w-full bg-gradient-to-t from-gray-900 to-transparent" />
    </main>
  );
  
}
