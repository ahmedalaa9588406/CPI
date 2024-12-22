"use client";

import React, { useState } from "react";

const PM25Concentration: React.FC = () => {
  const [pm25Concentration, setPm25Concentration] = useState<number | string>(""); // Input: PM2.5 concentration
  const [standardizedScore, setStandardizedScore] = useState<string | null>(null); // Standardized score
  const [evaluation, setEvaluation] = useState<string | null>(null); // Decision evaluation

  const BENCHMARK = 10; // Benchmark for PM2.5 concentration (X*)

  const calculatePM25Score = () => {
    if (!pm25Concentration || parseFloat(pm25Concentration.toString()) < 0) {
      alert("Please enter a valid PM2.5 concentration (greater than or equal to 0).");
      return;
    }

    const pm25Value = parseFloat(pm25Concentration.toString());

    // Standardization formula with absolute value
    let standardizedValue = 0;
    if (pm25Value >= 20) {
      standardizedValue = 0;
      setEvaluation("Poor");
    } else if (pm25Value >= 10 && pm25Value < 20) {
      standardizedValue = 100 * (1 - Math.abs((pm25Value - BENCHMARK) / 10));
      setEvaluation("Moderate");
    } else if (pm25Value <= 10) {
      standardizedValue = 100;
      setEvaluation("Excellent");
    }

    setStandardizedScore(standardizedValue.toFixed(2));
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">PM2.5 Concentration Evaluation</h2>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">PM2.5 Concentration (μg/m³):</label>
        <input
          type="number"
          value={pm25Concentration}
          onChange={(e) => setPm25Concentration(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter PM2.5 concentration"
        />
      </div>

      <button
        onClick={calculatePM25Score}
        className="p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition"
      >
        Calculate Standardized Score
      </button>

      {standardizedScore !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Standardized Score: {standardizedScore}
          </h3>
          <h3 className="text-lg">
            Evaluation: {evaluation}
          </h3>
        </div>
      )}
    </div>
  );
};

export default PM25Concentration;
