"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

function LengthMassTransportNetworkForm() {
  const { user, isLoaded } = useUser();
  const [totalLength, setTotalLength] = useState<string>("");
  const [totalPopulation, setTotalPopulation] = useState<string>("");
  const [lengthPerMillion, setLengthPerMillion] = useState<number | null>(null);
  const [standardizedScore, setStandardizedScore] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Constants
  const X = 80; // Benchmark value: 80 km per 1,000,000 people

  const calculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const numericTotalLength = parseFloat(totalLength);
    const numericTotalPopulation = parseFloat(totalPopulation);

    if (isNaN(numericTotalLength) || isNaN(numericTotalPopulation)) {
      alert("Please enter valid numbers for both fields.");
      return;
    }

    if (numericTotalLength <= 0 || numericTotalPopulation <= 0) {
      alert("Both total length and total population must be positive numbers.");
      return;
    }

    // Length of mass transport network (L)
    const lengthPerMillionValue =
      (numericTotalLength / numericTotalPopulation) * 1_000_000;
    setLengthPerMillion(lengthPerMillionValue);

    // Standardized score (S)
    let standardizedScoreValue: number;
    if (lengthPerMillionValue >= X) {
      standardizedScoreValue = 100; // If length >= benchmark X
    } else if (lengthPerMillionValue < 0) {
      standardizedScoreValue = 0;
    } else {
      standardizedScoreValue =
        100 * (1 - Math.abs((lengthPerMillionValue - X) / X));
    }
    setStandardizedScore(standardizedScoreValue);

    // Decision based on the standardized score
    if (lengthPerMillionValue >= X) {
      setDecision("Excellent Transport Network Coverage");
    } else if (lengthPerMillionValue < 0) {
      setDecision("Very Poor Transport Network Coverage");
    } else {
      setDecision("Moderate Transport Network Coverage");
    }

    // Prepare data to send
    const postData = {
      length_of_mass_transport_network: lengthPerMillionValue,

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
        Length of Mass Transport Network Calculator
      </h1>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Total Length of Mass Transport Lanes (in km):
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={totalLength}
            onChange={(e) => setTotalLength(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Total Population of City (in people):
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={totalPopulation}
            onChange={(e) => setTotalPopulation(e.target.value)}
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
      {(lengthPerMillion !== null || standardizedScore !== null) && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          {lengthPerMillion !== null && (
            <p className="text-lg">
              Length of Mass Transport Network (per 1,000,000 people):{" "}
              {lengthPerMillion.toFixed(2)} km
            </p>
          )}
          {standardizedScore !== null && (
            <p className="text-lg">
              Standardized Transport Network Score: {standardizedScore.toFixed(2)}%
            </p>
          )}
          {decision && (
            <p
              className={`mt-4 p-2 text-center font-bold text-white rounded-md ${
                decision === "Excellent Transport Network Coverage"
                  ? "bg-green-500"
                  : decision === "Very Poor Transport Network Coverage"
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

export default LengthMassTransportNetworkForm;