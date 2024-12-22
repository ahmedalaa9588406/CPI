"use client";

import React, { useState } from "react";

const LocalExpenditureIndicator: React.FC = () => {
  const [realExpenditure, setRealExpenditure] = useState<number | string>("");
  const [estimatedExpenditure, setEstimatedExpenditure] = useState<number | string>("");

  const xStar = 100; // Benchmark value (100%)

  const calculateLocalExpenditure = () => {
    const realExp = Number(realExpenditure);
    const estimatedExp = Number(estimatedExpenditure);

    if (
      isNaN(realExp) ||
      isNaN(estimatedExp) ||
      realExp <= 0 ||
      estimatedExp <= 0
    ) {
      return "Invalid data";
    }

    const expenditureRatio = (realExp / estimatedExp) * 100;

    if (expenditureRatio === xStar) {
      return "100.00"; // Perfect match
    }

    const standardizedValue =
      100 *
      (1 -
        Math.abs((expenditureRatio - xStar) / (2 * xStar - xStar))); // Math.abs after 1 -
    return standardizedValue.toFixed(2); // Limit to 2 decimal places
  };

  const decisionLogic = () => {
    const realExp = Number(realExpenditure);
    const estimatedExp = Number(estimatedExpenditure);

    if (
      isNaN(realExp) ||
      isNaN(estimatedExp) ||
      realExp <= 0 ||
      estimatedExp <= 0
    ) {
      return "Invalid data";
    }

    const expenditureRatio = (realExp / estimatedExp) * 100;

    if (expenditureRatio === 0 || expenditureRatio >= 2 * xStar) {
      return "0 (Poor)";
    }
    if (expenditureRatio === xStar) {
      return "100 (Excellent)";
    }
    return "Moderate";
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Local Expenditure Indicator</h2>

      <p className="mb-4">
        This indicator measures the efficiency of local government budget predictions
        by comparing real local expenditure to estimated expenditure for the previous year.
      </p>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Real Local Expenditure:
        </label>
        <input
          type="number"
          value={realExpenditure}
          onChange={(e) => setRealExpenditure(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          placeholder="Enter real expenditure amount"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Estimated Expenditure:
        </label>
        <input
          type="number"
          value={estimatedExpenditure}
          onChange={(e) => setEstimatedExpenditure(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          placeholder="Enter estimated expenditure amount"
        />
      </div>

      <div className="mt-4">
        <p className="font-semibold">
          Local Expenditure Standardized Value:{" "}
          <span className="font-bold">{calculateLocalExpenditure()}</span>
        </p>
        <p className="font-semibold">
          Decision Logic:{" "}
          <span className="font-bold">{decisionLogic()}</span>
        </p>
      </div>
    </div>
  );
};

export default LocalExpenditureIndicator;
