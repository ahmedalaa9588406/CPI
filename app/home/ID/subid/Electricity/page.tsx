"use client";
import React, { useState } from "react";

function ImprovedWaterForm() {
  const [durableHouseholds, setImprovedElectricityHouseholds] = useState("");
  const [totalHouseholds, setTotalHouseholds] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [improvedWaterS, setImprovedWaterS] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);

  // Constants
  const MIN = 7;
  const MAX = 100;

  const calculateImprovedShelter = () => {
    const numericTotalHouseholds = Number(totalHouseholds);
    if (numericTotalHouseholds > 0) {
      const numericDurableHouseholds = Number(durableHouseholds);
      const ImprovedElectricity =
        (numericDurableHouseholds / numericTotalHouseholds) * 100;

      // Calculate Standardized Improved Shelter (S)
      let standardizedImprovedElectricity =
        100 * ((ImprovedElectricity - MIN) / (MAX - MIN));

      // Cap at 100 if it exceeds, or set to 0 if it's below 0
      if (standardizedImprovedElectricity > 100) {
        standardizedImprovedElectricity = 100;
      } else if (standardizedImprovedElectricity < 0) {
        standardizedImprovedElectricity = 0;
      }

      setImprovedWaterS(standardizedImprovedElectricity);
      setResult(ImprovedElectricity.toFixed(2));

      // Determine decision message
      if (standardizedImprovedElectricity > 15) {
        setDecision("Perfect");
      } else {
        setDecision("Bad");
      }
    } else {
      alert("Total households must be greater than zero.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Calculate Improved Electricity
      </h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Number Of Households With Improved Electricity:
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={durableHouseholds}
            onChange={(e) => setImprovedElectricityHouseholds(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Total Households:
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={totalHouseholds}
            onChange={(e) => setTotalHouseholds(e.target.value)}
            required
          />
        </label>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={calculateImprovedShelter}
      >
        Calculate
      </button>
      {result !== null && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-lg">Improved Sanitation: {result}%</p>
          <p className="text-sm text-gray-600">Improved Sanitation (S):</p>
          <ul className="list-disc pl-5">
            <li>Improved Sanitation Standardized: {improvedWaterS?.toFixed(2)}%</li>
          </ul>
          {decision && (
            <p
              className={`mt-4 p-2 text-center font-bold text-white rounded-md ${
                decision === "Perfect"
                  ? "bg-green-500"
                  : decision === "Bad"
                  ?  "bg-red-500"
                  : "bg-red-500"
              }`}
            >
              {decision}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ImprovedWaterForm;
