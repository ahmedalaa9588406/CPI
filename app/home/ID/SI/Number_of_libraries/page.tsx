"use client";
import React, { useState } from "react";

function PublicLibrariesForm() {
  const [numLibraries, setNumLibraries] = useState("");
  const [totalPopulation, setTotalPopulation] = useState("");
  const [librariesDensity, setLibrariesDensity] = useState<string | null>(null);
  const [standardizedLibraries, setStandardizedLibraries] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);

  // Constants for standardization
  const MIN = 1; // Minimum benchmark for libraries density
  const MAX = 7; // Maximum benchmark for libraries density

  const calculateLibrariesDensity = () => {
    const numericPopulation = Number(totalPopulation);
    if (numericPopulation > 0) {
      const numericLibraries = Number(numLibraries);
      const density = (numericLibraries / numericPopulation) * 100000;

      // Standardization
      let standardizedDensity = 100000 * ((density - MIN) / (MAX - MIN));

      // Clamp values
      if (standardizedDensity > 100) {
        standardizedDensity = 100;
      } else if (standardizedDensity < 0) {
        standardizedDensity = 0;
      }

      setLibrariesDensity(density.toFixed(2));
      setStandardizedLibraries(standardizedDensity);

      // Decision-making
      if (standardizedDensity >= 7) {
        setDecision("Excellent");
      } else if (standardizedDensity >1 && standardizedDensity < 7) {
        setDecision("Good");
      } else {
        setDecision("Needs Improvement");
      }
    } else {
      alert("Total population must be greater than zero.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Calculate Public Libraries Density
      </h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Number of Public Libraries:
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={numLibraries}
            onChange={(e) => setNumLibraries(e.target.value)}
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
        onClick={calculateLibrariesDensity}
      >
        Calculate
      </button>
      {librariesDensity !== null && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-lg">
            Public Libraries Density: {librariesDensity} per 100,000 people
          </p>
          <p className="text-sm text-gray-600">Standardized Libraries Density:</p>
          <ul className="list-disc pl-5">
            <li>Standardized Score: {standardizedLibraries?.toFixed(2)}%</li>
          </ul>
          {decision && (
            <p
              className={`mt-4 p-2 text-center font-bold text-white rounded-md ${
                decision === "Excellent"
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

export default PublicLibrariesForm;
