"use client";
import React, { useState } from "react";

function PhysicianDensityForm() {
  const [physicians, setPhysicians] = useState("");
  const [totalPopulation, setTotalPopulation] = useState("");
  const [physicianDensity, setPhysicianDensity] = useState<string | null>(null);
  const [standardizedDensity, setStandardizedDensity] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);

  // Constants for benchmarking
  const MIN = 0.01;
  const MAX = 7.74;

  const calculatePhysicianDensity = () => {
    const numericPopulation = Number(totalPopulation);
    if (numericPopulation > 0) {
      const numericPhysicians = Number(physicians);
      const density = (numericPhysicians / numericPopulation) * 1000;

      // Calculate Standardized Physician Density (S)
      let standardized = 1000 * ((Math.pow(density,0.5) - 0.1) / (2.78 - 0.1));

      // Cap at 100 if it exceeds, or set to 0 if it's below 0
      if (standardized > 100) {
        standardized = 100;
      } else if (standardized < 0) {
        standardized = 0;
      }

      setPhysicianDensity(density.toFixed(2));
      setStandardizedDensity(standardized);

      // Determine decision message
      if (Math.pow(density,0.5) >= MAX) {
        setDecision("Perfect");
      } else if (Math.pow(density,0.5) > MIN && Math.pow(density,0.5) < MAX) {
        setDecision("Good");
      } else {
        setDecision("Poor");
      }
    } else {
      alert("Total population must be greater than zero.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Calculate Physician Density
      </h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Number of Physicians:
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={physicians}
            onChange={(e) => setPhysicians(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Total Population:
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={totalPopulation}
            onChange={(e) => setTotalPopulation(e.target.value)}
            required
          />
        </label>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={calculatePhysicianDensity}
      >
        Calculate
      </button>
      {physicianDensity !== null && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-lg">Physician Density: {physicianDensity} per 1,000 people</p>
          <p className="text-sm text-gray-600">Standardized Physician Density (S):</p>
          <ul className="list-disc pl-5">
            <li>Standardized Value: {standardizedDensity?.toFixed(2)}%</li>
          </ul>
          {decision && (
            <p
              className={`mt-4 p-2 text-center font-bold text-white rounded-md ${
                decision === "Perfect"
                  ? "bg-green-500"
                  : decision === "Good"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            >
              {decision}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default PhysicianDensityForm;
