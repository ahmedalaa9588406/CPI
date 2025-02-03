"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const AccessibilityToOpenPublicArea: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [population, setPopulation] = useState<string>(""); // Input: total city population
  const [lessThan400mPopulation, setLessThan400mPopulation] = useState<string>(""); // Input: population within 400m of open public area
  const [accessibilityRate, setAccessibilityRate] = useState<number | null>(null);
  const [standardizedScore, setStandardizedScore] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const MIN_RATE = 50; // Minimum benchmark
  const MAX_RATE = 100; // Maximum benchmark

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
    const populationValue = parseFloat(population);
    const lessThan400mPopulationValue = parseFloat(lessThan400mPopulation);

    if (isNaN(populationValue) || isNaN(lessThan400mPopulationValue) || populationValue <= 0) {
      alert("Please provide valid inputs for both fields.");
      return;
    }

    // Methodology A calculation
    const rate = (100 * lessThan400mPopulationValue) / populationValue;
    setAccessibilityRate(rate);

    // Standardize the accessibility rate score
    let standardized;
    if (rate >= MAX_RATE) {
      standardized = 100;
    } else if (rate <= MIN_RATE) {
      standardized = 0;
    } else {
      standardized =
        100 * ((rate - MIN_RATE) / (MAX_RATE - MIN_RATE));
    }
    setStandardizedScore(standardized);

    // Evaluate the decision based on the standardized score
    const evaluationComment = getComment(standardized);
    setDecision(evaluationComment);

    // Prepare data to send
    const postData = {
      accessibility_to_open_public_areas: rate,
      accessibility_to_open_public_areas_comment: evaluationComment, // Renamed for consistency
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
      <h1 className="text-2xl font-bold mb-6 text-center">Accessibility to Open Public Area</h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Total Population:</label>
        <input
          type="number"
          value={population}
          onChange={(e) => setPopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter total population"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Population Within 400m of Open Public Area:</label>
        <input
          type="number"
          value={lessThan400mPopulation}
          onChange={(e) => setLessThan400mPopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter population within 400m"
        />
      </div>
      <button
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`p-4 bg-blue-500 text-white rounded-lg w-full text-xl hover:bg-blue-700 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate Accessibility Rate'}
      </button>
      {accessibilityRate !== null && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-4">
            Accessibility Rate: {accessibilityRate.toFixed(2)}%
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
};

export default AccessibilityToOpenPublicArea;