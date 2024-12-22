"use client";

import React, { useState } from "react";

const LandUseMix: React.FC = () => {
  const [landUseData, setLandUseData] = useState<number[][]>([]); // Array of p_i values for each cell
  const [numCells, setNumCells] = useState<string>(""); // Total number of cells as a string to allow empty input
  const [averageIndex, setAverageIndex] = useState<number | null>(null); // Average Land Use Mix index
  const [standardizedScore, setStandardizedScore] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<string | null>(null); // Decision evaluation

  // Constants
  const MAX_INDEX = 1.61; // ln(5) for 5 categories
  const MIN_INDEX = 0;

  const calculateShannonWienerIndex = (piValues: number[]) => {
    // Shannon-Wiener Diversity Index formula: -Σ (p_i * ln(p_i))
    return -piValues
      .filter((pi) => pi > 0) // Avoid ln(0)
      .reduce((sum, pi) => sum + pi * Math.log(pi), 0);
  };

  const calculateLandUseMix = () => {
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
      100 * (1 - (MAX_INDEX - average) / (MAX_INDEX - MIN_INDEX));

    // Decision logic
    if (average >= MAX_INDEX) {
      setStandardizedScore("100");
      setEvaluation("Excellent");
    } else if (average > MIN_INDEX && average < MAX_INDEX) {
      setStandardizedScore(standardizedValue.toFixed(2));
      setEvaluation("Moderate");
    } else if (average <= MIN_INDEX) {
      setStandardizedScore("0");
      setEvaluation("Poor");
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
        onClick={calculateLandUseMix}
        className="p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition"
      >
        Calculate Land Use Mix
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
