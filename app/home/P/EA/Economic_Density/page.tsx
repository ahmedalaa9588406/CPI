"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const EconomicDensityCalculator: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [cityProduct, setCityProduct] = useState<number | undefined>();
  const [cityArea, setCityArea] = useState<number | undefined>();
  const [economicDensity, setEconomicDensity] = useState<number>(0); // Economic Density
  const [standardizedEconomicDensity, setStandardizedEconomicDensity] = useState<number>(0); // Standardized Economic Density
  const [decision, setDecision] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Constants
  const benchmark = 857.37; // X* benchmark in million PPP/km²

  // Add getComment function for evaluation
  const getComment = (score: number) => {
    if (score >= 80) return "VERY SOLID";
    else if (score >= 70) return "SOLID";
    else if (score >= 60) return "MODERATELY SOLID";
    else if (score >= 50) return "MODERATELY WEAK";
    else if (score >= 40) return "WEAK";
    else return "VERY WEAK";
  };

  const calculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }
    if (!cityArea || cityArea === 0) {
      alert("City area cannot be zero.");
      return;
    }
    if (!cityProduct || cityProduct < 0) {
      alert("Please enter a valid city product.");
      return;
    }

    // Calculate Economic Density
    const density = cityProduct / cityArea;
    setEconomicDensity(density);

    // Standardized Economic Density Formula
    let standardized = 100 * (1 - Math.abs((density - benchmark) / benchmark));
    if (standardized > 100) {
      standardized = 100;
    } else if (standardized < 0) {
      standardized = 0;
    }
    setStandardizedEconomicDensity(standardized);

    // Evaluate the decision based on the standardized score
    const evaluationComment = getComment(standardized);
    setDecision(evaluationComment);

    // Prepare data to send
    const postData = {
      economic_density: density,
      economic_density_comment: evaluationComment, // Renamed for consistency
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
    <div className="max-w-lg mx-auto p-10 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Economic Density Calculator</h1>

      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          City Product (in million PPP):
        </label>
        <input
          type="number"
          value={cityProduct !== undefined ? cityProduct : ""}
          onChange={(e) => setCityProduct(Number(e.target.value) || undefined)}
          className="border rounded-lg p-4 w-full text-lg"
          placeholder="Enter the city product"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          City Area (in square kilometers):
        </label>
        <input
          type="number"
          value={cityArea !== undefined ? cityArea : ""}
          onChange={(e) => setCityArea(Number(e.target.value) || undefined)}
          className="border rounded-lg p-4 w-full text-lg"
          placeholder="Enter the city area"
        />
      </div>
      <button
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`p-4 bg-blue-600 text-white rounded-lg w-full text-xl hover:bg-blue-700 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate Economic Density'}
      </button>
      {decision && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-4">
            Economic Density: {economicDensity.toFixed(2)} (million PPP/km²)
          </h2>
          <h2 className="text-xl font-semibold mb-4">
            Standardized Economic Density: {standardizedEconomicDensity.toFixed(2)}
          </h2>
          <h2 className="text-xl font-semibold">
            Decision:{" "}
            <span
              className={`${
                decision === "VERY SOLID"
                  ? "text-green-600"
                  : decision === "SOLID"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {decision}
            </span>
          </h2>
        </div>
      )}
    </div>
  );
};

export default EconomicDensityCalculator;