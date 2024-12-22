"use client";

import React, { useState } from "react";

const CO2Emissions: React.FC = () => {
  const [co2Emissions, setCo2Emissions] = useState<number | string>(""); // Input: CO2 emissions
  const [standardizedScore, setStandardizedScore] = useState<string | null>(null); // Standardized score
  const [evaluation, setEvaluation] = useState<string | null>(null); // Decision evaluation

  // const MIN = 0.01; // Minimum CO2 emissions (metric tonnes)
  // const MAX = 40.31; // Maximum CO2 emissions (metric tonnes)
  const BENCHMARK = 0.39; // Benchmark value for CO2 emissions
  const CRITICAL = 2.09; // Critical threshold for CO2 emissions

  const calculateCO2Score = () => {
    if (!co2Emissions || parseFloat(co2Emissions.toString()) < 0) {
      alert("Please enter a valid CO₂ emissions value (greater than or equal to 0).");
      return;
    }

    const co2Value = parseFloat(co2Emissions.toString());
    const fifthRootEmissions = Math.pow(co2Value, 1 / 5); // Calculate the fifth root

    // Standardization formula
    let standardizedValue = 0;
    if (fifthRootEmissions >= CRITICAL) {
      standardizedValue = 0;
      setEvaluation("Poor");
    } else if (fifthRootEmissions > BENCHMARK && fifthRootEmissions < CRITICAL) {
      standardizedValue =
        100 *
        (1 - Math.abs((fifthRootEmissions - BENCHMARK) / (CRITICAL - BENCHMARK)));
      setEvaluation("Moderate");
    } else if (fifthRootEmissions <= BENCHMARK) {
      standardizedValue = 100;
      setEvaluation("Excellent");
    }

    setStandardizedScore(standardizedValue.toFixed(2));
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">CO₂ Emissions Evaluation</h2>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">CO₂ Emissions (metric tonnes):</label>
        <input
          type="number"
          value={co2Emissions}
          onChange={(e) => setCo2Emissions(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter CO₂ emissions"
        />
      </div>

      <button
        onClick={calculateCO2Score}
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

export default CO2Emissions;
