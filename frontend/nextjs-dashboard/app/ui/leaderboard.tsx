'use client';

import { ArrowRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline'; // Added ArrowPathIcon
import Link from 'next/link';
import TeamCard from './team-card';
import { inter } from '@/app/ui/fonts';
import { useEffect, useState } from 'react';

export default function Leaderboard() {
  const [teams, setTeams] = useState<Array<{team_name: string, score: number}>>([]);
  const [isRefreshing, setIsRefreshing] = useState(false); // Added loading state

  const getLeaderboard = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('http://localhost:8000/leaderboard', {
        method: 'GET',
      });
      const data = await response.json();
      setTeams(data); 
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    getLeaderboard();
  }, []);

  return (
 <div className="h-full flex flex-col rounded-xl bg-gray-900/80 backdrop-blur-md overflow-hidden ring-1 ring-purple-500/20">
  {/* Header with sticky positioning and refresh button */}
  <div className="sticky top-0 bg-gray-900/80 z-10 px-6 py-4 border-b border-purple-500/20 flex items-center justify-between backdrop-blur-md">
    <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
      LEADERBOARD
    </h1>
    <button
      onClick={getLeaderboard}
      disabled={isRefreshing}
      className={`p-1 rounded-md ${isRefreshing ? 'text-purple-400/50' : 'text-purple-400 hover:text-pink-500 hover:bg-gray-800/50'}`}
      aria-label="Refresh leaderboard"
    >
      <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
    </button>
  </div>
  
  {/* Scrollable team list */}
  <div className="flex-1 overflow-y-auto px-4 py-3">
    <div className="space-y-2">
      {teams.map((team, index) => (
        <TeamCard 
          key={team.team_name}
          rank={index+1}
          name={team.team_name}
          score={team.score}
        />
      ))}
    </div>
  </div>
</div>
  );
}