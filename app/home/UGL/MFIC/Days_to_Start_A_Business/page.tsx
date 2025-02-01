"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const DaysToStartBusiness: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [daysToStart, setDaysToStart] = useState<number | string>("");
  const [standardizedValue, setStandardizedValue] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const min = 2;
  const max = 208;

  const calculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const days = parseFloat(daysToStart.toString());

    if (isNaN(days) || days <= 0) {
      alert("Please provide a valid number of days.");
      return;
    }

    const lnDays = Math.log(days);
    const lnMin = Math.log(min);
    const lnMax = Math.log(max);
    const lnDifference = lnMax - lnMin;

    if (lnDifference === 0) {
      alert("Invalid calculation");
      return;
    }

    let standardizedValue;
    if (lnDays >= 5.34) {
      standardizedValue = 0;
    } else if (lnDays <= 0.69) {
      standardizedValue = 100;
    } else {
      standardizedValue = 100 * (1 - (lnDays - lnMin) / lnDifference);
    }
    setStandardizedValue(standardizedValue);

    // Decision Logic
    let decisionText;
    if (lnDays >= 5.34) {
      decisionText = "Poor";
    } else if (lnDays <= 0.69) {
      decisionText = "Excellent";
    } else {
      decisionText = "Moderate";
    }
    setDecision(decisionText);

    // Prepare data to send
    const postData = {
      days_to_start_a_business: days,
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
      <h1 className="text-2xl font-bold mb-6 text-center">Days to Start a Business Calculator</h1>
      
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Days to Start a Business:
        </label>
        <input
          type="number"
          value={daysToStart}
          onChange={(e) => setDaysToStart(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter the number of days"
        />
      </div>
      <button
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`p-4 bg-blue-600 text-white rounded-lg w-full text-xl hover:bg-blue-700 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate Standardized Value'}
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

export default DaysToStartBusiness;