"use client";
import React, { useState } from "react";

const InformalEmploymentCalculator: React.FC = () => {
  const [informalEmployees, setInformalEmployees] = useState<number | undefined>();
  const [totalEmployedPersons, setTotalEmployedPersons] = useState<number | undefined>();
  const [informalEmployment, setInformalEmployment] = useState<number>(0); // Informal Employment Ratio
  const [standardizedInformalEmployment, setStandardizedInformalEmployment] = useState<number>(0); // Standardized Informal Employment
  const [decision, setDecision] = useState<string>("");

  const min = 11; // Minimum benchmark
  const max = 75; // Maximum benchmark

  const calculateInformalEmployment = () => {
    if (!totalEmployedPersons || totalEmployedPersons === 0) {
      alert("Total number of employed persons cannot be zero.");
      return;
    }

    if (!informalEmployees || informalEmployees < 0) {
      alert("Please enter a valid number of informal employees.");
      return;
    }

    // Calculate Informal Employment Ratio
    const ratio = (informalEmployees / totalEmployedPersons) * 100;
    setInformalEmployment(ratio);

    // Standardized Informal Employment Formula
    const standardized = 100 * (1 - (Math.pow(ratio, 0.25) - Math.pow(min, 0.25)) / (Math.pow(max, 0.25) - Math.pow(min, 0.25)));
    setStandardizedInformalEmployment(standardized);

    // Decision Logic
    if (ratio >= max) {
      setDecision("Bad");
    } else if (ratio > min && ratio < max) {
      setDecision("Moderate");
    } else {
      setDecision("Good");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-10 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Informal Employment Calculator
      </h1>

      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Number of Informal Employees:
        </label>
        <input
          type="number"
          value={informalEmployees !== undefined ? informalEmployees : ""}
          onChange={(e) => setInformalEmployees(Number(e.target.value) || undefined)}
          className="border rounded-lg p-4 w-full text-lg"
          placeholder="Enter number of informal employees"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Total Number of Employed Persons:
        </label>
        <input
          type="number"
          value={totalEmployedPersons !== undefined ? totalEmployedPersons : ""}
          onChange={(e) => setTotalEmployedPersons(Number(e.target.value) || undefined)}
          className="border rounded-lg p-4 w-full text-lg"
          placeholder="Enter total number of employed persons"
        />
      </div>

      <button
        onClick={calculateInformalEmployment}
        className="p-4 bg-blue-600 text-white rounded-lg w-full text-xl hover:bg-blue-700 transition"
      >
        Calculate Informal Employment
      </button>

      {decision && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-4">
            Informal Employment Ratio: {informalEmployment.toFixed(2)}%
          </h2>
          <h2 className="text-xl font-semibold mb-4">
            Standardized Informal Employment: {standardizedInformalEmployment.toFixed(2)}
          </h2>
          <h2 className="text-xl font-semibold">
            Decision:{" "}
            <span
              className={`${
                decision === "Good"
                  ? "text-green-600"
                  : decision === "Moderate"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {decision}
            </span>
          </h2>
        </div>
      )}
    </div>
  );
};

export default InformalEmploymentCalculator;
