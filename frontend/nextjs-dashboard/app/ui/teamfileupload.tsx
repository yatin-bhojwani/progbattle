
'use client';

import { useState } from 'react';
import { PaperClipIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { Dispatch, SetStateAction } from 'react';

export default function TeamFileUpload({team_name, token,setHasUploadedBot}: {team_name: string, token: string,  setHasUploadedBot:Dispatch<SetStateAction<boolean | null>> }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Static team data (replace with your actual team name)
  const teamName = team_name;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    setIsSubmitting(true);
   // console.log("Submitting file:", selectedFile.name);
    // Add your file upload logic here
    try {
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    // Real API call
    const response = await fetch('http://localhost:8000/uploadbot', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`  // 👈 Attach here
      },
      body: formData
    });

    if (!response.ok) throw new Error('Upload failed');
    
    // Success handling
     setHasUploadedBot(true)
    alert("File uploaded successfully!");
   
    setSelectedFile(null);
    } catch (error) {
    alert(`Error: ${"ok"}`);
    } finally {
    setIsSubmitting(false); // Always disable loading
    }
    
   
  };

  return (
    <div className="rounded-xl bg-gray-900/80 p-6 border border-purple-500/20 h-full flex flex-col backdrop-blur-md">
  {/* Team Name Header */}
  <h2 className="text-lg font-bold text-purple-300 mb-4 flex items-center">
    <PaperClipIcon className="h-5 w-5 mr-2 text-purple-400" />
    YOUR TEAM: <span className="text-pink-400 ml-1">{teamName}</span>
  </h2>

  {/* File Upload Area */}
  <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-purple-500/30 rounded-lg p-6 mb-4 bg-gray-800/50">
      <ArrowUpTrayIcon className="h-10 w-10 text-purple-400/70 mb-2" />
      <label className="cursor-pointer text-center">
        <span className="text-purple-300 font-medium hover:text-pink-400 transition-colors">Click to upload</span> or drag and drop
        <input 
          type="file" 
          onChange={handleFileChange}
          className="hidden"
          accept=".py"
        />
      </label>
      <p className="mt-1 text-sm text-purple-400/70">Only .py files accepted</p>
      {selectedFile && (
        <p className="mt-2 text-sm text-pink-300 truncate max-w-full">
          <span className="font-medium">Selected:</span> {selectedFile.name}
        </p>
      )}
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={!selectedFile || isSubmitting}
      className={`w-full py-2 px-4 rounded-lg font-medium text-white flex items-center justify-center transition-all
        ${!selectedFile ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 
          isSubmitting ? 'bg-gradient-to-r from-purple-600/70 to-pink-600/70' : 
          'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg'}`}
    >
      {isSubmitting ? (
        <>
          Uploading...
          <svg className="animate-spin h-4 w-4 ml-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </>
      ) : (
        <>
          Submit File
          <ArrowUpTrayIcon className="h-4 w-4 ml-2" />
        </>
      )}
    </button>
  </form>
</div>
  );
}