"use client";

import React, { useState } from "react";

function HomicideRateCalculator() {
  const [homicides, setHomicides] = useState<string>(""); // Number of homicides
  const [cityPopulation, setCityPopulation] = useState<string>(""); // Total city population
  const [homicideRate, setHomicideRate] = useState<string | null>(null);
  const [standardizedRate, setStandardizedRate] = useState<string | null>(null);

  // Constants for calculation
  const MIN_HOMICIDE_RATE = 1; // Minimum benchmark (homicides per 100,000)
  const MAX_HOMICIDE_RATE = 1654; // Maximum benchmark (homicides per 100,000)
  const LN_MIN = Math.log(MIN_HOMICIDE_RATE);
  const LN_MAX = Math.log(MAX_HOMICIDE_RATE);

  // Function to calculate the homicide rate
  const calculateHomicideRate = () => {
    const homicidesCount = parseFloat(homicides);
    const population = parseFloat(cityPopulation);

    if (!isNaN(homicidesCount) && !isNaN(population) && population > 0) {
      const rate = (homicidesCount / population) * 100000;
      setHomicideRate(rate.toFixed(2));
      calculateStandardizedRate(rate);
    } else {
      alert("Please provide valid inputs for the calculation.");
    }
  };

  // Function to calculate the standardized rate
  const calculateStandardizedRate = (rate: number) => {
    if (rate <= 0) {
      setStandardizedRate("100");
    } else {
      const lnRate = Math.log(rate);
      if (lnRate >= 7.41) {
        setStandardizedRate("0");
      } else if (lnRate > 0) {
        const standardized =
          100 * (1 - (lnRate - LN_MIN) / (LN_MAX - LN_MIN));
        setStandardizedRate(standardized.toFixed(2));
      } else {
        setStandardizedRate("100");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Homicide Rate Calculator</h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Number of Homicides:</label>
        <input
          type="number"
          value={homicides}
          onChange={(e) => setHomicides(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter the number of homicides"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">City Population:</label>
        <input
          type="number"
          value={cityPopulation}
          onChange={(e) => setCityPopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter the city population"
        />
      </div>

      <button
        onClick={calculateHomicideRate}
        className="p-2 bg-blue-500 text-white rounded w-full"
      >
        Calculate Homicide Rate
      </button>

      {homicideRate && (
        <div className="mt-4">
          <p className="text-lg">
            <strong>Homicide Rate:</strong> {homicideRate} per 100,000
          </p>
        </div>
      )}

      {standardizedRate && (
        <div className="mt-4">
          <p className="text-lg">
            <strong>Standardized Homicide Rate:</strong> {standardizedRate}
          </p>
        </div>
      )}
    </div>
  );
}

export default HomicideRateCalculator;
