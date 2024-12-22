"use client";
import React, { useState } from "react";

function BroadbandSpeedCalculator() {
  const [speeds, setSpeeds] = useState<string>("");
  const [baselineSpeed] = useState(25); // Baseline speed in Mbps
  const [averageSpeed, setAverageSpeed] = useState<string | null>(null);
  const [standardizedSpeed, setStandardizedSpeed] = useState<string | null>(null);

  const calculateSpeeds = () => {
    const speedArray = speeds.split(",").map(Number).filter((speed) => !isNaN(speed));
    if (speedArray.length > 0) {
      // Calculate Average Speed
      const totalSpeed = speedArray.reduce((acc, speed) => acc + speed, 0);
      const avgSpeed = totalSpeed / speedArray.length;

      setAverageSpeed(avgSpeed.toFixed(2));

      // Calculate Standardized Speed
      const standardized = (avgSpeed / baselineSpeed) * 100;
      setStandardizedSpeed(standardized.toFixed(2));
    } else {
      alert("Please enter valid broadband speeds.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Calculate Average and Standardized Broadband Speed
      </h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Enter Broadband Speeds (Mbps) for the Month (comma-separated):
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={speeds}
            onChange={(e) => setSpeeds(e.target.value)}
            placeholder="50, 55, 53, 52, 54"
            required
          />
        </label>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={calculateSpeeds}
      >
        Calculate
      </button>
      {averageSpeed !== null && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-lg">Average Speed: {averageSpeed} Mbps</p>
          <p className="text-lg">Standardized Speed: {standardizedSpeed}%</p>
        </div>
      )}
    </div>
  );
}

export default BroadbandSpeedCalculator;
