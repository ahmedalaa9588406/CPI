"use client";
import React, { useState } from "react";

function AverageDailyTravelTimeForm() {
  const [averageTravelTime, setAverageTravelTime] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [standardizedTime, setStandardizedTime] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);

  // Constants
  const X = 30; // Benchmark average travel time in minutes

  const calculateAverageTravelTime = () => {
    const numericAverageTravelTime = Number(averageTravelTime);

    if (numericAverageTravelTime >= 0) {
      // Standardized Travel Time (S) Calculation
      let standardizedTravelTime: number;

      if (numericAverageTravelTime >= 2 * X) {
        standardizedTravelTime = 0; // If travel time >= 2 * X
      } else if (numericAverageTravelTime > X) {
        standardizedTravelTime =
          100 * (1 - (numericAverageTravelTime - X) / (X - 30));
      } else {
        standardizedTravelTime = 100; // If travel time <= X
      }

      setStandardizedTime(standardizedTravelTime);
      setResult(numericAverageTravelTime.toFixed(2));

      // Determine the decision message
      if (standardizedTravelTime === 100) {
        setDecision("Optimal Travel Time");
      } else if (standardizedTravelTime >=2*30) {
        setDecision("Very Poor Travel Time");
      } else {
        setDecision("Moderate Travel Time");
      }
    } else {
      alert("Average travel time must be a non-negative number.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Calculate Average Daily Travel Time
      </h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Average Daily Travel Time (in minutes):
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={averageTravelTime}
            onChange={(e) => setAverageTravelTime(e.target.value)}
            required
          />
        </label>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={calculateAverageTravelTime}
      >
        Calculate
      </button>
      {result !== null && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-lg">Average Daily Travel Time: {result} minutes</p>
          <p className="text-sm text-gray-600">Standardized Travel Time (S):</p>
          <ul className="list-disc pl-5">
            <li>{standardizedTime?.toFixed(2)}%</li>
          </ul>
          {decision && (
            <p
              className={`mt-4 p-2 text-center font-bold text-white rounded-md ${
                decision === "Optimal Travel Time"
                  ? "bg-green-500"
                  : decision === "Very Poor Travel Time"
                  ? "bg-red-500"
                  : "bg-yellow-500"
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

export default AverageDailyTravelTimeForm;
