        "use client"
    // Import necessary modules and types
    import React, { useEffect, useState } from 'react';

    interface AnalysisMainProps {
        fileContent: string;
    }
    
    const AnalysisMain: React.FC<AnalysisMainProps> = ({ fileContent }) => {
        const [analysisResults, setAnalysisResults] = useState<string | null>(null);
    
        useEffect(() => {
            if (!fileContent) return;
            
            const runAnalysisOnServer = async () => {
                try {
                    const response = await fetch('/api/epanetAnalysis', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ inpFileContent: fileContent }),
                    });
    
                    if (!response.ok) throw new Error('Network response was not ok.');
    
                    const data = await response.json();
                    setAnalysisResults(data.results);
                    //    setNodeId(data.nodeId)
                } catch (error) {
                    console.error("Error during analysis:", error);
                    setAnalysisResults("An error occurred during analysis.");
                }
            };
    
            runAnalysisOnServer();
        }, [fileContent]);
        
                const mainContentStyle: React.CSSProperties = {
                    display: 'flex',
                    justifyContent: 'center', // Centering the card horizontally
                    alignItems: 'center', // Centering the card vertically
                    height: '100vh',
                    padding: '20px',
                    position: 'relative',
                };

                const cardStyle: React.CSSProperties = {
                    width: '55%',
                    maxHeight: '80vh', // Use maxHeight for a scrollable card
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                    overflowY: 'auto', // Enables vertical scrolling if the content overflows
                    position: 'absolute',
                    right: '20px',
                    top: '10%',
                };

                const cardHeaderStyle: React.CSSProperties = {
                    margin: '20px', // Unified margin for header
                    fontWeight: 'bold',
                    fontSize: '24px',
                };

                const cardContentStyle: React.CSSProperties = {
                    padding: '20px', // Adjust padding for the content
                };

                return (
                    <div style={mainContentStyle}>
                        <div style={cardStyle}>
                            <h1 style={cardHeaderStyle}>Analysis</h1>   
                            <div className='flex ml-5'>
                                <h2>Node Results:   </h2>
                            <select name="" id="">
                                <option value="">Pressure</option>
                                <option value="">Demand</option>
                                    <option value="">Head</option>
                            </select>
                            </div>
                            
                            <div style={cardContentStyle}> 
                                {analysisResults ? 
                                    <pre>{analysisResults}</pre> :
                                    <pre>{fileContent || "Loading analysis..."}</pre>
                                }
                            </div>
                        </div>
                    </div>
                );
            };
            
            export default AnalysisMain;
