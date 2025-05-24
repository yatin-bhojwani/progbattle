import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-purple-500 p-4 md:h-52">
        {/* <AcmeLogo /> */}
      </div>
      
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Welcome to ProgBattle</strong> where only the best makes it through
          </p>

          <Link
            href="/signup"
            className="flex items-center gap-5 self-start rounded-lg bg-purple-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-400 md:text-base"
          >
            <span>Signup</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-purple-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>

          <Link
            href="/round2"
            className="flex items-center gap-5 self-start rounded-lg bg-purple-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-400 md:text-base"
          >
            <span>Signup</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
          
        </div>
        
      </div>
      
    </main>
  );
}
