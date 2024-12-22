"use client";

import React, { useState } from "react";

const WomenInLocalGovernment: React.FC = () => {
  const [womenInGovJobs, setWomenInGovJobs] = useState<number | string>(""); // Number of women in government jobs
  const [totalGovJobs, setTotalGovJobs] = useState<number | string>(""); // Total government jobs
  const [standardizedRate, setStandardizedRate] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<string | null>(null); // Decision evaluation

  // Benchmark
  const BENCHMARK = 50; // X* = 50%

  const calculateWomenInLocalGovernment = () => {
    const totalJobsValue = parseFloat(totalGovJobs.toString());
    if (totalJobsValue <= 0) {
      alert("Total government jobs must be greater than zero.");
      return;
    }

    // Women in the local government formula
    const womenInLocalGov = (parseFloat(womenInGovJobs.toString()) / totalJobsValue) * 100;

    // Standardized formula with absolute value
    const standardizedValue =
      100 * (1 - Math.abs((womenInLocalGov - BENCHMARK) / BENCHMARK));

    // Decision logic
    if (womenInLocalGov === 0 || womenInLocalGov >= 2 * BENCHMARK) {
      setStandardizedRate("0");
      setEvaluation("Bad");
    } else if (womenInLocalGov > 0 && womenInLocalGov < 2 * BENCHMARK) {
      setStandardizedRate(standardizedValue.toFixed(2));
      setEvaluation("Average");
    } else if (womenInLocalGov === BENCHMARK) {
      setStandardizedRate("100");
      setEvaluation("Good");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Women in the Local Government</h2>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Number of Women in Government Jobs:
        </label>
        <input
          type="number"
          value={womenInGovJobs}
          onChange={(e) => setWomenInGovJobs(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter number of women in government jobs"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Total Government Jobs:</label>
        <input
          type="number"
          value={totalGovJobs}
          onChange={(e) => setTotalGovJobs(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter total government jobs"
        />
      </div>

      <button
        onClick={calculateWomenInLocalGovernment}
        className="p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition"
      >
        Calculate Standardized Rate
      </button>

      {standardizedRate !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Standardized Women in Local Government: {standardizedRate}
          </h3>
          <h3 className="text-lg">
            Evaluation: {evaluation}
          </h3>
        </div>
      )}
    </div>
  );
};

export default WomenInLocalGovernment;
