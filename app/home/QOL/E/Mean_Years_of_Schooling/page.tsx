"use client";

import React, { useState } from "react";

function MeanYearsOfSchoolingCalculator() {
  const [proportion, setProportion] = useState<string>(""); // HS (proportion of population)
  const [duration, setDuration] = useState<string>(""); // YS (official duration of education)
  const [meanYears, setMeanYears] = useState<string>(""); // Input for already known mean years
  const [meanResult, setMeanResult] = useState<string | null>(null);
  const [standardizedResult, setStandardizedResult] = useState<string | null>(
    null
  );

  // Function to calculate Mean Years of Schooling
  const calculateMeanYears = () => {
    const hs = parseFloat(proportion);
    const ys = parseFloat(duration);
    const knownMean = parseFloat(meanYears);

    if (!isNaN(hs) && !isNaN(ys) && hs > 0 && ys > 0) {
      const meanYearsOfSchooling = hs * ys; // Weighted calculation
      setMeanResult(meanYearsOfSchooling.toFixed(2));

      // Standardization logic
      const minYears = 0;
      const maxYears = 14;

      let standardized;
      if (meanYearsOfSchooling >= maxYears) {
        standardized = 100;
      } else if (meanYearsOfSchooling <= minYears) {
        standardized = 0;
      } else {
        // Including absolute value around the numerator
        standardized =
          100 *
          (1 - Math.abs(maxYears - meanYearsOfSchooling) / (maxYears - minYears));
      }

      setStandardizedResult(standardized.toFixed(2));
    } else if (!isNaN(knownMean)) {
      // If directly using known Mean Years of Schooling
      const minYears = 0;
      const maxYears = 14;

      let standardized;
      if (knownMean >= maxYears) {
        standardized = 100;
      } else if (knownMean <= minYears) {
        standardized = 0;
      } else {
        // Including absolute value around the numerator
        standardized =
          100 *
          (1 - Math.abs(maxYears - knownMean) / (maxYears - minYears));
      }

      setMeanResult(knownMean.toFixed(2));
      setStandardizedResult(standardized.toFixed(2));
    } else {
      alert("Please provide valid inputs for either calculation path.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Mean Years of Schooling Calculator</h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          HS: Proportion of Population (%):
        </label>
        <input
          type="number"
          value={proportion}
          onChange={(e) => setProportion(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter proportion of population"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          YS: Official Duration of Education (Years):
        </label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter duration of education"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Known Mean Years of Schooling (Optional):
        </label>
        <input
          type="number"
          value={meanYears}
          onChange={(e) => setMeanYears(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter known mean years of schooling"
        />
      </div>

      <button
        onClick={calculateMeanYears}
        className="p-2 bg-blue-500 text-white rounded w-full"
      >
        Calculate Mean Years of Schooling
      </button>

      {meanResult && (
        <div className="mt-4">
          <p className="text-xl font-bold">
            Mean Years of Schooling: {meanResult}
          </p>
        </div>
      )}

      {standardizedResult && (
        <div className="mt-4">
          <p className="text-xl font-bold">
            Standardized Mean Years of Schooling: {standardizedResult}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Standardization uses the range of 0 to 14 years for normalization.
          </p>
        </div>
      )}
    </div>
  );
}

export default MeanYearsOfSchoolingCalculator;
