"use client";
import React, { useState } from "react";

const EmploymentToPopulationRatioCalculator: React.FC = () => {
  const [employed, setEmployed] = useState<number | undefined>();
  const [workingAgePopulation, setWorkingAgePopulation] = useState<number | undefined>();
  const [epr, setEpr] = useState<number>(0); // Employment to Population Ratio
  const [standardizedEpr, setStandardizedEpr] = useState<number>(0); // Standardized EPR
  const [decision, setDecision] = useState<string>("");

  const min = 30.5; // Minimum benchmark
  const max = 75.0; // Maximum benchmark

  const calculateEPR = () => {
    if (!workingAgePopulation || workingAgePopulation === 0) {
      alert("Working age population cannot be zero.");
      return;
    }

    if (!employed || employed < 0) {
      alert("Please enter a valid number of employed people.");
      return;
    }

    // Calculate Employment to Population Ratio (EPR)
    const ratio = (employed / workingAgePopulation) * 100;
    setEpr(ratio);

    // Standardized EPR Formula
    const standardized = 100 * ((ratio - min) / (max - min));
    setStandardizedEpr(standardized);

    // Decision Logic
    if (ratio >= max) {
      setDecision("Good");
    } else if (ratio > min && ratio < max) {
      setDecision("Moderate");
    } else {
      setDecision("Bad");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-10 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Employment to Population Ratio (EPR) Calculator
      </h1>

      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Total Number of Employed People:
        </label>
        <input
          type="number"
          value={employed !== undefined ? employed : ""}
          onChange={(e) => setEmployed(Number(e.target.value) || undefined)}
          className="border rounded-lg p-4 w-full text-lg"
          placeholder="Enter number of employed people"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Working Age Population:
        </label>
        <input
          type="number"
          value={workingAgePopulation !== undefined ? workingAgePopulation : ""}
          onChange={(e) => setWorkingAgePopulation(Number(e.target.value) || undefined)}
          className="border rounded-lg p-4 w-full text-lg"
          placeholder="Enter working age population"
        />
      </div>

      <button
        onClick={calculateEPR}
        className="p-4 bg-blue-600 text-white rounded-lg w-full text-xl hover:bg-blue-700 transition"
      >
        Calculate EPR
      </button>

      {decision && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-4">
            Employment to Population Ratio (EPR): {epr.toFixed(2)}%
          </h2>
          <h2 className="text-xl font-semibold mb-4">
            Standardized EPR: {standardizedEpr.toFixed(2)}
          </h2>
          <h2 className="text-xl font-semibold">
            Decision:{" "}
            <span
              className={`${
                decision === "Good"
                  ? "text-green-600"
                  : decision === "Moderate"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {decision}
            </span>
          </h2>
        </div>
      )}
    </div>
  );
};

export default EmploymentToPopulationRatioCalculator;
