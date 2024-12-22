"use client";

import React, { useState } from "react";

const GiniIndexStandardization: React.FC = () => {
  const [gini, setGini] = useState<number | string>(""); // Input: Gini coefficient
  const [standardizedRate, setStandardizedRate] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<string | null>(null); // Decision evaluation

  // Constants for benchmarks
  const MIN = 0.24; // Minimum Gini coefficient
  const MAX = 0.63; // Maximum Gini coefficient

  const calculateStandardizedGini = () => {
    if (typeof gini === "string" && gini.trim() === "") {
      alert("Please enter a valid Gini coefficient.");
      return;
    }

    const giniValue = Number(gini);
    
    if (giniValue < 0) {
      alert("Gini coefficient cannot be negative.");
      return;
    }

    // Decision logic
    if (giniValue >= MAX) {
      setStandardizedRate("0");
      setEvaluation("Bad");
    } else if (giniValue > MIN) {
      const standardized = 100 * (1 - (giniValue - MIN) / (MAX - MIN));
      setStandardizedRate(standardized.toFixed(2));
      setEvaluation("Average");
    } else {
      setStandardizedRate("100");
      setEvaluation("Good");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Gini Index Standardization</h2>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Gini Coefficient:</label>
        <input
          type="number"
          value={gini}
          onChange={(e) => setGini(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter Gini coefficient"
        />
      </div>

      <button
        onClick={calculateStandardizedGini}
        className="p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition"
      >
        Calculate Standardized Rate
      </button>

      {standardizedRate !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Standardized Gini Index: {standardizedRate}
          </h3>
          <h3 className="text-lg">
            Evaluation: {evaluation}
          </h3>
        </div>
      )}
    </div>
  );
};

export default GiniIndexStandardization;
