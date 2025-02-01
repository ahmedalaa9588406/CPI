"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";

function ImprovedWaterForm() {
  const { user, isLoaded } = useUser();
  const [durableHouseholds, setDurableHouseholds] = useState("");
  const [totalHouseholds, setTotalHouseholds] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [improvedWaterS, setImprovedWaterS] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Constants
  const MIN = 50;
  const MAX = 100;

  const calculateImprovedWater = async () => {
    if (!user) {
      alert("Please sign in to save calculations");
      return;
    }

    const numericTotalHouseholds = Number(totalHouseholds);
    if (numericTotalHouseholds > 0) {
      const numericDurableHouseholds = Number(durableHouseholds);
      const improvedWater = (numericDurableHouseholds / numericTotalHouseholds) * 100;

      let standardizedImprovedWater = 100 * ((improvedWater - MIN) / (MAX - MIN));
      standardizedImprovedWater = Math.min(Math.max(standardizedImprovedWater, 0), 100);

      setImprovedWaterS(standardizedImprovedWater);
      setResult(improvedWater.toFixed(2));

      try {
        setIsSubmitting(true);
        const response = await fetch('/api/calculation-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            improved_water: improvedWater,
            userId: user.id
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to store data');
        }

        // Set decision after successful save
        if (standardizedImprovedWater > 50) {
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
        Calculate Improved Water
      </h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Number Of Households With Sustainable Access to Piped Water Source:
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
        onClick={calculateImprovedWater}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Calculate'}
      </button>
      {result !== null && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-lg">Improved Water: {result}%</p>
          <p className="text-sm text-gray-600">Improved Water (S):</p>
          <ul className="list-disc pl-5">
            <li>Improved Water Standardized: {improvedWaterS?.toFixed(2)}%</li>
          </ul>
          {decision && (
            <p
              className={`mt-4 p-2 text-center font-bold text-white rounded-md ${
                decision === "Perfect"
                  ? "bg-green-500"
                  : decision === "Bad"
                  ?  "bg-red-500"
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

export default ImprovedWaterForm;
