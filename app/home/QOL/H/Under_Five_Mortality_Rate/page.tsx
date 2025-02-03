"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

function UnderFiveMortalityRateCalculator() {
  const { user, isLoaded } = useUser();
  const [underFiveDeaths, setUnderFiveDeaths] = useState<string>("");
  const [liveBirths, setLiveBirths] = useState<string>("");
  const [u5mr, setU5mr] = useState<number | null>(null);
  const [standardizedScore, setStandardizedScore] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const MIN_U5MR = 2.20; // Minimum U5MR benchmark
  const MAX_U5MR = 181.60; // Maximum U5MR benchmark

  // Add getComment function for evaluation
  const getComment = (score: number) => {
    if (score >= 80) return "VERY SOLID";
    else if (score >= 70) return "SOLID";
    else if (score >= 60) return "MODERATELY SOLID";
    else if (score >= 50) return "MODERATELY WEAK";
    else if (score >= 40) return "WEAK";
    else return "VERY WEAK";
  };

  const calculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }
    const deaths = parseFloat(underFiveDeaths);
    const births = parseFloat(liveBirths);

    if (isNaN(deaths) || isNaN(births) || births <= 0) {
      alert("Please ensure valid input for deaths and live births.");
      return;
    }

    const u5mrValue = (deaths / births) * 1000; // U5MR formula
    setU5mr(u5mrValue);

    // Standardized Score Calculation
    const lnU5MR = Math.log(u5mrValue);
    let standardized = 0;
    if (lnU5MR >= Math.log(MAX_U5MR)) {
      standardized = 0;
    } else if (lnU5MR <= Math.log(MIN_U5MR)) {
      standardized = 100;
    } else {
      standardized =
        100 *
        (1 -
          (lnU5MR - Math.log(MIN_U5MR)) /
            (Math.log(MAX_U5MR) - Math.log(MIN_U5MR)));
    }
    setStandardizedScore(standardized);

    // Evaluate the decision based on the standardized score
    const evaluationComment = getComment(standardized);
    setDecision(evaluationComment);

    // Prepare data to send
    const postData = {
      under_five_mortality_rate: u5mrValue,
      under_five_mortality_rate_comment: evaluationComment, // Renamed for consistency
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
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Under-Five Mortality Rate (U5MR) Calculator</h1>

      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Number of Under-Five Deaths:
        </label>
        <input
          type="number"
          value={underFiveDeaths}
          onChange={(e) => setUnderFiveDeaths(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter number of under-five deaths"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Number of Live Births:
        </label>
        <input
          type="number"
          value={liveBirths}
          onChange={(e) => setLiveBirths(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter number of live births"
        />
      </div>
      <button
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`p-4 bg-blue-600 text-white rounded w-full hover:bg-blue-700 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate U5MR'}
      </button>
      {u5mr !== null && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-4">
            Under-Five Mortality Rate: {u5mr.toFixed(2)} per 1,000 live births
          </h2>
          <h2 className="text-xl font-semibold mb-4">
            Standardized Score: {standardizedScore?.toFixed(2)}
          </h2>
          {decision && (
            <h2 className="text-xl font-semibold">
              Decision:{" "}
              <span
                className={`${
                  decision === "VERY SOLID"
                    ? "text-green-600"
                    : decision === "SOLID"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {decision}
              </span>
            </h2>
          )}
        </div>
      )}
    </div>
  );
}

export default UnderFiveMortalityRateCalculator;