"use client";

import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const PM25Concentration: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [pm25Concentration, setPm25Concentration] = useState<number | string>(""); // Input: PM2.5 concentration
  const [standardizedScore, setStandardizedScore] = useState<string | null>(null); // Standardized score
  const [comment, setComment] = useState<string | null>(null); // Comment based on score
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const BENCHMARK = 10; // Benchmark for PM2.5 concentration (X*)

  // Function to get comment based on standardized score
  const getComment = (score: number) => {
    if (score >= 80) return "VERY SOLID";
    else if (score >= 70) return "SOLID";
    else if (score >= 60) return "MODERATELY SOLID";
    else if (score >= 50) return "MODERATELY WEAK";
    else if (score >= 40) return "WEAK";
    else return "VERY WEAK";
  };

  // Function to calculate PM2.5 score
  const calculatePM25Score = () => {
    if (!pm25Concentration || parseFloat(pm25Concentration.toString()) < 0) {
      alert("Please enter a valid PM2.5 concentration (greater than or equal to 0).");
      return null;
    }

    const pm25Value = parseFloat(pm25Concentration.toString());

    // Standardization formula with absolute value
    let standardizedValue = 0;

    if (pm25Value >= 20) {
      standardizedValue = 0;
    } else if (pm25Value >= 10 && pm25Value < 20) {
      standardizedValue = 100 * (1 - Math.abs((pm25Value - BENCHMARK) / 10));
    } else if (pm25Value <= 10) {
      standardizedValue = 100;
    }

    const scoreNum = standardizedValue.toFixed(2);
    setStandardizedScore(scoreNum);
    const calculatedComment = getComment(parseFloat(scoreNum));
    setComment(calculatedComment); // Set comment immediately after calculating score
    console.log('Calculated Score:', scoreNum, 'Calculated Comment:', calculatedComment);
    return { scoreNum, calculatedComment };
  };

  // Function to handle calculation and saving data
  const handleCalculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const calculationResult = calculatePM25Score();
    if (calculationResult === null) return; // Exit if calculation fails

    const { scoreNum, calculatedComment } = calculationResult;
    const pm25Value = parseFloat(pm25Concentration.toString());

    try {
      setIsSubmitting(true);

      console.log('Before Posting:', 'Score:', scoreNum, 'Comment:', calculatedComment);

      const postData = {
        pm25_concentration: pm25Value,
        pm25_concentration_comment: calculatedComment, // Use the calculated comment
        userId: user.id,
      };

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
      alert("Data calculated and saved successfully!");
      console.log('Result:', result);
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
      <h2 className="text-2xl font-bold mb-4">PM2.5 Concentration Evaluation</h2>

      <div className="mb-4">
        <label htmlFor="pm25Concentration" className="block mb-2 font-semibold">
          PM2.5 Concentration (μg/m³):
        </label>
        <input
          id="pm25Concentration"
          type="number"
          value={pm25Concentration}
          onChange={(e) => setPm25Concentration(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter PM2.5 concentration"
          aria-label="Enter PM2.5 concentration"
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

      {standardizedScore !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Standardized Score: {standardizedScore}
          </h3>
          <h3 className="text-lg">
            Comment: {comment}
          </h3>
        </div>
      )}
    </div>
  );
};

export default PM25Concentration;