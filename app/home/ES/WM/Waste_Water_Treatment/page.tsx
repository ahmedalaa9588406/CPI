"use client";

import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const WastewaterTreatment: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [sewageTreated, setSewageTreated] = useState<number | string>(""); // Volume of sewage treated
  const [sewageProduced, setSewageProduced] = useState<number | string>(""); // Total volume of sewage produced
  const [treatmentScore, setTreatmentScore] = useState<string | null>(null); // Final score
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

  // Function to calculate wastewater treatment score
  const calculateWastewaterTreatment = () => {
    if (!sewageTreated || !sewageProduced) {
      alert("Please enter both the sewage treated and sewage produced values.");
      return null;
    }

    const treated = parseFloat(sewageTreated.toString());
    const produced = parseFloat(sewageProduced.toString());

    if (treated < 0 || produced <= 0) {
      alert("Please ensure sewage treated is >= 0 and sewage produced is > 0.");
      return null;
    }

    if (treated > produced) {
      alert("Sewage treated cannot exceed sewage produced.");
      return null;
    }

    // Formula: Wastewater treatment (%) = (sewage treated / sewage produced) * 100
    const score = (treated / produced) * 100;
    const scoreNum = score.toFixed(2); // Limit to 2 decimal places
    setTreatmentScore(scoreNum);
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

    const calculationResult = calculateWastewaterTreatment();
    if (calculationResult === null) return; // Exit if calculation fails

    const { scoreNum, calculatedComment } = calculationResult;

    try {
      setIsSubmitting(true); // Start loading
      console.log("Submitting data...");

      const postData = {
        waste_water_treatment: parseFloat(scoreNum), // Post the wastewater treatment score
        waste_water_treatment_comment: calculatedComment, // Use the calculated comment
        userId: user.id,
      };

      console.log("Post Data:", postData); // Debug: Log the post data

      const response = await fetch('/api/calculation-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      console.log("Response Status:", response.status); // Debug: Log the response status

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Result:", result); // Debug: Log the result

      alert("Data calculated and saved successfully!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error saving data:', errorMessage);
      alert("Failed to save data. Please try again.");
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Wastewater Treatment Evaluation</h2>

      <div className="mb-4">
        <label htmlFor="sewageTreated" className="block mb-2 font-semibold">
          Sewage Treated (m³/year):
        </label>
        <input
          id="sewageTreated"
          type="number"
          value={sewageTreated}
          onChange={(e) => setSewageTreated(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter sewage treated"
          aria-label="Enter volume of sewage treated"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="sewageProduced" className="block mb-2 font-semibold">
          Sewage Produced (m³/year):
        </label>
        <input
          id="sewageProduced"
          type="number"
          value={sewageProduced}
          onChange={(e) => setSewageProduced(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter sewage produced"
          aria-label="Enter total volume of sewage produced"
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

      {treatmentScore !== null && comment !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Wastewater Treatment Score: <span className="font-bold">{treatmentScore}%</span>
          </h3>
          <p className="text-lg font-semibold">
            Comment: <span className="text-blue-500">{comment}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default WastewaterTreatment;