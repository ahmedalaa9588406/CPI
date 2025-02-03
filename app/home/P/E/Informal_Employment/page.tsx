"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const InformalEmploymentCalculator: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [informalEmployees, setInformalEmployees] = useState<number | undefined>();
  const [totalEmployedPersons, setTotalEmployedPersons] = useState<number | undefined>();
  const [informalEmployment, setInformalEmployment] = useState<number>(0); // Informal Employment Ratio
  const [standardizedInformalEmployment, setStandardizedInformalEmployment] = useState<number>(0); // Standardized Informal Employment
  const [decision, setDecision] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Constants
  const min = 11; // Minimum benchmark
  const max = 75; // Maximum benchmark

  // Add getComment function for evaluation
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
    if (!totalEmployedPersons || totalEmployedPersons === 0) {
      alert("Total number of employed persons cannot be zero.");
      return;
    }
    if (!informalEmployees || informalEmployees < 0) {
      alert("Please enter a valid number of informal employees.");
      return;
    }

    // Calculate Informal Employment Ratio
    const ratio = (informalEmployees / totalEmployedPersons) * 100;
    setInformalEmployment(ratio);

    // Standardized Informal Employment Formula
    let standardized = 100 * (1 - (Math.pow(ratio, 0.25) - Math.pow(min, 0.25)) / (Math.pow(max, 0.25) - Math.pow(min, 0.25)));
    if (standardized > 100) {
      standardized = 100;
    } else if (standardized < 0) {
      standardized = 0;
    }
    setStandardizedInformalEmployment(standardized);

    // Evaluate the decision based on the standardized score
    const evaluationComment = getComment(standardized);
    setDecision(evaluationComment);

    // Prepare data to send
    const postData = {
      informal_employment: ratio,
      informal_employment_comment: evaluationComment, // Renamed for consistency
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
        Informal Employment Calculator
      </h1>

      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Number of Informal Employees:
        </label>
        <input
          type="number"
          value={informalEmployees !== undefined ? informalEmployees : ""}
          onChange={(e) => setInformalEmployees(Number(e.target.value) || undefined)}
          className="border rounded-lg p-4 w-full text-lg"
          placeholder="Enter number of informal employees"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Total Number of Employed Persons:
        </label>
        <input
          type="number"
          value={totalEmployedPersons !== undefined ? totalEmployedPersons : ""}
          onChange={(e) => setTotalEmployedPersons(Number(e.target.value) || undefined)}
          className="border rounded-lg p-4 w-full text-lg"
          placeholder="Enter total number of employed persons"
        />
      </div>
      <button
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`p-4 bg-blue-600 text-white rounded-lg w-full text-xl hover:bg-blue-700 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate Informal Employment'}
      </button>
      {decision && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-4">
            Informal Employment Ratio: {informalEmployment.toFixed(2)}%
          </h2>
          <h2 className="text-xl font-semibold mb-4">
            Standardized Informal Employment: {standardizedInformalEmployment.toFixed(2)}
          </h2>
          <h2 className="text-xl font-semibold">
            Decision:{" "}
            <span
              className={`${
                decision === "VERY SOLID"
                  ? "text-green-600"
                  : decision === "SOLID"
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

export default InformalEmploymentCalculator;