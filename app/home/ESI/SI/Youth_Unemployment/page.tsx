"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const YouthUnemploymentStandardization: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [unemployedYouth, setUnemployedYouth] = useState<number>(0);
  const [youthLaborForce, setYouthLaborForce] = useState<number>(0);
  const [standardizedRate, setStandardizedRate] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Constants for benchmarks and thresholds
  const MIN = 2.7; // Min = 2.7%
  const MAX = 62.8; // Max = 62.8%
  const THRESHOLD_LOW = 1.28;
  const THRESHOLD_HIGH = 2.82;

  const calculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    // Validate inputs
    if (youthLaborForce <= 0) {
      alert("Youth labor force must be greater than zero.");
      return;
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
    let evaluationComment: string;

    if (fourthRootUnemployment >= Math.pow(THRESHOLD_HIGH, 1 / 4)) {
      standardizedRateValue = 0;
      evaluationComment = "Bad";
    } else if (fourthRootUnemployment > Math.pow(THRESHOLD_LOW, 1 / 4) && fourthRootUnemployment < Math.pow(THRESHOLD_HIGH, 1 / 4)) {
      standardizedRateValue = standardizedValue;
      evaluationComment = "Average";
    } else {
      standardizedRateValue = 100;
      evaluationComment = "Good";
    }

    setStandardizedRate(standardizedRateValue.toFixed(2));
    setEvaluation(evaluationComment);

    // Prepare data to send
    const postData = {
      youth_unemployment: unemploymentRate,
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
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate Standardized Rate'}
      </button>
      {standardizedRate !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Standardized Youth Unemployment Rate: {standardizedRate}%
          </h3>
          <h3 className="text-lg">
            Evaluation: {evaluation}
          </h3>
        </div>
      )}
    </div>
  );
};

export default YouthUnemploymentStandardization;