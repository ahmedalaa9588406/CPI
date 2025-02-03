"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const SlumHouseholdsStandardization: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [slumPopulation, setSlumPopulation] = useState<number | string>(""); // Input: number of people living in slums
  const [cityPopulation, setCityPopulation] = useState<number | string>(""); // Input: total city population
  const [standardizedRate, setStandardizedRate] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<string | null>(null); // Decision evaluation
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Constants for benchmarks
  const MIN = 0; // Min = 0%
  const MAX = 80; // Max = 80%

  // Function to get comment based on standardized score
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

    // Convert inputs to numbers
    const slumPopValue = parseFloat(slumPopulation.toString());
    const cityPopValue = parseFloat(cityPopulation.toString());

    // Validate inputs
    if (isNaN(slumPopValue) || isNaN(cityPopValue)) {
      alert("All inputs must be valid numbers.");
      return;
    }
    if (cityPopValue <= 0) {
      alert("City population must be greater than zero.");
      return;
    }

    // Slum Households calculation
    const slumHouseholds = 100 * (slumPopValue / cityPopValue);

    // Standardized formula with absolute value
    let standardizedValue: number = 0;
    let evaluationComment: string = "";

    if (slumHouseholds >= MAX) {
      standardizedValue = 0;
      evaluationComment = "Bad";
    } else if (slumHouseholds > MIN && slumHouseholds < MAX) {
      standardizedValue = 100 * (1 - (slumHouseholds - MIN) / (MAX - MIN));
      evaluationComment = getComment(standardizedValue);
    } else if (slumHouseholds === MIN) {
      standardizedValue = 100;
      evaluationComment = "Good";
    }

    setStandardizedRate(standardizedValue.toFixed(2));
    setEvaluation(evaluationComment);

    // Prepare data to send
    const postData = {
      slums_households: slumHouseholds,
      slums_households_comment: evaluationComment,
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
      <h2 className="text-2xl font-bold mb-4">Slum Households Standardization</h2>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Number of People Living in Slum:
        </label>
        <input
          type="number"
          value={slumPopulation}
          onChange={(e) => setSlumPopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter number of people living in slums"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">City Population:</label>
        <input
          type="number"
          value={cityPopulation}
          onChange={(e) => setCityPopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter total city population"
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
            Standardized Slum Households Rate: {standardizedRate}%
          </h3>
          <h3 className="text-lg">
            Evaluation: {evaluation}
          </h3>
        </div>
      )}
    </div>
  );
};

export default SlumHouseholdsStandardization;