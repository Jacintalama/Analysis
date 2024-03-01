"use client"
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import AnalysisMain from '@/components/AnalysisMain';
import WaterNetworkMap from '@/components/WaterNetworkMap';
import { toGeoJson } from '@/utils/epanetToGeoJson'; // Adjust the import path as needed
import Buttom from '@/components/Buttom';
import Analysis from '@/components/Analysis';

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection>();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleFileProcessed = (content: string) => {
    const convertedGeoJson = toGeoJson(content);
    setGeoJsonData(convertedGeoJson);
    setFileContent(content); // Optional, if you still need the raw content
  };

  return (
    <main className="">
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} onFileProcessed={handleFileProcessed} />
      <Analysis />
      <WaterNetworkMap geoJsonData={geoJsonData} />
      {/* <Buttom /> */}
      {fileContent && <AnalysisMain fileContent={fileContent} />}
    </main>
  );
}
