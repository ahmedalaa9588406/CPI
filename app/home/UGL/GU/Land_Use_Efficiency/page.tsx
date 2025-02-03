"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const LandUseEfficiencyIndicator: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [urbInit, setUrbInit] = useState<number | string>(""); // Built-up area in the initial year
  const [urbFinal, setUrbFinal] = useState<number | string>(""); // Built-up area in the final year
  const [popInit, setPopInit] = useState<number | string>(""); // Population in the initial year
  const [popFinal, setPopFinal] = useState<number | string>(""); // Population in the final year
  const [years, setYears] = useState<number | string>(""); // Number of years between initial and final year
  const [landUseEfficiency, setLandUseEfficiency] = useState<number | null>(null);
  const [standardizedEfficiency, setStandardizedEfficiency] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const MIN_EFFICIENCY = 0; // Minimum benchmark
  const MAX_EFFICIENCY = 3; // Maximum benchmark

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
    const urb_t = parseFloat(urbInit.toString());
    const urb_tn = parseFloat(urbFinal.toString());
    const pop_t = parseFloat(popInit.toString());
    const pop_tn = parseFloat(popFinal.toString());
    const y = parseFloat(years.toString());

    if (
      isNaN(urb_t) ||
      isNaN(urb_tn) ||
      isNaN(pop_t) ||
      isNaN(pop_tn) ||
      isNaN(y) ||
      urb_t <= 0 ||
      urb_tn <= 0 ||
      pop_t <= 0 ||
      pop_tn <= 0 ||
      y <= 0
    ) {
      alert("Please provide valid inputs for all fields.");
      return;
    }

    // Calculate Urban Expansion Growth Rate
    const urbanGrowthRate = Math.pow((urb_tn - urb_t) / urb_t, 1 / y);

    // Calculate Population Annual Growth Rate
    const populationGrowthRate = Math.pow((pop_tn - pop_t) / pop_t, 1 / y);

    // Calculate Land Use Efficiency
    const efficiency = urbanGrowthRate / populationGrowthRate;
    setLandUseEfficiency(efficiency);

    // Standardize the land use efficiency score
    let standardized;
    if (efficiency >= MAX_EFFICIENCY) {
      standardized = 0;
    } else if (efficiency <= MIN_EFFICIENCY) {
      standardized = 100;
    } else {
      standardized =
        100 * ((MAX_EFFICIENCY - efficiency) / (MAX_EFFICIENCY - MIN_EFFICIENCY));
    }
    setStandardizedEfficiency(standardized);

    // Evaluate the decision based on the standardized score
    const evaluationComment = getComment(standardized);
    setDecision(evaluationComment);

    // Prepare data to send
    const postData = {
      land_use_efficiency: efficiency,
      land_use_efficiency_comment: evaluationComment, // Renamed for consistency
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
      <h1 className="text-2xl font-bold mb-6 text-center">Land Use Efficiency Indicator</h1>

      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Built-up Area (Initial Year):
        </label>
        <input
          type="number"
          value={urbInit}
          onChange={(e) => setUrbInit(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter initial built-up area (km²)"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Built-up Area (Final Year):
        </label>
        <input
          type="number"
          value={urbFinal}
          onChange={(e) => setUrbFinal(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter final built-up area (km²)"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Population (Initial Year):
        </label>
        <input
          type="number"
          value={popInit}
          onChange={(e) => setPopInit(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter initial population"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Population (Final Year):
        </label>
        <input
          type="number"
          value={popFinal}
          onChange={(e) => setPopFinal(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter final population"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Number of Years:
        </label>
        <input
          type="number"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter number of years"
        />
      </div>
      <button
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`p-4 bg-blue-600 text-white rounded-lg w-full text-xl hover:bg-blue-700 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate Land Use Efficiency'}
      </button>
      {landUseEfficiency !== null && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-4">
            Land Use Efficiency: {landUseEfficiency.toFixed(4)}
          </h2>
          <h2 className="text-xl font-semibold mb-4">
            Standardized Efficiency: {standardizedEfficiency?.toFixed(2)}
          </h2>
          {decision && (
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
          )}
        </div>
      )}
    </div>
  );
};

export default LandUseEfficiencyIndicator;