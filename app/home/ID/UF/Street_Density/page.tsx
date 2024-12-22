"use client";

import React, { useState } from "react";

function StreetDensityCalculator() {
  const [totalUrbanStreets, setTotalUrbanStreets] = useState("");
  const [totalUrbanSurface, setTotalUrbanSurface] = useState("");
  const [density, setDensity] = useState<number | null>(null);
  const [standardizedScore, setStandardizedScore] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);

  // Constants
  const BENCHMARK = 20; // Benchmark density value (km/km²)

  const calculateStreetDensity = () => {
    const numericTotalUrbanStreets = parseFloat(totalUrbanStreets);
    const numericTotalUrbanSurface = parseFloat(totalUrbanSurface);

    if (numericTotalUrbanStreets > 0 && numericTotalUrbanSurface > 0) {
      // Calculate Street Density
      const streetDensity =
        numericTotalUrbanStreets / numericTotalUrbanSurface;
      setDensity(streetDensity);

      // Standardized Score Calculation
      let standardizedScoreValue: number;
      if (streetDensity === 0 || streetDensity === 2 * BENCHMARK) {
        standardizedScoreValue = 0;
      } else if (streetDensity === BENCHMARK) {
        standardizedScoreValue = 100;
      } else if (streetDensity > 0 && streetDensity < 2 * BENCHMARK) {
        standardizedScoreValue =
          100 *
          (1 -
            Math.abs((streetDensity - BENCHMARK) / BENCHMARK));
      } else {
        standardizedScoreValue = 0;
      }
      setStandardizedScore(standardizedScoreValue);

      // Decision
      if (streetDensity === 0 || streetDensity === 2 * BENCHMARK) {
        setDecision("Invalid street density (boundary condition).");
      } else if (streetDensity === BENCHMARK) {
        setDecision("Street density meets the benchmark.");
      } else if (streetDensity > 0 && streetDensity < 2 * BENCHMARK) {
        setDecision("Street density is within acceptable range.");
      } else {
        setDecision("Street density exceeds acceptable range.");
      }
    } else {
      alert(
        "Both total length of urban streets and total urban surface must be positive numbers."
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Street Density Calculator
      </h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Total Length of Urban Streets (in km):
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={totalUrbanStreets}
            onChange={(e) => setTotalUrbanStreets(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Total Urban Surface (in km²):
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={totalUrbanSurface}
            onChange={(e) => setTotalUrbanSurface(e.target.value)}
            required
          />
        </label>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={calculateStreetDensity}
      >
        Calculate
      </button>
      {(density !== null || standardizedScore !== null) && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          {density !== null && (
            <p className="text-lg">
              Street Density: {density.toFixed(2)} km/km²
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
                decision === "Street density meets the benchmark."
                  ? "bg-green-500"
                  : decision === "Street density is within acceptable range."
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

export default StreetDensityCalculator;
