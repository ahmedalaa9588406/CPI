"use client";
import React, { useState, useEffect } from "react";

const OldAgeDependencyCalculator: React.FC = () => {
  const [peopleOver65, setPeopleOver65] = useState<number | undefined>();
  const [peopleAged15to64, setPeopleAged15to64] = useState<number | undefined>();
  const [oldAgeDependencyRatio, setOldAgeDependencyRatio] = useState<number>(0);
  const [standardizedRatio, setStandardizedRatio] = useState<number>(0);
  const [decision, setDecision] = useState<string>("");
  const [economicStrength, setEconomicStrength] = useState<number>(0);

  const minLogValue = Math.log(2.92); // Minimum log value
  const maxLogValue = Math.log(40.53); // Maximum log value

  const calculateDependencyRatio = () => {
    if (!peopleAged15to64 || peopleAged15to64 === 0) {
      alert("The number of people aged 15 to 64 cannot be zero.");
      return;
    }

    if (!peopleOver65 || peopleOver65 < 0) {
      alert("Please enter a valid number of people aged 65 and over.");
      return;
    }

    // Calculate Old Age Dependency Ratio
    const dependencyRatio = (peopleOver65 / peopleAged15to64) * 100;
    setOldAgeDependencyRatio(dependencyRatio);

    // Standardized Ratio
    const lnRatio = Math.log(dependencyRatio);
    const standardized = 100 * (1 - (lnRatio - minLogValue) / (maxLogValue - minLogValue));
    setStandardizedRatio(standardized);

    // Decision Logic
    if (lnRatio >= 3.7) {
      setDecision("Bad");
    } else if (lnRatio > 1.07 && lnRatio < 3.7) {
      setDecision("Moderate");
    } else {
      setDecision("Good");
    }
  };

  useEffect(() => {
    // Fetch the values from localStorage and calculate the economic strength
    const cityProductPerCapita = parseFloat(localStorage.getItem("cityProductPerCapita") || "0");
    const meanHouseholdIncome = parseFloat(localStorage.getItem("meanHouseholdIncome") || "0");

    const values = [cityProductPerCapita, oldAgeDependencyRatio, meanHouseholdIncome].filter(value => value > 0);
    const average = values.reduce((acc, value) => acc + value, 0) / values.length;

    setEconomicStrength(average);
  }, [oldAgeDependencyRatio]);

  return (
    <div className="max-w-md mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Old Age Dependency Ratio Calculator</h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">People aged 65 and over:</label>
        <input
          type="number"
          value={peopleOver65 !== undefined ? peopleOver65 : ""}
          onChange={(e) => setPeopleOver65(Number(e.target.value) || undefined)}
          className="border rounded p-2 w-full"
          placeholder="Enter number of people aged 65 and over"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">People aged 15 to 64:</label>
        <input
          type="number"
          value={peopleAged15to64 !== undefined ? peopleAged15to64 : ""}
          onChange={(e) => setPeopleAged15to64(Number(e.target.value) || undefined)}
          className="border rounded p-2 w-full"
          placeholder="Enter number of people aged 15 to 64"
        />
      </div>

      <button
        onClick={calculateDependencyRatio}
        className="p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition"
      >
        Calculate Dependency Ratio
      </button>

      {decision && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">
            Old Age Dependency Ratio: {oldAgeDependencyRatio.toFixed(2)}
          </h2>
          <h2 className="text-lg font-semibold">
            Standardized Ratio: {standardizedRatio.toFixed(2)}
          </h2>
          <h2 className="text-lg font-semibold">Decision: {decision}</h2>
          <h2 className="text-lg font-semibold">Economic Strength: {economicStrength.toFixed(2)}</h2>
        </div>
      )}
    </div>
  );
};

export default OldAgeDependencyCalculator;
