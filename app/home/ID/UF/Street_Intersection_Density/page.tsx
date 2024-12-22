"use client";

import React, { useState } from "react";

function StreetIntersectionDensityForm() {
  const [intersectionCount, setIntersectionCount] = useState("");
  const [urbanArea, setUrbanArea] = useState("");
  const [density, setDensity] = useState<number | null>(null);
  const [standardizedScore, setStandardizedScore] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);

  // Constants
  const BENCHMARK = 100; // Benchmark density value (intersections per km²)

  const calculateStreetIntersectionDensity = () => {
    const numericIntersectionCount = parseFloat(intersectionCount);
    const numericUrbanArea = parseFloat(urbanArea);

    if (numericIntersectionCount > 0 && numericUrbanArea > 0) {
      // Calculate Street Intersection Density
      const streetIntersectionDensity =
        numericIntersectionCount / numericUrbanArea;
      setDensity(streetIntersectionDensity);

      // Standardized Score Calculation
      let standardizedScoreValue: number;
      if (streetIntersectionDensity < 0) {
        standardizedScoreValue = 0;
      } else if (streetIntersectionDensity >= BENCHMARK) {
        standardizedScoreValue = 100;
      } else {
        standardizedScoreValue =
          100 *
          (1 -
            Math.abs(
              (streetIntersectionDensity - BENCHMARK) / BENCHMARK
            ));
      }
      setStandardizedScore(standardizedScoreValue);

      // Decision
      if (streetIntersectionDensity < 0) {
        setDecision("Invalid street intersection density.");
      } else if (streetIntersectionDensity >= BENCHMARK) {
        setDecision("Intersection density is excellent.");
      } else {
        setDecision("Intersection density is below the desired benchmark.");
      }
    } else {
      alert("Both intersection count and urban area must be positive numbers.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Street Intersection Density Calculator
      </h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Total Number of Intersections:
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={intersectionCount}
            onChange={(e) => setIntersectionCount(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Urban Area (in km²):
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={urbanArea}
            onChange={(e) => setUrbanArea(e.target.value)}
            required
          />
        </label>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={calculateStreetIntersectionDensity}
      >
        Calculate
      </button>
      {(density !== null || standardizedScore !== null) && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          {density !== null && (
            <p className="text-lg">
              Street Intersection Density: {density.toFixed(2)} intersections/km²
            </p>
          )}
          {standardizedScore !== null && (
            <p className="text-lg">
              Standardized Score: {standardizedScore.toFixed(2)}%
            </p>
          )}
          {decision && (
            <p
              className={`mt-4 p-2 text-center font-bold text-white rounded-md ${
                decision === "Intersection density is excellent."
                  ? "bg-green-500"
                  : decision ===
                    "Intersection density is below the desired benchmark."
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

export default StreetIntersectionDensityForm;
