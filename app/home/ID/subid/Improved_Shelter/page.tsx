"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";

function ImprovedShelterForm() {
  const { user, isLoaded } = useUser();
  const [durableHouseholds, setDurableHouseholds] = useState("");
  const [totalHouseholds, setTotalHouseholds] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [improvedShelterS, setImprovedShelterS] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Constants
  const MIN = 84.8;
  const MAX = 98.4;

  const calculateImprovedShelter = async () => {
    if (!user) {
      alert("Please sign in to save calculations");
      return;
    }

    const numericTotalHouseholds = Number(totalHouseholds);
    if (numericTotalHouseholds > 0) {
      const numericDurableHouseholds = Number(durableHouseholds);
      const improvedShelter = (numericDurableHouseholds / numericTotalHouseholds) * 100;
      const standardizedImprovedShelter = Math.min(Math.max(100 * ((improvedShelter - MIN) / (MAX - MIN)), 0), 100);

      setImprovedShelterS(standardizedImprovedShelter);
      setResult(improvedShelter.toFixed(2));

      try {
        setIsSubmitting(true);
        const response = await fetch('/api/calculation-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            improved_shelter: improvedShelter,
            userId: user.id
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to store data');
        }

        // Set decision after successful save
        if (standardizedImprovedShelter >= 98.4) {
          setDecision("Perfect");
        } else if (standardizedImprovedShelter >= 84.8) {
          setDecision("Good");
        } else {
          setDecision("Bad");
        }

      } catch (error) {
        console.error('Error storing data:', error);
        alert('Failed to store the calculation result: ' + (error as Error).message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert("Total households must be greater than zero.");
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Calculate Improved Shelter
      </h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Durable Households:
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={durableHouseholds}
            onChange={(e) => setDurableHouseholds(e.target.value)}
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
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
        onClick={calculateImprovedShelter}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Calculate'}
      </button>
      {result !== null && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-lg">Improved Shelter: {result}%</p>
          <p className="text-sm text-gray-600">Improved Shelter (S):</p>
          <ul className="list-disc pl-5">
            <li>Improved Shelter Standardized: {improvedShelterS?.toFixed(2)}%</li>
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

export default ImprovedShelterForm;
