"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

function HomicideRateCalculator() {
  const { user, isLoaded } = useUser();
  const [homicides, setHomicides] = useState<string>(""); // Number of homicides
  const [cityPopulation, setCityPopulation] = useState<string>(""); // Total city population
  const [homicideRate, setHomicideRate] = useState<number | null>(null);
  const [standardizedRate, setStandardizedRate] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null); // Decision evaluation
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const MIN_HOMICIDE_RATE = 1; // Minimum benchmark (homicides per 100,000)
  const MAX_HOMICIDE_RATE = 1654; // Maximum benchmark (homicides per 100,000)

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
    const homicidesCount = parseFloat(homicides);
    const population = parseFloat(cityPopulation);

    if (isNaN(homicidesCount) || isNaN(population) || population <= 0) {
      alert("Please provide valid inputs for both fields.");
      return;
    }

    // Calculate homicide rate
    const rate = (homicidesCount / population) * 100000;
    setHomicideRate(rate);

    // Standardize the homicide rate score
    let standardized;
    if (rate <= 0) {
      standardized = 100;
    } else {
      const lnRate = Math.log(rate);
      const LN_MIN = Math.log(MIN_HOMICIDE_RATE);
      const LN_MAX = Math.log(MAX_HOMICIDE_RATE);

      if (lnRate >= LN_MAX) {
        standardized = 0;
      } else if (lnRate <= LN_MIN) {
        standardized = 100;
      } else {
        standardized =
          100 * (1 - (lnRate - LN_MIN) / (LN_MAX - LN_MIN));
      }
    }
    setStandardizedRate(standardized);

    // Evaluate the decision based on the standardized score
    const evaluationComment = getComment(standardized);
    setDecision(evaluationComment);

    // Prepare data to send
    const postData = {
      homicide_rate: rate,
      homicide_rate_comment: evaluationComment, // Renamed for consistency
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
      <h1 className="text-2xl font-bold mb-6 text-center">Homicide Rate Calculator</h1>

      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Number of Homicides:
        </label>
        <input
          type="number"
          value={homicides}
          onChange={(e) => setHomicides(e.target.value)}
          className="border rounded p-4 w-full text-lg"
          placeholder="Enter the number of homicides"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          City Population:
        </label>
        <input
          type="number"
          value={cityPopulation}
          onChange={(e) => setCityPopulation(e.target.value)}
          className="border rounded p-4 w-full text-lg"
          placeholder="Enter the city population"
        />
      </div>
      <button
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`p-4 bg-blue-600 text-white rounded-lg w-full text-xl hover:bg-blue-700 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate Homicide Rate'}
      </button>
      {homicideRate !== null && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-4">
            Homicide Rate: {homicideRate.toFixed(2)} per 100,000
          </h2>
          <h2 className="text-xl font-semibold mb-4">
            Standardized Homicide Rate: {standardizedRate?.toFixed(2)}
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
}

export default HomicideRateCalculator;