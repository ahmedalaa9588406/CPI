"use client";

import React, { useState } from "react";

const WomenInWorkforce: React.FC = () => {
  const [womenInWorkforce, setWomenInWorkforce] = useState<number | string>(""); // Number of women in non-agricultural paid employment
  const [totalNonAgriEmployment, setTotalNonAgriEmployment] = useState<number | string>(""); // Total number of people in non-agricultural paid employment
  const [standardizedRate, setStandardizedRate] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<string | null>(null); // Decision evaluation

  // Benchmark
  const BENCHMARK = 50; // X* = 50%

  const calculateWomenInWorkforce = () => {
    const totalEmploymentValue = parseFloat(totalNonAgriEmployment.toString());
    if (totalEmploymentValue <= 0) {
      alert("Total number of people in non-agricultural employment must be greater than zero.");
      return;
    }

    // Women in the workforce formula
    const workforcePercentage = (parseFloat(womenInWorkforce.toString()) / totalEmploymentValue) * 100;

    // Standardized formula with absolute value
    const standardizedValue =
      100 * (1 - Math.abs((workforcePercentage - BENCHMARK) / BENCHMARK));

    // Decision logic
    if (workforcePercentage === 0 || workforcePercentage >= 2 * BENCHMARK) {
      setStandardizedRate("0");
      setEvaluation("Bad");
    } else if (workforcePercentage > 0 && workforcePercentage < 2 * BENCHMARK) {
      setStandardizedRate(standardizedValue.toFixed(2));
      setEvaluation("Average");
    } else if (workforcePercentage === BENCHMARK) {
      setStandardizedRate("100");
      setEvaluation("Good");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Women in the Workforce</h2>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Number of Women in Non-Agricultural Paid Employment:
        </label>
        <input
          type="number"
          value={womenInWorkforce}
          onChange={(e) => setWomenInWorkforce(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter number of women"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Total Number of People in Non-Agricultural Paid Employment:
        </label>
        <input
          type="number"
          value={totalNonAgriEmployment}
          onChange={(e) => setTotalNonAgriEmployment(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter total employment"
        />
      </div>

      <button
        onClick={calculateWomenInWorkforce}
        className="p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition"
      >
        Calculate Standardized Rate
      </button>

      {standardizedRate !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Standardized Women in Workforce: {standardizedRate}
          </h3>
          <h3 className="text-lg">
            Evaluation: {evaluation}
          </h3>
        </div>
      )}
    </div>
  );
};

export default WomenInWorkforce;
