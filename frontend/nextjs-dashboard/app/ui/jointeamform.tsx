'use client';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { inter } from '@/app/ui/fonts';
import { useState } from "react";
import { getTokenFromCookie } from '../lib/cookietoken';



export default function JoinTeamForm({  setHasJoinedTeam, token}: { setHasJoinedTeam: Dispatch<SetStateAction<boolean | null>>, token:String}) {
  interface Team {
  id: number;
  name: string;
  members: number;
  }
  
  const [teamName, setTeamName] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [teams, setTeams] = useState<Team[]>([]);
  const[isLoading, setLoading]=useState(false)

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
  useEffect(()=>{
     const getData = async()=>{
     try {
      const response = await fetch('http://localhost:8000/getteams', {
        method: 'GET',
      });
      const data = await response.json()
      setTeams(data)
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setTeams([{ id: 0, name: 'Failed to load', members: 0 }]);
    } finally {
      
    }
    } 
    getData()
  }
  
  ,[]);


const handleJoinTeam = async (teamName: string) => {
  try {
    const response = await fetch('http://localhost:8000/teamjoin', {
      method: 'POST', 
      headers: {
        
        'Authorization': `Bearer ${token}`,
        'Team-Name': teamName
      },
      
    });

    if (!response.ok) {
      alert('Failed to join team');
      return;
    }

    alert('Successfully joined team!');
    // Optional: Refresh team list or redirect
   setHasJoinedTeam(true);
    
  } catch (error) {
    
    alert(error);
  }
};
return (
   <div className={`rounded-xl bg-gray-900/80 p-6 ${inter.className} backdrop-blur-md ring-1 ring-purple-500/20`}>
  <h2 className="text-lg font-bold text-purple-300 mb-4 text-center">
    You have not joined a team
  </h2>
  
  {/* Tab Navigation */}
  <div className="flex border-b border-purple-500/20 mb-4">
    <button
      className={`flex-1 py-2 font-medium text-sm ${activeTab === 'create' ? 'text-purple-300 border-b-2 border-purple-500' : 'text-purple-400/70'}`}
      onClick={() => setActiveTab('create')}
    >
      Create Team
    </button>
    <button
      className={`flex-1 py-2 font-medium text-sm ${activeTab === 'join' ? 'text-purple-300 border-b-2 border-purple-500' : 'text-purple-400/70'}`}
      onClick={() => setActiveTab('join')}
    >
      Join Team
    </button>
  </div>

  {/* Create Team Form (existing functionality) */}
  {activeTab === 'create' && (
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
        Create Team
      </button>
    </form>
  )}

  {/* Join Team Section (placeholder) */}
  {activeTab === 'join' && (
    <div className="space-y-4">
      

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {/* Placeholder team data */}
        {teams.map((team) => (
          <div key={team.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
            <div>
              <h3 className="font-medium text-purple-100">{team.name}</h3>
              <p className="text-xs text-purple-400/70">{team.members}/4 members</p>
            </div>
            <button className="px-3 py-1 text-xs font-medium rounded-md bg-purple-600/50 hover:bg-purple-600 transition-colors"  onClick={() => handleJoinTeam(team.name)}>
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  )}
</div>
  );
}