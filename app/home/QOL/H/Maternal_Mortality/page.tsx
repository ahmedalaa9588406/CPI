"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

function MaternalMortalityCalculator() {
  const { user, isLoaded } = useUser();
  const [maternalDeaths, setMaternalDeaths] = useState<string>("");
  const [liveBirths, setLiveBirths] = useState<string>("");
  const [maternalMortality, setMaternalMortality] = useState<number | null>(null);
  const [standardizedMortality, setStandardizedMortality] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const minBenchmark = 1; // Minimum benchmark
  const maxBenchmark = 1100; // Maximum benchmark

  // Add getComment function for evaluation
  const getComment = (score: number) => {
    if (score >= 80) return "VERY SOLID";
    else if (score >= 70) return "SOLID";
    else if (score >= 60) return "MODERATELY SOLID";
    else if (score >= 50) return "MODERATELY WEAK";
    else if (score >= 40) return "WEAK";
    else return "VERY WEAK";
  };

  // Function to calculate Maternal Mortality
  const calculateMaternalMortality = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }
    const deaths = parseFloat(maternalDeaths);
    const births = parseFloat(liveBirths);

    if (isNaN(deaths) || isNaN(births) || births <= 0) {
      alert("Please provide valid inputs for both fields.");
      return;
    }

    const mortality = (deaths / births) * 100000;
    setMaternalMortality(mortality);

    // Standardization logic
    const lnMortality = Math.log(mortality);
    let standardized;
    if (lnMortality >= Math.log(maxBenchmark)) {
      standardized = 0;
    } else if (lnMortality <= Math.log(minBenchmark)) {
      standardized = 100;
    } else {
      standardized =
        100 * (1 - (lnMortality - Math.log(minBenchmark)) / (Math.log(maxBenchmark) - Math.log(minBenchmark)));
    }
    setStandardizedMortality(standardized);

    // Evaluate the decision based on the standardized score
    const evaluationComment = getComment(standardized);
    setDecision(evaluationComment);

    // Prepare data to send
    const postData = {
      maternal_mortality: mortality,
      maternal_mortality_comment: evaluationComment, // Renamed for consistency
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
      <h1 className="text-2xl font-bold mb-4">Maternal Mortality Calculator</h1>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Maternal Deaths:
        </label>
        <input
          type="number"
          value={maternalDeaths}
          onChange={(e) => setMaternalDeaths(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter maternal deaths"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Live Births:</label>
        <input
          type="number"
          value={liveBirths}
          onChange={(e) => setLiveBirths(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter live births"
        />
      </div>
      <button
        onClick={calculateMaternalMortality}
        disabled={isSubmitting}
        className={`p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate Maternal Mortality'}
      </button>
      {maternalMortality !== null && (
        <div className="mt-4">
          <p className="text-xl font-bold">
            Maternal Mortality: {maternalMortality.toFixed(2)} deaths per 100,000 live births
          </p>
          <p className="text-xl font-bold">
            Standardized Maternal Mortality: {standardizedMortality?.toFixed(2)}
          </p>
          {decision && (
            <p className="text-lg font-bold mt-2">
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
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default MaternalMortalityCalculator;