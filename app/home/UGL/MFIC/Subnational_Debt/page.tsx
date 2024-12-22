"use client";

import React, { useState } from "react";

const SubnationalDebtIndicator: React.FC = () => {
  const [totalDebt, setTotalDebt] = useState<number | string>("");
  const [totalRevenue, setTotalRevenue] = useState<number | string>("");

  const xStar = 60; // Benchmark value (60%)

  const calculateSubnationalDebt = () => {
    const debt = Number(totalDebt);
    const revenue = Number(totalRevenue);

    if (isNaN(debt) || isNaN(revenue) || debt <= 0 || revenue <= 0) {
      return "Invalid data";
    }

    const debtRatio = (debt / revenue) * 100;

    if (debtRatio <= xStar) {
      return "100.00"; // Excellent
    }

    const standardizedValue =
      100 *
      (1 -
        Math.abs((debtRatio - xStar) / (2 * xStar - xStar))); // Math.abs only after 1 -
    return standardizedValue.toFixed(2); // Limit to 2 decimal places
  };

  const decisionLogic = () => {
    const debt = Number(totalDebt);
    const revenue = Number(totalRevenue);

    if (isNaN(debt) || isNaN(revenue) || debt <= 0 || revenue <= 0) {
      return "Invalid data";
    }

    const debtRatio = (debt / revenue) * 100;

    if (debtRatio >= 2 * xStar) return "0 (Poor)";
    if (debtRatio <= xStar) return "100 (Excellent)";
    return "Moderate";
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Subnational Debt Indicator</h2>

      <p className="mb-4">
        This indicator calculates the sustainability of subnational debt based
        on the ratio of total debt to total revenue.
      </p>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Total Existing Debt:</label>
        <input
          type="number"
          value={totalDebt}
          onChange={(e) => setTotalDebt(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          placeholder="Enter total debt amount"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Total Current Revenue:</label>
        <input
          type="number"
          value={totalRevenue}
          onChange={(e) => setTotalRevenue(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          placeholder="Enter total revenue amount"
        />
      </div>

      <div className="mt-4">
        <p className="font-semibold">
          Subnational Debt Standardized Value:{" "}
          <span className="font-bold">{calculateSubnationalDebt()}</span>
        </p>
        <p className="font-semibold">
          Decision Logic:{" "}
          <span className="font-bold">{decisionLogic()}</span>
        </p>
      </div>
    </div>
  );
};

export default SubnationalDebtIndicator;
