"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

function VaccinationCoverageCalculator() {
  const { user, isLoaded } = useUser();
  const [immunizedPopulation, setImmunizedPopulation] = useState<string>("");
  const [eligiblePopulation, setEligiblePopulation] = useState<string>("");
  const [vaccinationCoverage, setVaccinationCoverage] = useState<number | null>(null);
  const [standardizedScore, setStandardizedScore] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const MIN_COVERAGE = 50; // Minimum benchmark
  const MAX_COVERAGE = 100; // Maximum benchmark

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
    const immunized = parseFloat(immunizedPopulation);
    const eligible = parseFloat(eligiblePopulation);

    if (isNaN(immunized) || isNaN(eligible) || eligible <= 0) {
      alert("Please provide valid inputs for both fields.");
      return;
    }

    let coverage = (immunized / eligible) * 100;
    if (coverage > 100) {
      coverage = 100;
    }
    setVaccinationCoverage(coverage);

    // Standardize the vaccination coverage score
    let standardized;
    if (coverage >= MAX_COVERAGE) {
      standardized = 100;
    } else if (coverage <= MIN_COVERAGE) {
      standardized = 0;
    } else {
      standardized =
        100 * ((coverage - MIN_COVERAGE) / (MAX_COVERAGE - MIN_COVERAGE));
    }
    setStandardizedScore(standardized);

    // Evaluate the decision based on the standardized score
    const evaluationComment = getComment(standardized);
    setDecision(evaluationComment);

    // Prepare data to send
    const postData = {
      vaccination_coverage: coverage,
      vaccination_coverage_comment: evaluationComment, // Renamed for consistency
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
      <h1 className="text-2xl font-bold mb-6 text-center">Vaccination Coverage Calculator</h1>

      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Population Immunized (according to national policies):
        </label>
        <input
          type="number"
          value={immunizedPopulation}
          onChange={(e) => setImmunizedPopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter immunized population"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Eligible Population (according to national policies):
        </label>
        <input
          type="number"
          value={eligiblePopulation}
          onChange={(e) => setEligiblePopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter eligible population"
        />
      </div>
      <button
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`p-4 bg-blue-600 text-white rounded-lg w-full text-xl hover:bg-blue-700 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate Vaccination Coverage'}
      </button>
      {vaccinationCoverage !== null && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-4">
            Vaccination Coverage: {vaccinationCoverage.toFixed(2)}%
          </h2>
          <h2 className="text-xl font-semibold mb-4">
            Standardized Score: {standardizedScore?.toFixed(2)}
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

export default VaccinationCoverageCalculator;