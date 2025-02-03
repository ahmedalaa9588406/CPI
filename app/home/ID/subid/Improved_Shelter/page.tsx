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

  // Add getComment function for evaluation
  const getComment = (score: number) => {
    if (score >= 90) return "VERY SOLID";
    else if (score >= 80) return "SOLID";
    else if (score >= 70) return "MODERATELY SOLID";
    else if (score >= 60) return "MODERATELY WEAK";
    else if (score >= 50) return "WEAK";
    else return "VERY WEAK";
  };

  const calculateImprovedShelter = async () => {
    if (!user) {
      alert("Please sign in to save calculations");
      return;
    }
    const numericTotalHouseholds = Number(totalHouseholds);
    if (numericTotalHouseholds > 0) {
      const numericDurableHouseholds = Number(durableHouseholds);
      const improvedShelter = (numericDurableHouseholds / numericTotalHouseholds) * 100;
      let standardizedImprovedShelter = 100 * ((improvedShelter - MIN) / (MAX - MIN));
      standardizedImprovedShelter = Math.min(Math.max(standardizedImprovedShelter, 0), 100);

      // Update state with results
      setImprovedShelterS(standardizedImprovedShelter);
      setResult(improvedShelter.toFixed(2));

      // Evaluate the decision based on the standardized score
      const evaluationComment = getComment(standardizedImprovedShelter);
      setDecision(evaluationComment);

      // Prepare data to send
      const postData = {
        improved_shelter: improvedShelter,
        improved_shelter_comment: evaluationComment,
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
                decision === "VERY SOLID"
                  ? "bg-green-500"
                  : decision === "SOLID"
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