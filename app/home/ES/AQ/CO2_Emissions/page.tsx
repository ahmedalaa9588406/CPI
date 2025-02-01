// app\home\ES\AQ\CO2_Emissions\page.tsx

"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const CO2Emissions: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [co2Emissions, setCo2Emissions] = useState<number | string>(""); // Input: CO2 emissions
  const [standardizedScore, setStandardizedScore] = useState<string | null>(null); // Standardized score
  const [evaluation, setEvaluation] = useState<string | null>(null); // Decision evaluation
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const BENCHMARK = 0.39; // Benchmark value for CO2 emissions
  const CRITICAL = 2.09; // Critical threshold for CO2 emissions

  // Function to calculate CO2 Score
  const calculateCO2Score = () => {
    if (!co2Emissions || parseFloat(co2Emissions.toString()) < 0) {
      alert("Please enter a valid CO₂ emissions value (greater than or equal to 0).");
      return null;
    }
    const co2Value = parseFloat(co2Emissions.toString());
    const fifthRootEmissions = Math.pow(co2Value, 1 / 5); // Calculate the fifth root
    let standardizedValue = 0;

    if (fifthRootEmissions >= CRITICAL) {
      standardizedValue = 0;
      setEvaluation("Poor");
    } else if (fifthRootEmissions > BENCHMARK && fifthRootEmissions < CRITICAL) {
      standardizedValue =
        100 *
        (1 - Math.abs((fifthRootEmissions - BENCHMARK) / (CRITICAL - BENCHMARK)));
      setEvaluation("Moderate");
    } else if (fifthRootEmissions <= BENCHMARK) {
      standardizedValue = 100;
      setEvaluation("Excellent");
    }

    setStandardizedScore(standardizedValue.toFixed(2));
    return standardizedValue.toFixed(2);
  };

  // Function to handle calculation and posting data
  const handleCalculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const score = calculateCO2Score();
    if (score === null) return; // Exit if calculation fails

    const co2Value = parseFloat(co2Emissions.toString());

    try {
      setIsSubmitting(true);
      const postData = {
        co2_emissions: co2Value,
        userId: user.id
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
    } catch (error) {
      console.error('Error saving data:', error);
      alert("Failed to save data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">CO₂ Emissions Evaluation</h2>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">CO₂ Emissions (metric tonnes):</label>
        <input
          type="number"
          value={co2Emissions}
          onChange={(e) => setCo2Emissions(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter CO₂ emissions"
        />
      </div>
      <button
        onClick={handleCalculateAndSave}
        disabled={isSubmitting}
        className={`p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition mb-4 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate and Save'}
      </button>
      {standardizedScore !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Standardized Score: {standardizedScore}
          </h3>
          <h3 className="text-lg">
            Evaluation: {evaluation}
          </h3>
        </div>
      )}
    </div>
  );
};

export default CO2Emissions;