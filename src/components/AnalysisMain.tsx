// Import necessary modules and types
"use client"
import React, { useEffect, useState } from "react";

interface AnalysisMainProps {
  fileContent: string;
}

const AnalysisMain: React.FC<AnalysisMainProps> = ({ fileContent }) => {
  const [analysisResults, setAnalysisResults] = useState<string | null>(null);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState("pressure");

  // Handler for changing the selected analysis type
  const handleAnalysisTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAnalysisType(event.target.value);
  };

  useEffect(() => {
    if (!fileContent) return;

    const runAnalysisOnServer = async () => {
      try {
        // Updated fetch request to include selectedAnalysisType
        const response = await fetch("/api/epanetAnalysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inpFileContent: fileContent, analysisType: selectedAnalysisType }), // Include selectedAnalysisType in the request
        });

        if (!response.ok) throw new Error("Network response was not ok.");

        const data = await response.json();
        setAnalysisResults(data.results);
      } catch (error) {
        console.error("Error during analysis:", error);
        setAnalysisResults("An error occurred during analysis.");
      }
    };

    runAnalysisOnServer();
  }, [fileContent, selectedAnalysisType]); // Depend on selectedAnalysisType as well

  const mainContentStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    padding: "20px",
    position: "relative",
  };

  const cardStyle: React.CSSProperties = {
    width: "55%",
    maxHeight: "80vh",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    overflowY: "auto",
    position: "absolute",
    right: "20px",
    top: "10%",
  };

  const cardHeaderStyle: React.CSSProperties = {
    margin: "20px",
    fontWeight: "bold",
    fontSize: "24px",
  };

  const cardContentStyle: React.CSSProperties = {
    padding: "20px",
  };

  return (
    <div style={mainContentStyle}>
      <div style={cardStyle}>
        <h1 style={cardHeaderStyle}>Analysis</h1>
        <div className="flex ml-5">
          <h2>Node Results: </h2>
          <select onChange={handleAnalysisTypeChange} value={selectedAnalysisType}>
            <option value="pressure">Pressure</option>
            <option value="demand">Demand</option>
            <option value="head">Head</option>
            {/* <option value="emitter">Emitter Flows</option> */}
          </select>
        </div>

        <div style={cardContentStyle}>
          {analysisResults ? (
            <pre>{analysisResults}</pre>
          ) : (
            <pre>{fileContent || "Loading analysis..."}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisMain;
