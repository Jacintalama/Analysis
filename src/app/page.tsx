"use client"

import Sidebar from "@/components/Sidebar";
import { useState } from "react";



export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
 // Function to toggle Sidebar
 const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  return (
    <main className="">
        {/* Sidebar */}
    <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
     
        
    </main>
  );
}
