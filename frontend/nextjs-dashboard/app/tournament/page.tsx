'use client';

import { useState, useEffect } from "react";
import Leaderboard from "../ui/leaderboard";
import JoinTeamForm from '../ui/jointeamform';
import { getTokenFromCookie } from '../lib/cookietoken';
import TeamFileUpload from "../ui/teamfileupload";
import MatchResultsManager from "../ui/matchresults";

export default function Page(){
    
    // State to track if user has joined a team
  const [hasJoinedTeam, setHasJoinedTeam] = useState<boolean | null>(null);
  const [teamName, setTeamName] = useState("loading")
  const[tokenName, setTokenName]=useState<string>("initial")
  const [hasUploadedBot, setHasUploadedBot]=useState<boolean | null>(null);
  
  // Simulate fetching team status 
  useEffect(() => {
    const checkTeamStatus = async () => {
     const token = getTokenFromCookie();
     // console.log(token);
      if (!token) throw new Error("No token found");
      setTokenName(token)

      
      const response = await fetch('http://localhost:8000/user', {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${token}`  // 👈 Attach here
      },
      });
      const data = await response.json();
      console.log(data.team_name)
      if(data.team_name != "None") {
      setHasJoinedTeam(true);
      setTeamName(data.team_name)
      }
      else setHasJoinedTeam(false);
      if(data.file!="None"){
        setHasUploadedBot(true)
      }
      else setHasUploadedBot(false)
      console.log(hasUploadedBot)
    };
    checkTeamStatus();
  }, [hasJoinedTeam, hasUploadedBot]);

  // Handle joining a team
//   const handleJoinTeam = async (teamId: string) => {
//     try {
//       await fetch('/api/team/join', {
//         method: 'POST',
//         body: JSON.stringify({ teamId })
//       });
//       setHasJoinedTeam(true); // Triggers re-render
//     } catch (error) {
//       console.error('Join failed', error);
//     }
//   };

  // Loading state
  if (hasJoinedTeam === null) {
    return <div className="p-4 text-center">Loading...</div>;
  }

    return (

             <div>
                {hasJoinedTeam?
                   (hasUploadedBot?(<MatchResultsManager team_name={teamName} token = {tokenName} setHasUploadedBot={setHasUploadedBot}/>):(<TeamFileUpload team_name={teamName} token={tokenName}  setHasUploadedBot={setHasUploadedBot}/>))  :
                   ( <JoinTeamForm  setHasJoinedTeam = {setHasJoinedTeam} token = {tokenName} />)}
             </div>
    ); 
}    