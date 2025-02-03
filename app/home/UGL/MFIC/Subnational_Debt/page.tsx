"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const SubnationalDebtIndicator: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [totalDebt, setTotalDebt] = useState<number | string>("");
  const [totalRevenue, setTotalRevenue] = useState<number | string>("");
  const [standardizedValue, setStandardizedValue] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const X_STAR = 60; // Benchmark value (60%)

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
    const debt = parseFloat(totalDebt.toString());
    const revenue = parseFloat(totalRevenue.toString());

    if (isNaN(debt) || isNaN(revenue) || debt <= 0 || revenue <= 0) {
      alert("Please provide valid inputs for both fields.");
      return;
    }

    // Calculate debt ratio
    const debtRatio = (debt / revenue) * 100;

    // Standardize the value
    let standardized;
    if (debtRatio >= 2 * X_STAR) {
      standardized = 0;
    } else if (debtRatio > X_STAR && debtRatio < 2 * X_STAR) {
      standardized =
        100 * (1 - Math.abs((debtRatio - X_STAR) / (2 * X_STAR - X_STAR)));
    } else {
      standardized = 100;
    }
    setStandardizedValue(standardized);

    // Evaluate the decision based on the standardized score
    const evaluationComment = getComment(standardized);
    setDecision(evaluationComment);

    // Prepare data to send
    const postData = {
      subnational_debt: debtRatio,
      subnational_debt_comment: evaluationComment, // Renamed for consistency
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
      <h1 className="text-2xl font-bold mb-6 text-center">Subnational Debt Indicator</h1>

      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Total Existing Debt:
        </label>
        <input
          type="number"
          value={totalDebt}
          onChange={(e) => setTotalDebt(e.target.value)}
          className="border rounded p-4 w-full text-lg"
          placeholder="Enter total existing debt"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Total Current Revenue:
        </label>
        <input
          type="number"
          value={totalRevenue}
          onChange={(e) => setTotalRevenue(e.target.value)}
          className="border rounded p-4 w-full text-lg"
          placeholder="Enter total current revenue"
        />
      </div>
      <button
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`p-4 bg-blue-600 text-white rounded-lg w-full text-xl hover:bg-blue-700 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate Subnational Debt'}
      </button>
      {standardizedValue !== null && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-4">
            Standardized Value: {standardizedValue.toFixed(2)}
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

export default SubnationalDebtIndicator;