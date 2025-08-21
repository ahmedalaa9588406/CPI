"use client";

import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';
import { AIDataAssistant } from '@/components/AIDataAssistant';

const ShareOfRenewableEnergy: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [shareOfRenewableEnergy, setShareOfRenewableEnergy] = useState<number | string>(""); // Input for SRE
  const [standardizedScore, setStandardizedScore] = useState<string | null>(null); // Final standardized score
  const [comment, setComment] = useState<string | null>(null); // Comment based on score
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Function to get comment based on standardized score
  const getComment = (score: number) => {
    if (score >= 80) return "VERY SOLID";
    else if (score >= 70) return "SOLID";
    else if (score >= 60) return "MODERATELY SOLID";
    else if (score >= 50) return "MODERATELY WEAK";
    else if (score >= 40) return "WEAK";
    else return "VERY WEAK";
  };

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

    // Calculate standardized score
    if (SRE >= 20) {
      score = 100;
    } else if (SRE > 0 && SRE < 20) {
      score = (SRE / 20) * 100;
    } else {
      score = 0;
    }

    const scoreNum = score.toFixed(2); // Limit to 2 decimal places
    setStandardizedScore(scoreNum);
    const calculatedComment = getComment(parseFloat(scoreNum));
    setComment(calculatedComment); // Set comment based on score
    console.log('Calculated Score:', scoreNum, 'Calculated Comment:', calculatedComment);
    return { scoreNum, calculatedComment };
  };

  // Function to handle calculation and saving data
  const handleCalculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const calculationResult = calculateScore();
    if (calculationResult === null) return; // Exit if calculation fails

    const { scoreNum, calculatedComment } = calculationResult;
    const SRE = parseFloat(shareOfRenewableEnergy.toString());

    try {
      setIsSubmitting(true);

      console.log('Before Posting:', 'Score:', scoreNum, 'Comment:', calculatedComment);

      const postData = {
        share_of_renewable_energy: SRE, // Post Share of Renewable Energy
        share_of_renewable_energy_comment: calculatedComment, // Use the calculated comment
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

      {/* AI Data Assistant for renewable energy data */}
      <AIDataAssistant
        indicator="share_of_renewable_energy"
        currentValue={shareOfRenewableEnergy ? parseFloat(shareOfRenewableEnergy.toString()) : undefined}
        onSuggestionAccept={(value) => setShareOfRenewableEnergy(value)}
        availableData={{
          co2_emissions: 5.5, // Example baseline CO2 emissions
          pm25_concentration: 25 // Example PM2.5 concentration
        }}
        location={{
          lat: 30.0444, // Example coordinates for Cairo, Egypt
          lng: 31.2357,
          city: "Cairo"
        }}
      />

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

      {standardizedScore !== null && comment !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Standardized Score: <span className="font-bold">{standardizedScore}%</span>
          </h3>
          <p className="text-lg font-semibold">
            Comment: <span className="text-blue-500">{comment}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ShareOfRenewableEnergy;