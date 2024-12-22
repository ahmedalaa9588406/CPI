"use client";

import React, { useState } from "react";

const OwnRevenueCollection: React.FC = () => {
  const [ownSourceRevenue, setOwnSourceRevenue] = useState<number | string>("");
  const [totalLocalRevenue, setTotalLocalRevenue] = useState<number | string>("");

  const calculateOwnRevenueCollection = () => {
    const ownRevenue = Number(ownSourceRevenue);
    const totalRevenue = Number(totalLocalRevenue);

    if (totalRevenue === 0 || isNaN(ownRevenue) || isNaN(totalRevenue)) {
      return "Invalid data";
    }

    const ownRevenuePercentage = (ownRevenue / totalRevenue) * 100;
    return ownRevenuePercentage.toFixed(2); // Limit to 2 decimal places
  };

  const standardizeOwnRevenueCollection = () => {
    const ownRevenueCollection = parseFloat(calculateOwnRevenueCollection());

    if (isNaN(ownRevenueCollection)) {
      return "Invalid data";
    }

    if (ownRevenueCollection >= 80) return 100;
    if (ownRevenueCollection <= 17) return 0;

    return (
      ((ownRevenueCollection - 17) / (80 - 17)) * 100
    ).toFixed(2); // Standardized value
  };

  const decisionLogic = () => {
    const standardizedValue = parseFloat(standardizeOwnRevenueCollection().toString());

    if (isNaN(standardizedValue)) return "Invalid data";
    if (standardizedValue === 100) return "Excellent";
    if (standardizedValue > 0 && standardizedValue < 100) return "Moderate";
    return "Low";
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Own Revenue Collection Indicator</h2>

      <p className="mb-4">
        This indicator calculates the proportion of own source revenue relative to total
        local revenue based on local fiscal accounts.
      </p>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Own Source Revenue:</label>
        <input
          type="number"
          value={ownSourceRevenue}
          onChange={(e) => setOwnSourceRevenue(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          placeholder="Enter own source revenue"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Total Local Revenue:</label>
        <input
          type="number"
          value={totalLocalRevenue}
          onChange={(e) => setTotalLocalRevenue(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          placeholder="Enter total local revenue"
        />
      </div>

      <div className="mt-4">
        <p className="font-semibold">
          Own Revenue Collection:{" "}
          <span className="font-bold">{calculateOwnRevenueCollection()}%</span>
        </p>
        <p className="font-semibold">
          Standardized Value:{" "}
          <span className="font-bold">{standardizeOwnRevenueCollection()}</span>
        </p>
        <p>
          Decision Logic:{" "}
          <span className="font-bold">{decisionLogic()}</span>
        </p>
      </div>
    </div>
  );
};

export default OwnRevenueCollection;
