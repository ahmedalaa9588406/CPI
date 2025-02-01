"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

function LiteracyRateCalculator() {
  const { user, isLoaded } = useUser();
  const [literatePopulation, setLiteratePopulation] = useState<string>("");
  const [totalPopulation, setTotalPopulation] = useState<string>("");
  const [literacyRate, setLiteracyRate] = useState<number | null>(null);
  const [standardizedRate, setStandardizedRate] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const calculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const literate = parseFloat(literatePopulation);
    const total = parseFloat(totalPopulation);

    if (isNaN(literate) || isNaN(total) || total <= 0) {
      alert("Please provide valid inputs for both fields.");
      return;
    }

    const rate = (literate / total) * 100;
    setLiteracyRate(rate);

    // Standardization logic
    const min = 15.0;
    const max = 99.9;
    let standardized;
    if (rate >= max) {
      standardized = 100;
    } else if (rate <= min) {
      standardized = 0;
    } else {
      standardized = 100 * ((rate - min) / (max - min));
    }
    setStandardizedRate(standardized);

    // Prepare data to send
    const postData = {
      literacy_rate: rate,
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
      <h1 className="text-2xl font-bold mb-6 text-center">Literacy Rate Calculator</h1>
      
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Literate Population (15 years and over):
        </label>
        <input
          type="number"
          value={literatePopulation}
          onChange={(e) => setLiteratePopulation(e.target.value)}
          className="border rounded-lg p-4 w-full text-lg"
          placeholder="Enter literate population"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Total Population (15 years and over):
        </label>
        <input
          type="number"
          value={totalPopulation}
          onChange={(e) => setTotalPopulation(e.target.value)}
          className="border rounded-lg p-4 w-full text-lg"
          placeholder="Enter total population"
        />
      </div>
      <button
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`p-4 bg-blue-600 text-white rounded-lg w-full text-xl hover:bg-blue-700 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate Literacy Rate'}
      </button>
      {literacyRate !== null && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-4">
            Literacy Rate: {literacyRate.toFixed(2)}%
          </h2>
          <h2 className="text-xl font-semibold mb-4">
            Standardized Literacy Rate: {standardizedRate?.toFixed(2)}
          </h2>
        </div>
      )}
    </div>
  );
}

export default LiteracyRateCalculator;