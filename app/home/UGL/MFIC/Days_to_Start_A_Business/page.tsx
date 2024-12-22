"use client";

import React, { useState } from "react";

const DaysToStartBusiness: React.FC = () => {
  const [daysToStart, setDaysToStart] = useState<number | string>("");

  const min = 2;
  const max = 208;

  const calculateScore = () => {
    const days = Number(daysToStart);

    if (isNaN(days) || days <= 0) {
      return "Invalid data";
    }

    const lnDays = Math.log(days);
    const lnMin = Math.log(min);
    const lnMax = Math.log(max);
    const lnDifference = lnMax - lnMin;

    if (lnDifference === 0) {
      return "Invalid calculation";
    }

    const standardizationValue = 100 * (1 - (lnDays - lnMin) / lnDifference);
    return standardizationValue.toFixed(2); // Limit to 2 decimal places
  };

  const decisionLogic = () => {
    const days = Number(daysToStart);
    if (isNaN(days) || days <= 0) {
      return "Invalid data";
    }

    const lnDays = Math.log(days);

    if (lnDays >= 5.34) return "0 (Poor)";
    if (lnDays <= 0.69) return "100 (Excellent)";
    return "Moderate";
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Days to Start a Business Indicator</h2>

      <p className="mb-4">
        This indicator calculates the ease of starting a business based on the median
        number of calendar days recorded to complete all required procedures.
      </p>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Days to Start a Business:</label>
        <input
          type="number"
          value={daysToStart}
          onChange={(e) => setDaysToStart(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          placeholder="Enter the number of days"
        />
      </div>

      <div className="mt-4">
        <p className="font-semibold">
          Standardized Value:{" "}
          <span className="font-bold">{calculateScore()}</span>
        </p>
        <p className="font-semibold">
          Decision Logic:{" "}
          <span className="font-bold">{decisionLogic()}</span>
        </p>
      </div>
    </div>
  );
};

export default DaysToStartBusiness;
