"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const PovertyRateStandardization: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [povertyPopulation, setPovertyPopulation] = useState<number | string>(""); // Input: population below $1.25 PPP a day
  const [totalPopulation, setTotalPopulation] = useState<number | string>(""); // Input: total population
  const [standardizedRate, setStandardizedRate] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<string | null>(null); // Decision evaluation
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Constants for benchmarks
  const MIN = 0.38; // ⁴√Min = 0.38
  const MAX = 3.00; // ⁴√Max = 3.00

  const calculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const totalPopValue = parseFloat(totalPopulation.toString());
    if (totalPopValue <= 0) {
      alert("Total population must be greater than zero.");
      return;
    }

    const povertyPopValue = parseFloat(povertyPopulation.toString());
    if (isNaN(povertyPopValue) || isNaN(totalPopValue)) {
      alert("Please enter valid numbers for both fields.");
      return;
    }

    // Poverty rate formula
    const povertyRate = ( povertyPopValue / totalPopValue)*100;
    const fourthRootPovertyRate = Math.pow(povertyRate, 0.25); // Calculating the fourth root

    // Decision logic
    let standardizedRateValue: number;
    let evaluationComment: string;

    if (fourthRootPovertyRate >= MAX) {
      standardizedRateValue = 0;
      evaluationComment = "Bad";
    } else if (fourthRootPovertyRate > MIN) {
      standardizedRateValue = 100 * (1 - (fourthRootPovertyRate - MIN) / (MAX - MIN));
      evaluationComment = "Average";
    } else {
      standardizedRateValue = 100;
      evaluationComment = "Good";
    }

    setStandardizedRate(standardizedRateValue.toFixed(2));
    setEvaluation(evaluationComment);

    // Prepare data to send
    const postData = {
      poverty_rate: povertyRate,
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
      <h2 className="text-2xl font-bold mb-4">Poverty Rate Standardization</h2>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Population Below $1.25 PPP a Day:
        </label>
        <input
          type="number"
          value={povertyPopulation}
          onChange={(e) => setPovertyPopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter population below $1.25 PPP"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Total Population:</label>
        <input
          type="number"
          value={totalPopulation}
          onChange={(e) => setTotalPopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter total population"
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
            Standardized Poverty Rate: {standardizedRate}%
          </h3>
          <h3 className="text-lg">
            Evaluation: {evaluation}
          </h3>
        </div>
      )}
    </div>
  );
};

export default PovertyRateStandardization;