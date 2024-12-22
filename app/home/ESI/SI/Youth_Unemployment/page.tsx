"use client";

import React, { useState } from "react";

const YouthUnemploymentStandardization: React.FC = () => {
  const [unemployedYouth, setUnemployedYouth] = useState<number | string>(""); // Input: number of unemployed young persons
  const [youthLaborForce, setYouthLaborForce] = useState<number | string>(""); // Input: total youth labor force
  const [standardizedRate, setStandardizedRate] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<string | null>(null); // Decision evaluation

  // Constants for benchmarks
  const MIN = 2.7; // Min = 2.7%
  const MAX = 62.8; // Max = 62.8%

  const calculateYouthUnemployment = () => {
    const laborForceValue = parseFloat(youthLaborForce.toString());
    if (laborForceValue <= 0) {
      alert("Youth labor force must be greater than zero.");
      return;
    }

    // Youth Unemployment calculation
    const unemploymentRate = (100 * parseFloat(unemployedYouth.toString())) / laborForceValue;
    const fourthRootUnemployment = Math.pow(unemploymentRate, 1 / 4); // Fourth root

    // Decision logic
    if (fourthRootUnemployment >= Math.pow(2.82, 1 / 4)) {
      setStandardizedRate("0");
      setEvaluation("Bad");
    } else if (fourthRootUnemployment > Math.pow(1.28, 1 / 4)) {
      const standardized =
        100 *
        (1 -
          (fourthRootUnemployment - Math.pow(MIN, 1 / 4)) /
            (Math.pow(MAX, 1 / 4) - Math.pow(MIN, 1 / 4)));
      setStandardizedRate(standardized.toFixed(2));
      setEvaluation("Average");
    } else {
      setStandardizedRate("100");
      setEvaluation("Good");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Youth Unemployment Standardization</h2>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Number of Unemployed Youth:
        </label>
        <input
          type="number"
          value={unemployedYouth}
          onChange={(e) => setUnemployedYouth(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter number of unemployed youth"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Youth Labor Force:</label>
        <input
          type="number"
          value={youthLaborForce}
          onChange={(e) => setYouthLaborForce(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter total youth labor force"
        />
      </div>

      <button
        onClick={calculateYouthUnemployment}
        className="p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition"
      >
        Calculate Standardized Rate
      </button>

      {standardizedRate !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Standardized Youth Unemployment Rate: {standardizedRate}
          </h3>
          <h3 className="text-lg">
            Evaluation: {evaluation}
          </h3>
        </div>
      )}
    </div>
  );
};

export default YouthUnemploymentStandardization;
