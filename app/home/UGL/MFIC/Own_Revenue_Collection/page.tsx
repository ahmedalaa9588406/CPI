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

    const percentage = (ownRevenue / totalRevenue) * 100;
    setOwnRevenuePercentage(percentage);

    // Standardization logic
    const min = 17;
    const max = 80;
    let standardized;
    if (percentage >= max) {
      standardized = 100;
    } else if (percentage <= min) {
      standardized = 0;
    } else {
      standardized =
        100 * ((percentage - min) / (max - min));
    }
    setStandardizedValue(standardized);

    // Decision Logic
    let decisionText;
    if (percentage >= max) {
      decisionText = "Excellent";
    } else if (percentage > min && percentage < max) {
      decisionText = "Moderate";
    } else {
      decisionText = "Low";
    }
    setDecision(decisionText);

    // Prepare data to send
    const postData = {
      own_revenue_collection: percentage,
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
          <h2 className="text-xl font-semibold">
            Decision: {decision}
          </h2>
        </div>
      )}
    </div>
  );
};

export default OwnRevenueCollection;