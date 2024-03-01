import Draggable from "react-draggable";
import React, { useState } from "react";

interface AnalysisProps {
  elevation: string | number;
  demand: string | number;
  demandPattern: string;
  onElevationChange: (value: string) => void;
  onDemandChange: (value: string) => void;
  onDemandPatternChange: (value: string) => void;
}

const Analysis: React.FC<AnalysisProps> = ({
  // destructure your props here
}) => {
  // Assume that the day starts at Day 1, 00:00
  const [day, setDay] = useState(1);
  const [hour, setHour] = useState(0);
  const [min, setMin] = useState(0);

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation(); // Prevent event bubbling to Draggable

    const totalMinutes = parseInt(event.target.value);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    setHour(hours);
    setMin(minutes);

    // You may want to call an update function here
  };

  return (

      <div
        className="fixed top-20 right-20 z-[1000] w-96 shadow-lg bg-white rounded-lg p-4"
        style={{ width: 'auto', height: 'auto' }} // Adjust the width and height as needed
      >
        {/* ... button and header */}
        <div className="time-controls">
          <h2>Day {day}</h2>
          <h1>
            {hour.toString().padStart(2, '0')}:{min.toString().padStart(2, '0')}
          </h1>
          <div className="input">
            <input
              type="range"
              value={hour * 60 + min}
              min={0}
              max={24 * 60 - 1}
              step={15}
              onChange={handleTimeChange}
              className="w-full" // Adjust the width of the range input as needed
            />
          </div>
        </div>
      </div>
   
  );
};

export default Analysis;