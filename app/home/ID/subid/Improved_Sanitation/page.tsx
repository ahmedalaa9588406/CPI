"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";

function ImprovedSanitationForm() {
  const { user, isLoaded } = useUser();
  const [improvedSanitationHouseholds, setImprovedSanitationHouseholds] = useState("");
  const [totalHouseholds, setTotalHouseholds] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [improvedSanitationS, setImprovedSanitationS] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Constants
  const MIN = 15;
  const MAX = 100;

  const calculateImprovedSanitation = async () => {
    if (!user) {
      alert("Please sign in to save calculations");
      return;
    }

    const numericTotalHouseholds = Number(totalHouseholds);
    if (numericTotalHouseholds > 0) {
      const numericImprovedHouseholds = Number(improvedSanitationHouseholds);
      const improvedSanitation = (numericImprovedHouseholds / numericTotalHouseholds) * 100;

      let standardizedImprovedSanitation = 100 * ((improvedSanitation - MIN) / (MAX - MIN));
      standardizedImprovedSanitation = Math.min(Math.max(standardizedImprovedSanitation, 0), 100);

      setImprovedSanitationS(standardizedImprovedSanitation);
      setResult(improvedSanitation.toFixed(2));

      try {
        setIsSubmitting(true);
        const response = await fetch('/api/calculation-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            improved_sanitation: improvedSanitation,
            userId: user.id
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to store data');
        }

        if (standardizedImprovedSanitation > 15) {
          setDecision("Perfect");
        } else {
          setDecision("Bad");
        }

      } catch (error) {
        console.error('Error storing data:', error);
        alert('Failed to store the calculation result');
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
        Calculate Improved Sanitation
      </h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Number Of Households With Improved Sanitation:
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={improvedSanitationHouseholds}
            onChange={(e) => setImprovedSanitationHouseholds(e.target.value)}
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
        onClick={calculateImprovedSanitation}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Calculate'}
      </button>
      {result !== null && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-lg">Improved Sanitation: {result}%</p>
          <p className="text-sm text-gray-600">Improved Sanitation (S):</p>
          <ul className="list-disc pl-5">
            <li>Improved Sanitation Standardized: {improvedSanitationS?.toFixed(2)}%</li>
          </ul>
          {decision && (
            <p
              className={`mt-4 p-2 text-center font-bold text-white rounded-md ${
                decision === "Perfect"
                  ? "bg-green-500"
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

export default ImprovedSanitationForm;
