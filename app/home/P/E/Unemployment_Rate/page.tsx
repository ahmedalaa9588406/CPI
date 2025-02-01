"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const UnemploymentRateCalculator: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [unemployed, setUnemployed] = useState<number | undefined>();
  const [labourForce, setLabourForce] = useState<number | undefined>();
  const [unemploymentRate, setUnemploymentRate] = useState<number>(0);
  const [standardizedRate, setStandardizedRate] = useState<number>(0);
  const [decision, setDecision] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const min = 1; // Minimum benchmark
  const max = 28.2; // Maximum benchmark

  const calculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    if (!labourForce || labourForce === 0) {
      alert("Labour force cannot be zero.");
      return;
    }
    if (!unemployed || unemployed < 0) {
      alert("Please enter a valid number of unemployed people.");
      return;
    }

    // Calculate Unemployment Rate
    const rate = (unemployed / labourForce) * 100;
    setUnemploymentRate(rate);

    // Standardized Unemployment Rate Formula
    const rootRate = Math.pow(rate, 1 / 4); // Fourth root of the unemployment rate
    const rootMin = Math.pow(min, 1 / 4); // Fourth root of the minimum
    const rootMax = Math.pow(max, 1 / 4); // Fourth root of the maximum
    let standardized =
      100 * (1 - (rootRate - rootMin) / (rootMax - rootMin));
    if (standardized > 100) {
      standardized = 100;
    } else if (standardized < 0) {
      standardized = 0;
    }
    setStandardizedRate(standardized);

    // Decision Logic
    if (rootRate >= 2.3) {
      setDecision("Bad");
    } else if (rootRate > 1 && rootRate < 2.3) {
      setDecision("Moderate");
    } else {
      setDecision("Good");
    }

    // Prepare data to send
    const postData = {
      unemployment_rate: rate,
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
        Unemployment Rate Calculator
      </h1>
      
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Number of Unemployed People:
        </label>
        <input
          type="number"
          value={unemployed !== undefined ? unemployed : ""}
          onChange={(e) => setUnemployed(Number(e.target.value) || undefined)}
          className="border rounded-lg p-4 w-full text-lg"
          placeholder="Enter number of unemployed people"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Labour Force:
        </label>
        <input
          type="number"
          value={labourForce !== undefined ? labourForce : ""}
          onChange={(e) => setLabourForce(Number(e.target.value) || undefined)}
          className="border rounded-lg p-4 w-full text-lg"
          placeholder="Enter total labour force"
        />
      </div>
      <button
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`p-4 bg-blue-600 text-white rounded-lg w-full text-xl hover:bg-blue-700 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate Unemployment Rate'}
      </button>
      {decision && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-4">
            Unemployment Rate: {unemploymentRate.toFixed(2)}%
          </h2>
          <h2 className="text-xl font-semibold mb-4">
            Standardized Rate: {standardizedRate.toFixed(2)}
          </h2>
          <h2 className="text-xl font-semibold">
            Decision:{" "}
            <span
              className={`${
                decision === "Good"
                  ? "text-green-600"
                  : decision === "Moderate"
                  ? "text-yellow-600"
                  : "text-red-600"
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

export default UnemploymentRateCalculator;