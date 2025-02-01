"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const GreenAreaPerCapitaStandardization: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [totalGreenArea, setTotalGreenArea] = useState<string>(""); // Input: total green area in the city
  const [population, setPopulation] = useState<string>(""); // Input: city population
  const [standardizedRate, setStandardizedRate] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<string | null>(null); // Decision evaluation
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Constants for benchmarks
  const BENCHMARK = 15; // X* = 15 m²/hab based on WHO suggestion

  const calculateGreenAreaPerCapita = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const totalGreenAreaValue = parseFloat(totalGreenArea);
    const populationValue = parseFloat(population);

    if (populationValue <= 0) {
      alert("Population must be greater than zero.");
      return;
    }

    // Green area per capita formula
    const greenAreaPerCapita = totalGreenAreaValue / populationValue;

    // Decision logic
    let standardized;
    let evaluationText;

    if (greenAreaPerCapita < 0) {
      standardized = 0;
      evaluationText = "Bad";
    } else if (greenAreaPerCapita < BENCHMARK) {
      standardized = 100 * (1 - Math.abs((BENCHMARK - greenAreaPerCapita) / BENCHMARK));
      evaluationText = "Average";
    } else {
      standardized = 100;
      evaluationText = "Good";
    }

    setStandardizedRate(standardized.toFixed(2));
    setEvaluation(evaluationText);

    // Prepare data to send
    const postData = {
      green_area_per_capita: greenAreaPerCapita,
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
      <h1 className="text-2xl font-bold mb-4">Green Area Per Capita Standardization</h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Total Green Area (m²):</label>
        <input
          type="number"
          value={totalGreenArea}
          onChange={(e) => setTotalGreenArea(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter total green area in square meters"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">City Population:</label>
        <input
          type="number"
          value={population}
          onChange={(e) => setPopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter city population"
        />
      </div>

      <button
        onClick={calculateGreenAreaPerCapita}
        disabled={isSubmitting}
        className={`p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate Standardized Rate'}
      </button>

      {standardizedRate !== null && (
        <div className="mt-4">
          <p className="text-lg">
            <strong>Standardized Green Area Per Capita:</strong> {standardizedRate}
          </p>
          {evaluation && (
            <p className={`text-lg mt-2 font-bold ${
              evaluation === "Bad" ? "text-red-600" : 
              evaluation === "Average" ? "text-yellow-600" : 
              "text-green-600"
            }`}>
              <strong>Evaluation:</strong> {evaluation}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GreenAreaPerCapitaStandardization;