"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

function PhysicianDensityForm() {
  const { user, isLoaded } = useUser();
  const [physicians, setPhysicians] = useState<string>("");
  const [totalPopulation, setTotalPopulation] = useState<string>("");
  const [physicianDensity, setPhysicianDensity] = useState<string | null>(null);
  const [standardizedDensity, setStandardizedDensity] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Constants for benchmarking
  const MIN = 0.01;
  const MAX = 7.74;

  const calculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const numericPopulation = Number(totalPopulation);
    if (numericPopulation <= 0) {
      alert("Total population must be greater than zero.");
      return;
    }

    const numericPhysicians = Number(physicians);
    if (isNaN(numericPhysicians) || isNaN(numericPopulation)) {
      alert("Please enter valid numbers for both fields.");
      return;
    }

    const density = (numericPhysicians / numericPopulation) * 1000;
    setPhysicianDensity(density.toFixed(2));

    let standardized = 1000 * ((Math.sqrt(density) - Math.sqrt(MIN)) / (Math.sqrt(MAX) - Math.sqrt(MIN)));
    if (standardized > 100) {
      standardized = 100;
    } else if (standardized < 0) {
      standardized = 0;
    }
    setStandardizedDensity(standardized);

    // Determine decision message
    if (Math.sqrt(density) >= Math.sqrt(MAX)) {
      setDecision("Perfect");
    } else if (Math.sqrt(density) > Math.sqrt(MIN) && Math.sqrt(density) < Math.sqrt(MAX)) {
      setDecision("Good");
    } else {
      setDecision("Poor");
    }

    // Prepare data to send
    const postData = {
      physician_density:density,
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
        Calculate Physician Density
      </h1>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Number of Physicians:
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={physicians}
            onChange={(e) => setPhysicians(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Total Population:
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
      {physicianDensity !== null && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-lg">Physician Density: {physicianDensity} per 1,000 people</p>
          <p className="text-sm text-gray-600">Standardized Physician Density (S):</p>
          <ul className="list-disc pl-5">
            <li>Standardized Value: {standardizedDensity?.toFixed(2)}%</li>
          </ul>
          {decision && (
            <p
              className={`mt-4 p-2 text-center font-bold text-white rounded-md ${
                decision === "Perfect"
                  ? "bg-green-500"
                  : decision === "Good"
                  ? "bg-yellow-500"
                  : "bg-red-500"
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

export default PhysicianDensityForm;