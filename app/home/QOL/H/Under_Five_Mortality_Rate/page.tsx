"use client";

import React, { useState } from "react";

function UnderFiveMortalityRateCalculator() {
  const [underFiveDeaths, setUnderFiveDeaths] = useState<string>("");
  const [liveBirths, setLiveBirths] = useState<string>("");
  const [u5mr, setU5mr] = useState<string | null>(null);
  const [standardizedScore, setStandardizedScore] = useState<string | null>(null);
  const [decision, setDecision] = useState<string | null>(null);

  const MIN_U5MR = 2.20; // Minimum U5MR benchmark
  const MAX_U5MR = 181.60; // Maximum U5MR benchmark

  // Function to calculate U5MR and Standardized Score
  const calculateU5MR = () => {
    const deaths = parseFloat(underFiveDeaths);
    const births = parseFloat(liveBirths);

    if (!isNaN(deaths) && !isNaN(births) && births > 0) {
      const u5mrValue = (deaths / births) * 1000; // U5MR formula
      setU5mr(u5mrValue.toFixed(2));

      // Standardized Score Calculation
      const lnU5MR = Math.log(u5mrValue);
      let standardized = 0;

      if (lnU5MR >= Math.log(5.20)) {
        standardized = 0;
      } else if (Math.log(0.79) <= lnU5MR && lnU5MR < Math.log(5.20)) {
        standardized =
          100 *
          (1 -
            (lnU5MR - Math.log(MIN_U5MR)) /
              (Math.log(MAX_U5MR) - Math.log(MIN_U5MR)));
      } else if (lnU5MR < Math.log(0.79)) {
        standardized = 100;
      }

      setStandardizedScore(standardized.toFixed(2));

      // Decision Based on Standardized Score
      let decisionText = "";
      if (lnU5MR >= Math.log(5.20)) {
        decisionText = "Decision: U5MR is critical (Score = 0).";
      } else if (Math.log(0.79) <= lnU5MR && lnU5MR < Math.log(5.20)) {
        decisionText = "Decision: U5MR requires attention (Score < 100).";
      } else if (lnU5MR < Math.log(0.79)) {
        decisionText = "Decision: U5MR is excellent (Score = 100).";
      }
      setDecision(decisionText);
    } else {
      alert("Please ensure valid input for deaths and live births.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Under-Five Mortality Rate (U5MR) Calculator</h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Number of Under-Five Deaths:</label>
        <input
          type="number"
          value={underFiveDeaths}
          onChange={(e) => setUnderFiveDeaths(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter number of under-five deaths"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Number of Live Births:</label>
        <input
          type="number"
          value={liveBirths}
          onChange={(e) => setLiveBirths(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter number of live births"
        />
      </div>

      <button
        onClick={calculateU5MR}
        className="p-2 bg-green-500 text-white rounded w-full"
      >
        Calculate U5MR
      </button>

      {u5mr && (
        <div className="mt-4">
          <p className="text-xl font-bold">U5MR: {u5mr} per 1,000 live births</p>
          {standardizedScore && (
            <>
              <p className="text-lg font-semibold mt-2">
                Standardized Score: {standardizedScore}%
              </p>
              {decision && (
                <p className="text-lg font-semibold mt-2 text-blue-600">
                  {decision}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default UnderFiveMortalityRateCalculator;
