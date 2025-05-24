'use client';

import { useState , useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { getTokenFromCookie } from '../lib/cookietoken';


export default function NameInHeader(){
    const [username, setUsername] = useState('');

    useEffect(() => {
    const checkUsernameStatus = async () => {
    
      const token = getTokenFromCookie();
      console.log(token);
      if (!token) throw new Error("No token found");
      
     
      const response = await fetch('http://localhost:8000/user', {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${token}`  // 👈 Attach here
      },
      });
      const data = await response.json();
      setUsername(data.username);
    
             
      
    };
    checkUsernameStatus();
  }, []);

  return (
                   <h1 className="text-5xl font-bold text-white ml-4 flex">Hello, {username}</h1>
  );

}