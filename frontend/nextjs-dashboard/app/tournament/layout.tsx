
import { inter } from '@/app/ui/fonts';
import Leaderboard from '../ui/leaderboard';
import NameInHeader from '../ui/nameinheader';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
      

  <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
  {/* Left column (20% width) */}
  <div className="rounded-xl bg-gray-900/80 p-4 md:w-1/5 backdrop-blur-md ring-1 ring-purple-500/20">
    <div className="h-full">
      <Leaderboard />
    </div>
  </div>

  {/* Right column (80% width) */}
  <div className="rounded-xl bg-gray-900/80 p-4 md:w-4/5 backdrop-blur-md ring-1 ring-purple-500/20">
    <div className="h-full">
      {/* Header section */}
        <div className="flex h-20 shrink-0 items-center rounded-lg bg-gray-900/90 p-4 md:h-32 border-b border-purple-500/20 backdrop-blur-md">
          <NameInHeader />
        </div>
      
      {/* Content section */}
      <div className="mt-4">
        {children}
      </div>
    </div>
  </div>
</div>
    
    
  );
}