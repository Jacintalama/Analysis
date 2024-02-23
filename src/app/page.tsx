"use client"
// Assuming you're using Next.js or a similar setup
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar'; // Adjust the import path as needed
import AnalysisMain from '@/components/AnalysisMain'; // Adjust the import path as needed
import * as EPANET from 'epanet-js';


export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);

  // Function to toggle Sidebar
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // Function to handle the processed file content
  const handleFileProcessed = (content: string) => {
    setFileContent(content);
    // Optionally, close the sidebar here if desired
    // setSidebarOpen(false);
  };

  return (
    <main className="">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} onFileProcessed={handleFileProcessed} />

      {/* Conditionally render AnalysisMain or other components based on fileContent */}
      {fileContent && <AnalysisMain fileContent={fileContent} />}
    </main>
  );
}
