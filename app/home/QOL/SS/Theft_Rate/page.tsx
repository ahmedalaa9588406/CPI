"use client";

import React, { useState } from "react";

const TheftRateStandardization: React.FC = () => {
  const [thefts, setThefts] = useState<string>(""); // Input: number of thefts
  const [population, setPopulation] = useState<string>(""); // Input: city population
  const [standardizedRate, setStandardizedRate] = useState<string | null>(null);
  const [decision, setDecision] = useState<string | null>(null); // Decision result

  // Constants for benchmarks
  const MIN = 25.45;
  const MAX = 6159.11;
  const ROOT_MIN = Math.pow(MIN, 0.25);
  const ROOT_MAX = Math.pow(MAX, 0.25);
  const ROOT_THRESHOLD_LOW = 2.24;
  const ROOT_THRESHOLD_HIGH = 8.86;

  const calculateTheftRate = () => {
    const theftsCount = parseFloat(thefts);
    const populationCount = parseFloat(population);

    if (populationCount <= 0) {
      alert("Population must be greater than zero.");
      return;
    }

    // Theft rate formula
    const theftRate = (100000 * theftsCount) / populationCount;
    const rootTheftRate = Math.pow(theftRate, 0.25);

    // Decision logic
    if (rootTheftRate >= ROOT_THRESHOLD_HIGH) {
      setStandardizedRate("0");
      setDecision("Bad - Very High Theft Rate");
    } else if (rootTheftRate > ROOT_THRESHOLD_LOW) {
      const standardized =
        100 * (1 - (rootTheftRate - ROOT_MIN) / (ROOT_MAX - ROOT_MIN));
      setStandardizedRate(standardized.toFixed(2));
      setDecision("In Between - Moderate Theft Rate");
    } else {
      setStandardizedRate("100");
      setDecision("Good - Low Theft Rate");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Theft Rate Standardization</h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Number of Thefts:</label>
        <input
          type="number"
          value={thefts}
          onChange={(e) => setThefts(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter the number of thefts"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">City Population:</label>
        <input
          type="number"
          value={population}
          onChange={(e) => setPopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter the city population"
        />
      </div>

      <button
        onClick={calculateTheftRate}
        className="p-2 bg-blue-500 text-white rounded w-full"
      >
        Calculate Standardized Rate
      </button>

      {standardizedRate !== null && (
        <div className="mt-4">
          <p className="text-lg">
            <strong>Standardized Theft Rate:</strong> {standardizedRate}
          </p>
          {decision && (
            <p className={`text-lg mt-2 font-bold ${
              decision.includes("Bad") ? "text-red-600" : 
              decision.includes("Good") ? "text-green-600" : 
              "text-yellow-600"
            }`}>
              <strong>Decision:</strong> {decision}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TheftRateStandardization;
