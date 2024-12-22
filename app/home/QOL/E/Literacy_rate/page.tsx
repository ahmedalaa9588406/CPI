"use client";

import React, { useState } from "react";

function LiteracyRateCalculator() {
  const [literatePopulation, setLiteratePopulation] = useState<string>("");
  const [totalPopulation, setTotalPopulation] = useState<string>("");
  const [literacyRate, setLiteracyRate] = useState<string | null>(null);
  const [standardizedRate, setStandardizedRate] = useState<string | null>(null);

  // Function to calculate Literacy Rate
  const calculateLiteracyRate = () => {
    const literate = parseFloat(literatePopulation);
    const total = parseFloat(totalPopulation);

    if (!isNaN(literate) && !isNaN(total) && total > 0) {
      const rate = (literate / total) * 100;
      setLiteracyRate(rate.toFixed(2));

      // Standardization logic
      const min = 15.0;
      const max = 99.9;

      let standardized;
      if (rate >= max) {
        standardized = 100;
      } else if (rate <= min) {
        standardized = 0;
      } else {
        standardized = 100 * ((rate - min) / (max - min));
      }

      setStandardizedRate(standardized.toFixed(2));
    } else {
      alert("Please provide valid inputs for both fields.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Literacy Rate Calculator</h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Literate Population (15 years and over):
        </label>
        <input
          type="number"
          value={literatePopulation}
          onChange={(e) => setLiteratePopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter literate population"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Total Population (15 years and over):
        </label>
        <input
          type="number"
          value={totalPopulation}
          onChange={(e) => setTotalPopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter total population"
        />
      </div>

      <button
        onClick={calculateLiteracyRate}
        className="p-2 bg-blue-500 text-white rounded w-full"
      >
        Calculate Literacy Rate
      </button>

      {literacyRate && (
        <div className="mt-4">
          <p className="text-xl font-bold">
            Literacy Rate: {literacyRate}%
          </p>
        </div>
      )}

      {standardizedRate && (
        <div className="mt-4">
          <p className="text-xl font-bold">
            Standardized Literacy Rate: {standardizedRate}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Standardization uses the formula based on a range of 15.0% to 99.9%.
          </p>
        </div>
      )}
    </div>
  );
}

export default LiteracyRateCalculator;
