"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const OwnRevenueCollection: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [ownSourceRevenue, setOwnSourceRevenue] = useState<number | string>("");
  const [totalLocalRevenue, setTotalLocalRevenue] = useState<number | string>("");
  const [ownRevenuePercentage, setOwnRevenuePercentage] = useState<number | null>(null);
  const [standardizedValue, setStandardizedValue] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const MIN_PERCENTAGE = 17; // Minimum benchmark
  const MAX_PERCENTAGE = 80; // Maximum benchmark

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
    const ownRevenue = parseFloat(ownSourceRevenue.toString());
    const totalRevenue = parseFloat(totalLocalRevenue.toString());

    if (isNaN(ownRevenue) || isNaN(totalRevenue) || totalRevenue <= 0) {
      alert("Please provide valid inputs for both fields.");
      return;
    }

    // Calculate own revenue percentage
    const percentage = (ownRevenue / totalRevenue) * 100;
    setOwnRevenuePercentage(percentage);

    // Standardize the value
    let standardized;
    if (percentage >= MAX_PERCENTAGE) {
      standardized = 100;
    } else if (percentage <= MIN_PERCENTAGE) {
      standardized = 0;
    } else {
      standardized =
        100 * ((percentage - MIN_PERCENTAGE) / (MAX_PERCENTAGE - MIN_PERCENTAGE));
    }
    setStandardizedValue(standardized);

    // Evaluate the decision based on the standardized score
    const evaluationComment = getComment(standardized);
    setDecision(evaluationComment);

    // Prepare data to send
    const postData = {
      own_revenue_collection: percentage,
      own_revenue_collection_comment: evaluationComment, // Renamed for consistency
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
      <h1 className="text-2xl font-bold mb-6 text-center">Own Revenue Collection Calculator</h1>

      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Own Source Revenue:
        </label>
        <input
          type="number"
          value={ownSourceRevenue}
          onChange={(e) => setOwnSourceRevenue(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter own source revenue"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Total Local Revenue:
        </label>
        <input
          type="number"
          value={totalLocalRevenue}
          onChange={(e) => setTotalLocalRevenue(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter total local revenue"
        />
      </div>
      <button
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`p-4 bg-blue-600 text-white rounded-lg w-full text-xl hover:bg-blue-700 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate Own Revenue Collection'}
      </button>
      {ownRevenuePercentage !== null && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-4">
            Own Revenue Collection: {ownRevenuePercentage.toFixed(2)}%
          </h2>
          <h2 className="text-xl font-semibold mb-4">
            Standardized Value: {standardizedValue?.toFixed(2)}
          </h2>
          {decision && (
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
          )}
        </div>
      )}
    </div>
  );
};

export default OwnRevenueCollection;