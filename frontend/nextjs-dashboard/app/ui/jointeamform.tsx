'use client';
import { Dispatch, SetStateAction } from 'react';
import { inter } from '@/app/ui/fonts';
import { useState } from "react";
import { getTokenFromCookie } from '../lib/cookietoken';



export default function JoinTeamForm({  setHasJoinedTeam}: { setHasJoinedTeam: Dispatch<SetStateAction<boolean | null>> }) {
  const [teamName, setTeamName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    
    const token = getTokenFromCookie();
    console.log(token);
    if (!token) throw new Error("No token found");
    

    const response = await fetch('http://localhost:8000/teamcreate', {
        method: 'POST',
        headers: {
       'Authorization': `Bearer ${token}`,
       'Team-Name': `${teamName}`  // 👈 Attach here
      },
      });
      setHasJoinedTeam(true);
      
      
  };

  return (
    <div className={`rounded-lg bg-gray-50 p-4 ${inter.className}`}>
      <h2 className="text-lg font-bold text-purple-800 mb-4 text-center">
        You have not joined a team
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
            Team Name
          </label>
          <input
            type="text"
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="Enter team name"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-500 hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          Join Team
        </button>
      </form>
    </div>
  );
}