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
 <h1 className="ml-4 text-4xl font-bold sm:text-5xl">
  <span className="bg-gradient-to-r from-purple-600 to-pink-700 bg-clip-text text-transparent">
    Hello, {username}
  </span>
</h1>
  );

}