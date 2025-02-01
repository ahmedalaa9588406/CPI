"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const LandUseMix: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [landUseData, setLandUseData] = useState<number[][]>([]); // Array of p_i values for each cell
  const [numCells, setNumCells] = useState<string>(""); // Total number of cells as a string to allow empty input
  const [averageIndex, setAverageIndex] = useState<number | null>(null); // Average Land Use Mix index
  const [standardizedScore, setStandardizedScore] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<string | null>(null); // Decision evaluation
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Constants
  const MAX_INDEX = 1.61; // ln(5) for 5 categories
  const MIN_INDEX = 0;

  const calculateShannonWienerIndex = (piValues: number[]) => {
    // Shannon-Wiener Diversity Index formula: -Σ (p_i * ln(p_i))
    return -piValues
      .filter((pi) => pi > 0) // Avoid ln(0)
      .reduce((sum, pi) => sum + pi * Math.log(pi), 0);
  };

  const calculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const numCellsValue = parseInt(numCells, 10);
    if (isNaN(numCellsValue) || numCellsValue <= 0 || landUseData.length === 0) {
      alert("Ensure that land use data and a valid number of cells are provided.");
      return;
    }

    // Calculate Shannon-Wiener Diversity Index for each cell
    const indices = landUseData.map((cellAreas) => calculateShannonWienerIndex(cellAreas));

    // Calculate average index
    const average =
      indices.reduce((sum, index) => sum + index, 0) / indices.length;
    setAverageIndex(average);

    // Standardized formula
    const standardizedValue =
      100 * (average / MAX_INDEX);

    // Decision logic
    let standardizedScoreValue: string;
    let evaluationComment: string;
    if (average >= MAX_INDEX) {
      standardizedScoreValue = "100";
      evaluationComment = "Excellent";
    } else if (average > MIN_INDEX && average < MAX_INDEX) {
      standardizedScoreValue = standardizedValue.toFixed(2);
      evaluationComment = "Moderate";
    } else {
      standardizedScoreValue = "0";
      evaluationComment = "Poor";
    }
    setStandardizedScore(standardizedScoreValue);
    setEvaluation(evaluationComment);

    // Prepare data to send
    const postData = {
      land_use_mix: average,
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
      <h2 className="text-2xl font-bold mb-4">Land Use Mix</h2>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Enter Land Use Data for Each Cell (comma-separated p_i values for each cell):
        </label>
        <textarea
          rows={5}
          className="border rounded p-2 w-full"
          onChange={(e) =>
            setLandUseData(
              e.target.value.split("\n").map((line) =>
                line.split(",").map((val) => parseFloat(val.trim()))
              )
            )
          }
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Total Number of Cells:</label>
        <input
          type="text"
          value={numCells}
          onChange={(e) => setNumCells(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter a valid number"
        />
      </div>
      <button
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate Land Use Mix'}
      </button>
      {averageIndex !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Average Land Use Mix Index: {averageIndex.toFixed(2)}
          </h3>
          <h3 className="text-lg">
            Standardized Score: {standardizedScore}
          </h3>
          <h3 className="text-lg">
            Evaluation: {evaluation}
          </h3>
        </div>
      )}
    </div>
  );
};

export default LandUseMix;