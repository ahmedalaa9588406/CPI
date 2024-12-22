"use client";

import React, { useState } from "react";

function MaternalMortalityCalculator() {
  const [maternalDeaths, setMaternalDeaths] = useState<string>("");
  const [liveBirths, setLiveBirths] = useState<string>("");
  const [maternalMortality, setMaternalMortality] = useState<string | null>(null);
  const [standardizedMortality, setStandardizedMortality] = useState<string | null>(null);

  // Function to calculate Maternal Mortality
  const calculateMaternalMortality = () => {
    const deaths = parseFloat(maternalDeaths);
    const births = parseFloat(liveBirths);

    if (!isNaN(deaths) && !isNaN(births) && births > 0) {
      const mortality = (deaths / births) * 100000;
      setMaternalMortality(mortality.toFixed(2));

      // Standardization logic
      const min = 1;
      const max = 1100;
      const lnMortality = Math.log(mortality);

      let standardized;
      if (lnMortality >= Math.log(max)) {
        standardized = 0;
      } else if (lnMortality <= Math.log(min)) {
        standardized = 100;
      } else {
        standardized =
          100 * (1 - (lnMortality - Math.log(min)) / (Math.log(max) - Math.log(min)));
      }

      setStandardizedMortality(standardized.toFixed(2));
    } else {
      alert("Please provide valid inputs for both fields.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Maternal Mortality Calculator</h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Maternal Deaths:
        </label>
        <input
          type="number"
          value={maternalDeaths}
          onChange={(e) => setMaternalDeaths(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter maternal deaths"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Live Births:</label>
        <input
          type="number"
          value={liveBirths}
          onChange={(e) => setLiveBirths(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter live births"
        />
      </div>

      <button
        onClick={calculateMaternalMortality}
        className="p-2 bg-blue-500 text-white rounded w-full"
      >
        Calculate Maternal Mortality
      </button>

      {maternalMortality && (
        <div className="mt-4">
          <p className="text-xl font-bold">
            Maternal Mortality: {maternalMortality} deaths per 100,000 live births
          </p>
        </div>
      )}

      {standardizedMortality && (
        <div className="mt-4">
          <p className="text-xl font-bold">
            Standardized Maternal Mortality: {standardizedMortality}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Standardization is based on logarithmic normalization between 1 and 1100.
          </p>
        </div>
      )}
    </div>
  );
}

export default MaternalMortalityCalculator;
