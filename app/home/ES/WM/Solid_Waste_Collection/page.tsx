"use client";

import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const SolidWasteCollection: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [wasteCollected, setWasteCollected] = useState<number | string>(""); // Volume of waste collected
  const [wasteGenerated, setWasteGenerated] = useState<number | string>(""); // Total volume of waste generated
  const [collectionScore, setCollectionScore] = useState<string | null>(null); // Final score
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Function to calculate solid waste collection score
  const calculateSolidWasteCollection = () => {
    if (!wasteCollected || !wasteGenerated) {
      alert("Please enter both the waste collected and waste generated values.");
      return null;
    }

    const collected = parseFloat(wasteCollected.toString());
    const generated = parseFloat(wasteGenerated.toString());

    if (collected < 0 || generated <= 0) {
      alert("Please ensure waste collected is >= 0 and waste generated is > 0.");
      return null;
    }

    if (collected > generated) {
      alert("Waste collected cannot exceed waste generated.");
      return null;
    }

    // Formula: Solid waste collection (%) = (Volume of waste collected / Total volume of waste generated) * 100
    const score = (collected / generated) * 100;
    setCollectionScore(score.toFixed(2)); // Limit to 2 decimal places
    return score.toFixed(2);
  };

  // Function to handle calculation and saving data
  const handleCalculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const score = calculateSolidWasteCollection();
    if (score === null) return; // Exit if calculation fails

    try {
      setIsSubmitting(true);
      const postData = {
        solid_waste_collection: parseFloat(score), // Post the calculated score
        userId: user.id,
      };

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
      alert("Data calculated and saved successfully!");
      console.log('Result:', result);
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
      <h2 className="text-2xl font-bold mb-4">Solid Waste Collection Evaluation</h2>

      <div className="mb-4">
        <label htmlFor="wasteCollected" className="block mb-2 font-semibold">
          Volume of Waste Collected (units):
        </label>
        <input
          id="wasteCollected"
          type="number"
          value={wasteCollected}
          onChange={(e) => setWasteCollected(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter waste collected"
          aria-label="Enter volume of waste collected"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="wasteGenerated" className="block mb-2 font-semibold">
          Total Volume of Waste Generated (units):
        </label>
        <input
          id="wasteGenerated"
          type="number"
          value={wasteGenerated}
          onChange={(e) => setWasteGenerated(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter waste generated"
          aria-label="Enter total volume of waste generated"
        />
      </div>

      <button
        onClick={handleCalculateAndSave}
        disabled={isSubmitting}
        className={`p-2 bg-green-500 text-white rounded w-full hover:bg-green-600 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Calculate and Save"
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate and Save'}
      </button>

      {collectionScore !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Solid Waste Collection Score: {collectionScore}%
          </h3>
        </div>
      )}
    </div>
  );
};

export default SolidWasteCollection;