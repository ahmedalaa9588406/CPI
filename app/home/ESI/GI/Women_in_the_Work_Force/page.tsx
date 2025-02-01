"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const WomenInWorkforce: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [womenInWorkforce, setWomenInWorkforce] = useState<number | string>(""); // Number of women in non-agricultural paid employment
  const [totalNonAgriEmployment, setTotalNonAgriEmployment] = useState<number | string>(""); // Total number of people in non-agricultural paid employment
  const [standardizedRate, setStandardizedRate] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<string | null>(null); // Decision evaluation
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Benchmark
  const BENCHMARK = 50; // X* = 50%

  const calculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    // Convert inputs to numbers
    const womenInWorkforceNum = parseFloat(womenInWorkforce.toString());
    const totalNonAgriEmploymentNum = parseFloat(totalNonAgriEmployment.toString());

    // Validate inputs
    if (isNaN(womenInWorkforceNum) || isNaN(totalNonAgriEmploymentNum)) {
      alert("All inputs must be valid numbers.");
      return;
    }
    if (totalNonAgriEmploymentNum <= 0) {
      alert("Total number of people in non-agricultural employment must be greater than zero.");
      return;
    }

    // Women in the workforce formula
    const workforcePercentage = (womenInWorkforceNum / totalNonAgriEmploymentNum) * 100;

    // Standardized formula with absolute value
    const standardizedValue =
      100 * (1 - Math.abs((workforcePercentage - BENCHMARK) / BENCHMARK));

    // Decision logic
    let standardizedRateValue: number = 0;
    let evaluationComment: string = "Bad";

    if (workforcePercentage === 0 || workforcePercentage >= 2 * BENCHMARK) {
      standardizedRateValue = 0;
      evaluationComment = "Bad";
    } else if (workforcePercentage > 0 && workforcePercentage < 2 * BENCHMARK) {
      standardizedRateValue = standardizedValue;
      evaluationComment = "Average";
    } else if (workforcePercentage === BENCHMARK) {
      standardizedRateValue = 100;
      evaluationComment = "Good";
    }

    setStandardizedRate(standardizedRateValue.toFixed(2));
    setEvaluation(evaluationComment);

    // Prepare data to send
    const postData = {
      women_in_local_work_force:workforcePercentage,
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
      <h2 className="text-2xl font-bold mb-4">Women in the Workforce</h2>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Number of Women in Non-Agricultural Paid Employment:
        </label>
        <input
          type="number"
          value={womenInWorkforce}
          onChange={(e) => setWomenInWorkforce(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter number of women"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Total Number of People in Non-Agricultural Paid Employment:
        </label>
        <input
          type="number"
          value={totalNonAgriEmployment}
          onChange={(e) => setTotalNonAgriEmployment(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter total employment"
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
            Standardized Women in Workforce: {standardizedRate}%
          </h3>
          <h3 className="text-lg">
            Evaluation: {evaluation}
          </h3>
        </div>
      )}
    </div>
  );
};

export default WomenInWorkforce;