"use client";

import React, { useState } from "react";

const SlumHouseholdsStandardization: React.FC = () => {
  const [slumPopulation, setSlumPopulation] = useState<number | string>(""); // Input: number of people living in slums
  const [cityPopulation, setCityPopulation] = useState<number | string>(""); // Input: total city population
  const [standardizedRate, setStandardizedRate] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<string | null>(null); // Decision evaluation

  // Constants for benchmarks
  const MIN = 0; // Min = 0%
  const MAX = 80; // Max = 80%

  const calculateSlumHouseholds = () => {
    const cityPopValue = parseFloat(cityPopulation.toString());
    if (cityPopValue <= 0) {
      alert("City population must be greater than zero.");
      return;
    }

    // Slum Households calculation
    const slumHouseholds = (100 * parseFloat(slumPopulation.toString())) / cityPopValue;

    // Decision logic
    if (slumHouseholds >= MAX) {
      setStandardizedRate("0");
      setEvaluation("Bad");
    } else if (slumHouseholds > MIN) {
      const standardized =
        100 * (1 - (slumHouseholds - MIN) / (MAX - MIN));
      setStandardizedRate(standardized.toFixed(2));
      setEvaluation("Average");
    } else {
      setStandardizedRate("100");
      setEvaluation("Good");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Slum Households Standardization</h2>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Number of People Living in Slum:
        </label>
        <input
          type="number"
          value={slumPopulation}
          onChange={(e) => setSlumPopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter number of people living in slums"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">City Population:</label>
        <input
          type="number"
          value={cityPopulation}
          onChange={(e) => setCityPopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter total city population"
        />
      </div>

      <button
        onClick={calculateSlumHouseholds}
        className="p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition"
      >
        Calculate Standardized Rate
      </button>

      {standardizedRate !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Standardized Slum Households Rate: {standardizedRate}
          </h3>
          <h3 className="text-lg">
            Evaluation: {evaluation}
          </h3>
        </div>
      )}
    </div>
  );
};

export default SlumHouseholdsStandardization;
