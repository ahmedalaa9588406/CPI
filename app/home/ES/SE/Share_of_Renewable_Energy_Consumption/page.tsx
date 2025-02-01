"use client";

import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const ShareOfRenewableEnergy: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [shareOfRenewableEnergy, setShareOfRenewableEnergy] = useState<number | string>(""); // Input for SRE
  const [standardizedScore, setStandardizedScore] = useState<string | null>(null); // Final standardized score
  const [decision, setDecision] = useState<string | null>(null); // Decision based on the score
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Function to calculate standardized score
  const calculateScore = () => {
    if (shareOfRenewableEnergy === "" || isNaN(Number(shareOfRenewableEnergy))) {
      alert("Please enter a valid Share of Renewable Energy (SRE) percentage.");
      return null;
    }

    const SRE = parseFloat(shareOfRenewableEnergy.toString());

    if (SRE < 0) {
      alert("Share of Renewable Energy (SRE) cannot be negative.");
      return null;
    }

    let score: number;
    let decisionComment: string;

    // Calculate standardized score and decision
    if (SRE >= 20) {
      score = 100;
      decisionComment = "Excellent";
    } else if (SRE > 0 && SRE < 20) {
      score = (SRE / 20) * 100;
      decisionComment = "Moderate";
    } else {
      score = 0;
      decisionComment = "Poor";
    }

    setStandardizedScore(score.toFixed(2)); // Limit to 2 decimal places
    setDecision(decisionComment); // Set decision comment
    return score.toFixed(2);
  };

  // Function to handle calculation and saving data
  const handleCalculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const score = calculateScore();
    if (score === null) return; // Exit if calculation fails

    const SRE = parseFloat(shareOfRenewableEnergy.toString());

    try {
      setIsSubmitting(true);
      const postData = {
        share_of_renewable_energy: SRE, // Post Share of Renewable Energy
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
      <h2 className="text-2xl font-bold mb-4">Share of Renewable Energy (SRE)</h2>

      <div className="mb-4">
        <label htmlFor="shareOfRenewableEnergy" className="block mb-2 font-semibold">
          Share of Renewable Energy (SRE) [%]:
        </label>
        <input
          id="shareOfRenewableEnergy"
          type="number"
          value={shareOfRenewableEnergy}
          onChange={(e) => setShareOfRenewableEnergy(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter SRE percentage"
          aria-label="Enter Share of Renewable Energy percentage"
        />
      </div>

      <button
        onClick={handleCalculateAndSave}
        disabled={isSubmitting}
        className={`p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Calculate and Save"
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate and Save'}
      </button>

      {standardizedScore !== null && decision !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Standardized Score: <span className="font-bold">{standardizedScore}%</span>
          </h3>
          <p className="text-lg font-semibold">
            Decision: <span className="text-blue-500">{decision}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ShareOfRenewableEnergy;