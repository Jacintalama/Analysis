import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onFileProcessed: (content: string) => void; // Add this line
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onFileProcessed }) => {
  const [isDragging, setIsDragging] = useState(false);
  // Other states and hooks

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.inp')) {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            // Make sure to check that onFileProcessed is defined before calling it
            onFileProcessed(reader.result.toString());
          }
        };
        reader.readAsText(droppedFile);
      } else {
        alert('Please drop a valid .inp file.');
      }
    }
  };

  const draggingStyle: React.CSSProperties = isDragging ? {
    border: '2px solid #007bff',
    backgroundColor: '#f3f9ff',
  } : {};
  
  const sidebarStyle: React.CSSProperties = {
    width: isOpen ? '750px' : '0',
    height: '100%',
    position: 'fixed',
    zIndex: 100,
    top: 0,
    left: 0,
    backgroundColor: 'white',
    overflowX: 'hidden',
    transition: 'width 0.5s ease',
    padding: isOpen ? '20px' : '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '1rem',
  };

  // Add your styles here
  const headerStyle: React.CSSProperties = {
    fontSize: '2em',
    color: '#333',
    paddingBottom: '0.5em',
  };

  const textStyle: React.CSSProperties = {
    color: '#666',
    paddingBottom: '1.5em',
  };

  const dashedBoxStyle: React.CSSProperties = {
    border: '2px dashed #ccc',
    borderRadius: '5px',
    textAlign: 'center',
    padding: '5em',
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: '1.5em',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '1em',
  };

  const toggleButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: isOpen ? '730px' : '-5px',
    transform: 'translateY(-50%)',
    zIndex: 101,
    cursor: 'pointer',
    transition: 'left 0.5s ease',
  };

  const circleButtonStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    transition: 'transform 0.5s ease',
  };

  const svgStyle: React.CSSProperties = {
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.5s ease',
  };


  return (
    <>
      <div style={sidebarStyle}>
        <h1 style={headerStyle}>iTANK</h1>
     
        <p style={textStyle}>Analyze Epanet File .inp</p>
  
        {/* Apply the combined styles to this div */}
        <div
          style={{ ...dashedBoxStyle, ...draggingStyle }} // Combine the styles here
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          Drop EPANET .inp file here
          {/* <p>All data is processed client side, no model data sent to the server.</p> */}
        </div>
        {/* <button style={buttonStyle}>LOAD DEMO MODEL</button> */}
        {/* Additional sidebar content would go here */}
      </div>
      <div style={toggleButtonStyle} onClick={onClose}>
        <div style={circleButtonStyle}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={svgStyle}>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </>
  );
};

export default Sidebar;