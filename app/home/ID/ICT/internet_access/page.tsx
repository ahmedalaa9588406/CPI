"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

function InternetAccessForm() {
  const { user, isLoaded } = useUser();
  const [internetHouseholds, setInternetHouseholds] = useState<string>("");
  const [totalHouseholds, setTotalHouseholds] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const calculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const numericTotalHouseholds = Number(totalHouseholds);
    if (numericTotalHouseholds <= 0) {
      alert("Total households must be greater than zero.");
      return;
    }

    const numericInternetHouseholds = Number(internetHouseholds);
    if (isNaN(numericInternetHouseholds) || isNaN(numericTotalHouseholds)) {
      alert("Please enter valid numbers for both fields.");
      return;
    }

    const internetAccess =
      (numericInternetHouseholds / numericTotalHouseholds) * 100;
    setResult(internetAccess.toFixed(2));

    // Prepare data to send
    const postData = {
      internet_access:internetAccess,
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
        Calculate Internet Access
      </h1>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Number of Households with Internet Access:
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={internetHouseholds}
            onChange={(e) => setInternetHouseholds(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Total Households:
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={totalHouseholds}
            onChange={(e) => setTotalHouseholds(e.target.value)}
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
          <p className="text-lg">Internet Access: {result}%</p>
        </div>
      )}
    </div>
  );
}

export default InternetAccessForm;