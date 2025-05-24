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
    <div className="h-full flex flex-col rounded-lg bg-gray-50 overflow-hidden">
      {/* Header with sticky positioning and refresh button */}
      <div className="sticky top-0 bg-gray-50 z-10 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-bold text-purple-800 text-center truncate">
          LEADERBOARD
        </h1>
        <button
          onClick={getLeaderboard}
          disabled={isRefreshing}
          className={`p-1 rounded-md ${isRefreshing ? 'text-gray-400' : 'text-purple-600 hover:text-purple-800 hover:bg-gray-100'}`}
          aria-label="Refresh leaderboard"
        >
          <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {/* Scrollable team list */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        <div className="space-y-1">
          {teams.map((team, index) => (
            <TeamCard 
              key={team.team_name} // Added key prop for better React rendering
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