"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const HerfindahlHirschmanIndex: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [industryShares, setIndustryShares] = useState<string>(""); // Comma-separated values
  const [numberOfIndustries, setNumberOfIndustries] = useState<number | undefined>();
  const [hIndex, setHIndex] = useState<number>(0); // H Index
  const [normalizedHIndex, setNormalizedHIndex] = useState<number>(0); // Normalized H*
  const [standardizedHIndex, setStandardizedHIndex] = useState<number>(0); // Standardized H(S)
  const [benchmark, setBenchmark] = useState<number>(0); // X*
  const [decision, setDecision] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const calculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    if (!numberOfIndustries || numberOfIndustries <= 0) {
      alert("Please enter a valid number of industries.");
      return;
    }

    // Parse industry shares
    const shares = industryShares
      .split(",")
      .map((share) => parseFloat(share.trim()))
      .filter((share) => !isNaN(share));
    if (shares.length !== numberOfIndustries) {
      alert("Number of industries must match the number of shares entered.");
      return;
    }

    // Calculate H Index
    const h = shares.reduce((sum, share) => sum + Math.pow(share, 2), 0);
    setHIndex(h);

    // Calculate Normalized H*
    const normalizedH = (h - 1 / numberOfIndustries) / (1 - 1 / numberOfIndustries);
    setNormalizedHIndex(normalizedH);

    // Calculate Benchmark X*
    const xStar =
      (0.25 - 1 / numberOfIndustries) / (1 - 1 / numberOfIndustries);
    setBenchmark(xStar);

    // Calculate Standardized H(S) with absolute value in both numerator and denominator
    let standardizedH =
      100 *
      (1 -
        Math.abs(normalizedH - xStar) /
          Math.abs(xStar));
    if (standardizedH < 0) standardizedH = 0; // Ensure the value is not negative
    if (standardizedH > 100) standardizedH = 100; // Cap the value at 100
    setStandardizedHIndex(standardizedH);

    // Decision Logic
    if (normalizedH >= xStar) {
      setDecision("High Concentration");
    } else {
      setDecision("Low Concentration");
    }

    // Prepare data to send
    const postData = {
      economic_specialization: h,
      userId: user.id,
    };

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/calculation-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Result:', result);
      alert("Data calculated and saved successfully!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error saving data:', errorMessage);
      alert("Failed to save data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-10 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Herfindahl-Hirschman Index Calculator
      </h1>
      
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Number of Industries (N):
        </label>
        <input
          type="number"
          value={numberOfIndustries !== undefined ? numberOfIndustries : ""}
          onChange={(e) => setNumberOfIndustries(Number(e.target.value) || undefined)}
          className="border rounded-lg p-4 w-full text-lg"
          placeholder="Enter the number of industries"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Industry Shares (comma-separated, e.g., 0.2, 0.3, 0.5):
        </label>
        <input
          type="text"
          value={industryShares}
          onChange={(e) => setIndustryShares(e.target.value)}
          className="border rounded-lg p-4 w-full text-lg"
          placeholder="Enter shares as decimals"
        />
      </div>
      <button
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`p-4 bg-blue-600 text-white rounded-lg w-full text-xl hover:bg-blue-700 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate H Index'}
      </button>
      {decision && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-4">
            H Index: {hIndex.toFixed(4)}
          </h2>
          <h2 className="text-xl font-semibold mb-4">
            Normalized H* Index: {normalizedHIndex.toFixed(4)}
          </h2>
          <h2 className="text-xl font-semibold mb-4">
            Benchmark X*: {benchmark.toFixed(4)}
          </h2>
          <h2 className="text-xl font-semibold mb-4">
            Standardized H(S): {standardizedHIndex.toFixed(4)}
          </h2>
          <h2 className="text-xl font-semibold">
            Decision:{" "}
            <span
              className={`${
                decision === "High Concentration"
                  ? "text-red-600"
                  : "text-green-600"
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

export default HerfindahlHirschmanIndex;