"use client";

import React, { useState } from "react";

function VaccinationCoverageCalculator() {
  const [immunizedPopulation, setImmunizedPopulation] = useState<string>("");
  const [eligiblePopulation, setEligiblePopulation] = useState<string>("");
  const [vaccinationCoverage, setVaccinationCoverage] = useState<string | null>(null);

  // Function to calculate Vaccination Coverage
  const calculateCoverage = () => {
    const immunized = parseFloat(immunizedPopulation);
    const eligible = parseFloat(eligiblePopulation);

    if (!isNaN(immunized) && !isNaN(eligible) && eligible > 0) {
      let coverage = (immunized / eligible) * 100;

      // Ensure that if the value surpasses 100%, it is capped at 100%.
      if (coverage > 100) {
        coverage = 100;
      }

      setVaccinationCoverage(coverage.toFixed(2));
    } else {
      alert("Please provide valid inputs for both fields.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Vaccination Coverage Calculator</h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Population Immunized (according to national policies):
        </label>
        <input
          type="number"
          value={immunizedPopulation}
          onChange={(e) => setImmunizedPopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter immunized population"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Eligible Population (according to national policies):
        </label>
        <input
          type="number"
          value={eligiblePopulation}
          onChange={(e) => setEligiblePopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter eligible population"
        />
      </div>

      <button
        onClick={calculateCoverage}
        className="p-2 bg-blue-500 text-white rounded w-full"
      >
        Calculate Vaccination Coverage
      </button>

      {vaccinationCoverage && (
        <div className="mt-4">
          <p className="text-xl font-bold">
            Vaccination Coverage: {vaccinationCoverage}%
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Note: If the calculated percentage exceeds 100%, it is capped at
            100%.
          </p>
        </div>
      )}
    </div>
  );
}

export default VaccinationCoverageCalculator;
