"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

function AverageDailyTravelTimeForm() {
  const { user, isLoaded } = useUser();
  const [averageTravelTime, setAverageTravelTime] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [standardizedTime, setStandardizedTime] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Constants
  const X = 30; // Benchmark average travel time in minutes

  const calculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const numericAverageTravelTime = Number(averageTravelTime);

    if (isNaN(numericAverageTravelTime)) {
      alert("Please enter a valid number for average travel time.");
      return;
    }

    if (numericAverageTravelTime < 0) {
      alert("Average travel time must be a non-negative number.");
      return;
    }

    // Standardized Travel Time (S) Calculation
    let standardizedTravelTime: number;
    if (numericAverageTravelTime >= 2 * X) {
      standardizedTravelTime = 0; // If travel time >= 2 * X
    } else if (numericAverageTravelTime > X) {
      standardizedTravelTime =
        100 * (1 - (numericAverageTravelTime - X) / (X - 30));
    } else {
      standardizedTravelTime = 100; // If travel time <= X
    }
    setStandardizedTime(standardizedTravelTime);
    setResult(numericAverageTravelTime.toFixed(2));

    // Determine the decision message
    if (numericAverageTravelTime >= 2 * X) {
      setDecision("Very Poor Travel Time");
    } else if (numericAverageTravelTime > X) {
      setDecision("Moderate Travel Time");
    } else {
      setDecision("Optimal Travel Time");
    }

    // Prepare data to send
    const postData = {
      average_daily_travel_time: numericAverageTravelTime,      
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
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Calculate Average Daily Travel Time
      </h1>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Average Daily Travel Time (in minutes):
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={averageTravelTime}
            onChange={(e) => setAverageTravelTime(e.target.value)}
            required
          />
        </label>
      </div>
      <button
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate'}
      </button>
      {result !== null && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-lg">Average Daily Travel Time: {result} minutes</p>
          <p className="text-sm text-gray-600">Standardized Travel Time (S):</p>
          <ul className="list-disc pl-5">
            <li>{standardizedTime?.toFixed(2)}%</li>
          </ul>
          {decision && (
            <p
              className={`mt-4 p-2 text-center font-bold text-white rounded-md ${
                decision === "Optimal Travel Time"
                  ? "bg-green-500"
                  : decision === "Very Poor Travel Time"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            >
              {decision}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default AverageDailyTravelTimeForm;