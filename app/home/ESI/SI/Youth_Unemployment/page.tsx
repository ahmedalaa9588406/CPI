"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const YouthUnemploymentStandardization: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [unemployedYouth, setUnemployedYouth] = useState<number>(0); // Input: Number of unemployed youth
  const [youthLaborForce, setYouthLaborForce] = useState<number>(0); // Input: Total youth labor force
  const [standardizedRate, setStandardizedRate] = useState<string | null>(null); // Standardized rate
  const [comment, setComment] = useState<string | null>(null); // Comment based on score
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Constants for benchmarks and thresholds
  const MIN = 2.7; // Min = 2.7%
  const MAX = 62.8; // Max = 62.8%
  const THRESHOLD_LOW = 1.28;
  const THRESHOLD_HIGH = 2.82;

  // Function to get comment based on standardized score
  const getComment = (score: number) => {
    if (score >= 80) return "VERY SOLID";
    else if (score >= 70) return "SOLID";
    else if (score >= 60) return "MODERATELY SOLID";
    else if (score >= 50) return "MODERATELY WEAK";
    else if (score >= 40) return "WEAK";
    else return "VERY WEAK";
  };

  // Function to calculate standardized youth unemployment rate
  const calculateStandardizedUnemployment = () => {
    // Validate inputs
    if (youthLaborForce <= 0) {
      alert("Youth labor force must be greater than zero.");
      return null;
    }

    // Youth Unemployment calculation
    const unemploymentRate = 100 * (unemployedYouth / youthLaborForce);

    // Fourth root of unemployment rate
    const fourthRootUnemployment = Math.pow(unemploymentRate, 1 / 4);

    // Standardized formula
    const standardizedValue =
      100 *
      (1 -
        (fourthRootUnemployment - Math.pow(MIN, 1 / 4)) /
          (Math.pow(MAX, 1 / 4) - Math.pow(MIN, 1 / 4)));

    // Decision logic
    let standardizedRateValue: number;

    if (fourthRootUnemployment >= Math.pow(THRESHOLD_HIGH, 1 / 4)) {
      standardizedRateValue = 0;
    } else if (
      fourthRootUnemployment > Math.pow(THRESHOLD_LOW, 1 / 4) &&
      fourthRootUnemployment < Math.pow(THRESHOLD_HIGH, 1 / 4)
    ) {
      standardizedRateValue = standardizedValue;
    } else {
      standardizedRateValue = 100;
    }

    const scoreNum = standardizedRateValue.toFixed(2); // Limit to 2 decimal places
    setStandardizedRate(scoreNum);
    const calculatedComment = getComment(parseFloat(scoreNum));
    setComment(calculatedComment); // Set comment based on score
    console.log('Calculated Score:', scoreNum, 'Calculated Comment:', calculatedComment);
    return { unemploymentRate, scoreNum, calculatedComment };
  };

  // Function to handle calculation and saving data
  const handleCalculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const calculationResult = calculateStandardizedUnemployment();
    if (calculationResult === null) return; // Exit if calculation fails

    const { unemploymentRate, calculatedComment } = calculationResult;

    try {
      setIsSubmitting(true); // Start loading
      console.log("Submitting data...");

      const postData = {
        youth_unemployment: unemploymentRate, // Post the unemployment rate
        youth_unemployment_comment: calculatedComment, // Use the calculated comment
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
      <h2 className="text-2xl font-bold mb-4">Youth Unemployment Standardization</h2>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Number of Unemployed Youth:
        </label>
        <input
          type="number"
          value={unemployedYouth}
          onChange={(e) => setUnemployedYouth(parseFloat(e.target.value))}
          className="border rounded p-2 w-full"
          placeholder="Enter number of unemployed youth"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Youth Labor Force:</label>
        <input
          type="number"
          value={youthLaborForce}
          onChange={(e) => setYouthLaborForce(parseFloat(e.target.value))}
          className="border rounded p-2 w-full"
          placeholder="Enter total youth labor force"
        />
      </div>

      <button
        onClick={handleCalculateAndSave}
        disabled={isSubmitting}
        className={`p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate Standardized Rate'}
      </button>

      {standardizedRate !== null && comment !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Standardized Youth Unemployment Rate: <span className="font-bold">{standardizedRate}%</span>
          </h3>
          <h3 className="text-lg">
            Comment: <span className="text-blue-500">{comment}</span>
          </h3>
        </div>
      )}
    </div>
  );
};

export default YouthUnemploymentStandardization;