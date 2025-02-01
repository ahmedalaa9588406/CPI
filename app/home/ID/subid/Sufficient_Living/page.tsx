"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";

function SufficientLivingForm() {
  const { user, isLoaded } = useUser();
  const [durableHouseholds, setDurableHouseholds] = useState("");
  const [totalHouseholds, setTotalHouseholds] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [sufficientLivingS, setSufficientLivingS] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Constants
  const MIN = 2.50;
  const MAX = 57.80;

  const calculateSufficientLiving = async () => {
    if (!user) {
      alert("Please sign in to save calculations");
      return;
    }

    const numericTotalHouseholds = Number(totalHouseholds);
    if (numericTotalHouseholds > 0) {
      const numericDurableHouseholds = Number(durableHouseholds);
      const sufficient_living = (numericDurableHouseholds / numericTotalHouseholds) * 100;

      let standardizedSufficientLiving = 100 * ((Math.pow(sufficient_living, 0.25) - Math.pow(MIN, 0.25)) / 
        (Math.pow(MAX, 0.25) - Math.pow(MIN, 0.25)));
      standardizedSufficientLiving = Math.min(Math.max(standardizedSufficientLiving, 0), 100);

      setSufficientLivingS(standardizedSufficientLiving);
      setResult(sufficient_living.toFixed(2));

      try {
        setIsSubmitting(true);
        const response = await fetch('/api/calculation-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sufficient_living: sufficient_living,
            userId: user.id
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to store data');
        }

        if (sufficient_living >= 2.76) {
          setDecision("Perfect");
        } else if (sufficient_living > 1.26) {
          setDecision("Good");
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
        Calculate Sufficient Living
      </h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Number of Households with Sufficient Living Area:
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
        onClick={calculateSufficientLiving}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Calculate'}
      </button>
      {result !== null && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-lg">Sufficient Living: {result}%</p>
          <p className="text-sm text-gray-600">Sufficient Living (S):</p>
          <ul className="list-disc pl-5">
            <li>Sufficient Living Standardized: {sufficientLivingS?.toFixed(2)}%</li>
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

export default SufficientLivingForm;
