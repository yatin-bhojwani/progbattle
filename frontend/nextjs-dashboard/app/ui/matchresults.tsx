'use client0;'

import { useState, useEffect } from 'react';
import { VideoCameraIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Dispatch, SetStateAction } from 'react';
import PongAnimation from './matchanimation';
import { MatchFrame } from '../lib/matchframe';


export default function MatchResultsManager({token, setHasUploadedBot}: {token: string, setHasUploadedBot:Dispatch<SetStateAction<boolean | null>>}) {

  const [activeRound, setActiveRound] = useState<'round1' | 'round2'>('round1');
   const [showAnimation, setShowAnimation] = useState(false);
  const [score, setScore] = useState(0)
  const [animationData, setAnimationData] = useState<MatchFrame[]>([]);
  const [loading, setLoading] = useState(false);



  //to get the score
  useEffect(() => {
      const checkTeamScore = async () => {
        const response = await fetch('http://localhost:8000/user', {
          method: 'GET',
          headers: {
          'Authorization': `Bearer ${token}`  // 👈 Attach here
        },
        });
        const data = await response.json();
        console.log(data.score)
        setScore(data.score)
      };
      checkTeamScore();
    }, [ ]);

  
  
  const matchData = {
    round1: {
      opponent: "System",
      
      score: 85,
      videoAvailable: true
    },
    round2: {
      opponent: "Algorithm Avengers",
      date: "2023-06-20",
      score: 92,
      videoAvailable: false
    }
  };



  const handleGetMatchVideo = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/match-data',{
        headers: {
          method : 'GET',
          'Authorization': `Bearer ${token}`  // 👈 Attach here
        },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      
      const result = await response.json();
      setAnimationData(result.data);
      setShowAnimation(true);
    } catch (error) {
      console.error('Error fetching match data:', error);
      alert('Failed to load animation data');
    } finally {
      setLoading(false);
    }

  };

 
  const handleDeleteFile = async () => {
     try{
        const response = await fetch('http://localhost:8000/deletebot', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      setHasUploadedBot(false)
      alert(`Deleting file for ${activeRound} vs ${matchData[activeRound].opponent}`);
    }catch{
      alert("could not delete")
    }
    

  };

  const handleGetFile = async () => {
     try{
        const response = await fetch('http://localhost:8000/getbot', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
       if (!response.ok) {
      throw new Error('Failed to fetch file');
    }

    // Get the filename from content-disposition or use a default
    const contentDisposition = response.headers.get('content-disposition');
    const filename = contentDisposition 
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : 'bot.py';

    // Create download link
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);


      setHasUploadedBot(false)
      
    }catch{
      alert("could not fetch file")
    } 
  };

  return (
<div className="rounded-xl bg-gray-900/80 p-6 border border-purple-500/20 h-full flex flex-col backdrop-blur-md">
  {/* Header */}
  <h2 className="text-lg font-bold text-purple-300 mb-4">Match Results</h2>
  
  {/* Round Toggle */}
  <div className="flex border-b border-purple-500/20 mb-4">
    <button
      className={`flex-1 py-2 font-medium text-center transition-colors ${
        activeRound === 'round1' 
          ? 'text-pink-400 border-b-2 border-pink-400' 
          : 'text-purple-300 hover:text-pink-300'
      }`}
      onClick={() => setActiveRound('round1')}
    >
      Round 1
    </button>
  </div>
  
  {/* Match Details */}
  <div className="bg-gray-800/50 p-4 rounded-lg border border-purple-500/20 mb-4 flex-1">
    <div className="grid grid-cols-2 gap-4 mb-6">
      <DetailItem label="Opponent" value={matchData[activeRound].opponent} />
      <DetailItem label="Score" value={score.toString()} />
    </div>
    
    <div className="mt-auto space-y-2">
      <button
        onClick={handleGetMatchVideo}
        disabled={!matchData[activeRound].videoAvailable}
        className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all ${
          matchData[activeRound].videoAvailable
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
        }`}
      >
        <VideoCameraIcon className="h-5 w-5" />
        {loading ? (
          <span className="flex items-center gap-2">
            Loading...
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        ) : (
          'View Match Animation'
        )}
      </button>
      {showAnimation && animationData.length > 0 && (
        <PongAnimation 
        matchData={animationData}
        onClose={() => setShowAnimation(false)}
        />
      )}
      
      <div className="flex gap-2">
        <button
          onClick={handleGetFile}
          disabled={!matchData[activeRound].videoAvailable}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
            matchData[activeRound].videoAvailable
              ? 'bg-gray-700 text-purple-300 hover:bg-gray-600'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          Get File
        </button>
        
        <button
          onClick={handleDeleteFile}
          disabled={!matchData[activeRound].videoAvailable}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
            matchData[activeRound].videoAvailable
              ? 'bg-gray-700 text-red-400 hover:bg-gray-600 hover:text-red-300'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          <TrashIcon className="h-5 w-5" />
          Delete File
        </button>
      </div>
    </div>
  </div>
</div>
  );
}



function DetailItem({ label, value, valueClass = "" }: { 
  label: string; 
  value: string; 
  valueClass?: string;
}) {
  return (
<div>
  <h3 className="text-sm font-medium text-purple-300/80">{label}</h3>
  <p className={`font-medium ${valueClass || 'text-pink-400'}`}>{value}</p>
</div>
  );
}