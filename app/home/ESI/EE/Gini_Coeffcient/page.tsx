"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const GiniIndexStandardization: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [incomes, setIncomes] = useState<string>(""); // Input: comma-separated list of incomes
  const [giniCoefficient, setGiniCoefficient] = useState<number | null>(null); // Raw Gini coefficient
  const [standardizedRate, setStandardizedRate] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<string | null>(null); // Decision evaluation
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  // Constants for benchmarks
  const MIN = 0.24; // Minimum Gini coefficient
  const MAX = 0.63; // Maximum Gini coefficient

  // Function to calculate Gini coefficient from an array of incomes
  const calculateGiniCoefficient = (incomeArray: number[]): number => {
    if (incomeArray.length < 2) return 0;
    const sortedIncomes = [...incomeArray].sort((a, b) => a - b);
    const n = incomeArray.length;
    const sum = sortedIncomes.reduce((acc, val) => acc + val, 0);
    const mean = sum / n;

    let giniSum = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        giniSum += Math.abs(sortedIncomes[i] - sortedIncomes[j]);
      }
    }

    return giniSum / (2 * n * n * mean);
  };

  // Function to calculate standardized Gini index and raw Gini coefficient
  const calculateStandardizedGini = () => {
    if (!incomes || incomes.trim() === "") {
      alert("Please enter valid incomes.");
      return null;
    }
    const incomeArray = incomes.split(',').map(Number).filter(Boolean);
    if (incomeArray.length < 2) {
      alert("Please enter at least two valid incomes.");
      return null;
    }
    const giniValue = calculateGiniCoefficient(incomeArray);
    if (giniValue < 0) {
      alert("Gini coefficient cannot be negative.");
      return null;
    }
    let standardized: number;
    let evaluationComment: string;
    // Decision logic
    if (giniValue >= MAX) {
      standardized = 0;
      evaluationComment = "Bad";
    } else if (giniValue > MIN) {
      standardized = 100 * (1 - (giniValue - MIN) / (MAX - MIN));
      evaluationComment = "Average";
    } else {
      standardized = 100;
      evaluationComment = "Good";
    }
    setGiniCoefficient(giniValue); // Set the raw Gini coefficient
    setStandardizedRate(standardized.toFixed(2)); // Limit to 2 decimal places
    setEvaluation(evaluationComment); // Set the evaluation comment
    return giniValue; // Return the raw Gini coefficient for posting
  };

  // Function to handle calculation and saving data
  const handleCalculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }
    const giniValue = calculateStandardizedGini();
    if (giniValue === null) return; // Exit if calculation fails
    try {
      setIsSubmitting(true); // Start loading
      console.log("Submitting data...");
      const postData = {
        gini_coefficient: giniValue, // Post the raw Gini coefficient
        userId: user.id,
      };
      console.log("Post Data:", postData); // Debug: Log the post data
      const response = await fetch('/api/calculation-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      console.log("Response Status:", response.status); // Debug: Log the response status
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Result:", result); // Debug: Log the result
      alert("Data calculated and saved successfully!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error saving data:', errorMessage);
      alert("Failed to save data. Please try again.");
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Gini Index Standardization</h2>
      <div className="mb-4">
        <label htmlFor="incomes" className="block mb-2 font-semibold">
          Enter Incomes (comma-separated):
        </label>
        <input
          id="incomes"
          type="text"
          value={incomes}
          onChange={(e) => setIncomes(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter incomes, e.g., 1000,2000,3000"
          aria-label="Enter incomes"
        />
      </div>
      <button
        onClick={handleCalculateAndSave}
        disabled={isSubmitting}
        className={`p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Calculate and Save"
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate and Save'}
      </button>
      {giniCoefficient !== null && standardizedRate !== null && evaluation !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Raw Gini Coefficient: {giniCoefficient.toFixed(4)}
          </h3>
          <h3 className="text-lg">
            Standardized Gini Index: {standardizedRate}
          </h3>
          <h3 className="text-lg">
            Evaluation: {evaluation}
          </h3>
        </div>
      )}
    </div>
  );
};

export default GiniIndexStandardization;