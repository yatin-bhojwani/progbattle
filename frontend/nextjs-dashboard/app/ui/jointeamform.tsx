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
   <div className={`rounded-xl bg-gray-900/80 p-6 ${inter.className} backdrop-blur-md ring-1 ring-purple-500/20`}>
  <h2 className="text-lg font-bold text-purple-300 mb-4 text-center">
    You have not joined a team
  </h2>
  
  <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label htmlFor="teamName" className="block text-sm font-medium text-purple-200 mb-2">
        Team Name
      </label>
      <input
        type="text"
        id="teamName"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 rounded-lg text-purple-100 placeholder-purple-400/70 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
        placeholder="Enter team name"
        required
      />
    </div>

    <button
      type="submit"
      className="w-full py-2 px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg transition-all"
    >
      Join Team
    </button>
  </form>
</div>
  );
}