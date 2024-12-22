"use client";

import React, { useState } from "react";

const SolidWasteRecyclingShare: React.FC = () => {
  const [wasteRecycled, setWasteRecycled] = useState<number | string>(""); // Volume of waste recycled
  const [wasteCollected, setWasteCollected] = useState<number | string>(""); // Total volume of waste collected
  const [recyclingScore, setRecyclingScore] = useState<string | null>(null); // Final score
  const [comment, setComment] = useState<string | null>(null); // Comment on the score

  const calculateRecyclingShare = () => {
    if (!wasteRecycled || !wasteCollected) {
      alert("Please enter both the volume of waste recycled and waste collected.");
      return;
    }

    const recycled = parseFloat(wasteRecycled.toString());
    const collected = parseFloat(wasteCollected.toString());

    if (recycled < 0 || collected <= 0) {
      alert("Please ensure waste recycled is >= 0 and waste collected is > 0.");
      return;
    }

    if (recycled > collected) {
      alert("Waste recycled cannot exceed waste collected.");
      return;
    }

    // Calculate the initial recycling share percentage
    const initialShare = (recycled / collected) * 100;

    let standardScore: number;
    let performanceComment: string;

    // Apply the standardization formula
    if (initialShare >= 50) {
      standardScore = 100;
      performanceComment = "Excellent";
    } else if (initialShare >= 25 && initialShare < 50) {
      standardScore = 100 * (1 - Math.abs(initialShare - 50) / 50);
      performanceComment = "Moderate";
    } else {
      standardScore = 100 * (1 - Math.abs(initialShare - 50) / 50);
      performanceComment = "Bad";
    }

    setRecyclingScore(standardScore.toFixed(2)); // Limit to 2 decimal places
    setComment(performanceComment); // Set the performance comment
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Solid Waste Recycling Share</h2>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Volume of Waste Recycled (tons):</label>
        <input
          type="number"
          value={wasteRecycled}
          onChange={(e) => setWasteRecycled(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter waste recycled"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Total Volume of Waste Collected (tons):</label>
        <input
          type="number"
          value={wasteCollected}
          onChange={(e) => setWasteCollected(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter waste collected"
        />
      </div>

      <button
        onClick={calculateRecyclingShare}
        className="p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition"
      >
        Calculate Recycling Share
      </button>

      {recyclingScore !== null && comment !== null && (
        <div className="mt-4">
          <h3 className="text-lg">Solid Waste Recycling Share: {recyclingScore}%</h3>
          <p className="text-lg font-semibold">
            Performance: <span className="text-blue-500">{comment}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default SolidWasteRecyclingShare;
