
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
        {/* Left column (1/5 width) */}
          <div className="rounded-lg bg-gray-50 p-6 md:w-1/5">
          {/* Empty - will occupy 20% width */}
          <div className="h-full border-2 border-dashed border-gray-300 rounded-lg"><Leaderboard/></div>
          </div>

        {/* Right column (4/5 width) */}
        <div className="rounded-lg bg-gray-100 p-6 md:w-4/5">
          {/* Empty - will occupy 80% width */}
          <div className="h-full border-2 border-dashed border-gray-300 rounded-lg">
            <div className="flex h-20 shrink-0 items-center rounded-lg bg-purple-500 p-4 md:h-52">
                <div> <NameInHeader/> </div>
            </div>
           
            <div>{children}</div> 
          </div>
        </div>
      </div>
    
    
  );
}