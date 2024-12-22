"use client";

import React, { useState } from "react";

const PovertyRateStandardization: React.FC = () => {
  const [povertyPopulation, setPovertyPopulation] = useState<number | string>(""); // Input: population below $1.25 PPP a day
  const [totalPopulation, setTotalPopulation] = useState<number | string>(""); // Input: total population
  const [standardizedRate, setStandardizedRate] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<string | null>(null); // Decision evaluation

  // Constants for benchmarks
  const MIN = 0.38; // ⁴√Min = 0.38
  const MAX = 3.00; // ⁴√Max = 3.00

  const calculatePovertyRate = () => {
    const totalPopValue = parseFloat(totalPopulation.toString());
    if (totalPopValue <= 0) {
      alert("Total population must be greater than zero.");
      return;
    }

    // Poverty rate formula
    const povertyRate = (100 * parseFloat(povertyPopulation.toString())) / totalPopValue;
    const fourthRootPovertyRate = Math.pow(povertyRate, 0.25); // Calculating the fourth root

    // Decision logic
    if (fourthRootPovertyRate >= MAX) {
      setStandardizedRate("0");
      setEvaluation("Bad");
    } else if (fourthRootPovertyRate > MIN) {
      const standardized =
        100 * (1 - (fourthRootPovertyRate - MIN) / (MAX - MIN));
      setStandardizedRate(standardized.toFixed(2));
      setEvaluation("Average");
    } else {
      setStandardizedRate("100");
      setEvaluation("Good");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Poverty Rate Standardization</h2>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Population Below $1.25 PPP a Day:
        </label>
        <input
          type="number"
          value={povertyPopulation}
          onChange={(e) => setPovertyPopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter population below $1.25 PPP"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Total Population:</label>
        <input
          type="number"
          value={totalPopulation}
          onChange={(e) => setTotalPopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter total population"
        />
      </div>

      <button
        onClick={calculatePovertyRate}
        className="p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition"
      >
        Calculate Standardized Rate
      </button>

      {standardizedRate !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Standardized Poverty Rate: {standardizedRate}
          </h3>
          <h3 className="text-lg">
            Evaluation: {evaluation}
          </h3>
        </div>
      )}
    </div>
  );
};

export default PovertyRateStandardization;
