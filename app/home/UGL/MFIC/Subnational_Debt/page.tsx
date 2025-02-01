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

  const xStar = 60; // Benchmark value (60%)

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

    const debtRatio = (debt / revenue) * 100;

    let standardized;
    if (debtRatio >= 2 * xStar) {
      standardized = 0;
    } else if (debtRatio > xStar && debtRatio < 2 * xStar) {
      standardized =
        100 * (1 - Math.abs((debtRatio - xStar) / (2 * xStar - xStar)));
    } else {
      standardized = 100;
    }
    setStandardizedValue(standardized);

    // Decision Logic
    let decisionText;
    if (debtRatio >= 2 * xStar) {
      decisionText = "Poor";
    } else if (debtRatio <= xStar) {
      decisionText = "Excellent";
    } else {
      decisionText = "Moderate";
    }
    setDecision(decisionText);

    // Prepare data to send
    const postData = {
      subnational_debt: debtRatio,
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
          <h2 className="text-xl font-semibold">
            Decision: {decision}
          </h2>
        </div>
      )}
    </div>
  );
};

export default SubnationalDebtIndicator;