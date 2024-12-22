"use client";

import React, { useState } from "react";

function LandAllocatedToStreetsCalculator() {
  const [urbanSurfaceStreets, setUrbanSurfaceStreets] = useState("");
  const [totalUrbanArea, setTotalUrbanArea] = useState("");
  const [allocatedPercentage, setAllocatedPercentage] = useState<number | null>(null);
  const [standardizedScore, setStandardizedScore] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);

  // Constants
  const MIN = 6; // Minimum benchmark percentage
  const MAX = 36; // Maximum benchmark percentage

  const calculateLandAllocatedToStreets = () => {
    const numericUrbanSurfaceStreets = parseFloat(urbanSurfaceStreets);
    const numericTotalUrbanArea = parseFloat(totalUrbanArea);

    if (numericUrbanSurfaceStreets > 0 && numericTotalUrbanArea > 0) {
      // Calculate Land Allocated to Streets (%)
      const landAllocated =
        (numericUrbanSurfaceStreets / numericTotalUrbanArea) * 100;
      setAllocatedPercentage(landAllocated);

      // Standardized Score Calculation
      let standardizedScoreValue: number;
      if (landAllocated <= MIN) {
        standardizedScoreValue = 0;
      } else if (landAllocated >= MAX) {
        standardizedScoreValue = 100;
      } else {
        standardizedScoreValue =
          100 * ((landAllocated - MIN) / (MAX - MIN));
      }
      setStandardizedScore(standardizedScoreValue);

      // Decision
      if (landAllocated <= MIN) {
        setDecision("Land allocated to streets is below the minimum benchmark.");
      } else if (landAllocated >= MAX) {
        setDecision("Land allocated to streets meets or exceeds the benchmark.");
      } else {
        setDecision(
          "Land allocated to streets is within the acceptable range."
        );
      }
    } else {
      alert(
        "Both urban surface allocated to streets and total urban area must be positive numbers."
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Land Allocated to Streets Calculator
      </h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Total Surface of Urban Streets (in km²):
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={urbanSurfaceStreets}
            onChange={(e) => setUrbanSurfaceStreets(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Total Urban Area (in km²):
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={totalUrbanArea}
            onChange={(e) => setTotalUrbanArea(e.target.value)}
            required
          />
        </label>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={calculateLandAllocatedToStreets}
      >
        Calculate
      </button>
      {(allocatedPercentage !== null || standardizedScore !== null) && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          {allocatedPercentage !== null && (
            <p className="text-lg">
              Land Allocated to Streets: {allocatedPercentage.toFixed(2)}%
            </p>
          )}
          {standardizedScore !== null && (
            <p className="text-lg">
              Standardized Score: {standardizedScore.toFixed(2)}%
            </p>
          )}
          {decision && (
            <p
              className={`mt-4 p-2 text-center font-bold text-white rounded-md ${
                decision ===
                "Land allocated to streets meets or exceeds the benchmark."
                  ? "bg-green-500"
                  : decision ===
                    "Land allocated to streets is within the acceptable range."
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            >
              {decision}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default LandAllocatedToStreetsCalculator;
