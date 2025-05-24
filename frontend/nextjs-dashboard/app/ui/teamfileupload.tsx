
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
    <div className="rounded-lg bg-gray-50 p-4 border border-gray-200 h-full flex flex-col">
      {/* Team Name Header */}
      <h2 className="text-lg font-bold text-purple-800 mb-4 flex items-center">
        <PaperClipIcon className="h-5 w-5 mr-2" />
        YOUR TEAM: {teamName}
      </h2>

      {/* File Upload Area */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 bg-white">
          <ArrowUpTrayIcon className="h-10 w-10 text-gray-400 mb-2" />
          <label className="cursor-pointer">
            <span className="text-purple-600 font-medium">Click to upload</span> or drag and drop
            
            <input 
              type="file" 
              onChange={handleFileChange}
              className="hidden"
              accept=".py" // Specify accepted file types
            />
          </label>
          <label>only .py files accepted</label>
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-600 truncate max-w-full">
              <span className="font-medium">Selected:</span> {selectedFile.name}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedFile || isSubmitting}
          className={`w-full py-2 px-4 rounded-md font-medium text-white flex items-center justify-center
            ${!selectedFile ? 'bg-gray-400 cursor-not-allowed' : 
              isSubmitting ? 'bg-purple-400' : 'bg-purple-500 hover:bg-purple-600'}`}
        >
          {isSubmitting ? (
            'Uploading...'
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