"use client";

import React, { useState } from "react";

const AccessibilityToOpenPublicArea: React.FC = () => {
  const [population, setPopulation] = useState<string>(""); // Input: total city population
  const [lessThan400mPopulation, setLessThan400mPopulation] = useState<string>(""); // Input: population within 400m of open public area
  const [urbanArea, setUrbanArea] = useState<string>(""); // Input: total urban area
  const [lessThan400mUrbanArea, setLessThan400mUrbanArea] = useState<string>(""); // Input: urban area within 400m of open public area
  const [methodology, setMethodology] = useState<"A" | "B" | null>(null); // Chosen methodology
  const [accessibilityRate, setAccessibilityRate] = useState<string | null>(null);

  const calculateAccessibility = () => {
    if (methodology === "A") {
      const populationValue = parseFloat(population);
      const lessThan400mPopulationValue = parseFloat(lessThan400mPopulation);

      if (populationValue <= 0) {
        alert("Total population must be greater than zero.");
        return;
      }
      // Methodology A calculation
      const rate = (100 * lessThan400mPopulationValue) / populationValue;
      setAccessibilityRate(rate.toFixed(2));
    } else if (methodology === "B") {
      const urbanAreaValue = parseFloat(urbanArea);
      const lessThan400mUrbanAreaValue = parseFloat(lessThan400mUrbanArea);

      if (urbanAreaValue <= 0) {
        alert("Total urban area must be greater than zero.");
        return;
      }
      // Methodology B calculation
      const rate = (100 * lessThan400mUrbanAreaValue) / urbanAreaValue;
      setAccessibilityRate(rate.toFixed(2));
    } else {
      alert("Please select a methodology.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Accessibility to Open Public Area</h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Methodology:</label>
        <select
          value={methodology || ""}
          onChange={(e) => setMethodology(e.target.value as "A" | "B")}
          className="border rounded p-2 w-full"
        >
          <option value="">Select Methodology</option>
          <option value="A">Methodology A</option>
          <option value="B">Methodology B</option>
        </select>
      </div>

      {methodology === "A" && (
        <>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Total Population:</label>
            <input
              type="number"
              value={population}
              onChange={(e) => setPopulation(e.target.value)}
              className="border rounded p-2 w-full"
              placeholder="Enter total population"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Population Within 400m of Open Public Area:</label>
            <input
              type="number"
              value={lessThan400mPopulation}
              onChange={(e) => setLessThan400mPopulation(e.target.value)}
              className="border rounded p-2 w-full"
              placeholder="Enter population within 400m"
            />
          </div>
        </>
      )}

      {methodology === "B" && (
        <>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Total Urban Area:</label>
            <input
              type="number"
              value={urbanArea}
              onChange={(e) => setUrbanArea(e.target.value)}
              className="border rounded p-2 w-full"
              placeholder="Enter total urban area"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Urban Area Within 400m of Open Public Area:</label>
            <input
              type="number"
              value={lessThan400mUrbanArea}
              onChange={(e) => setLessThan400mUrbanArea(e.target.value)}
              className="border rounded p-2 w-full"
              placeholder="Enter urban area within 400m"
            />
          </div>
        </>
      )}

      <button
        onClick={calculateAccessibility}
        className="p-2 bg-blue-500 text-white rounded w-full"
      >
        Calculate Accessibility Rate
      </button>

      {accessibilityRate !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Accessibility Rate: {accessibilityRate}%
          </h3>
        </div>
      )}
    </div>
  );
};

export default AccessibilityToOpenPublicArea;
