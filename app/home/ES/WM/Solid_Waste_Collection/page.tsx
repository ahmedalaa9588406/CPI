"use client";

import React, { useState } from "react";

const SolidWasteCollection: React.FC = () => {
  const [wasteCollected, setWasteCollected] = useState<number | string>(""); // Volume of waste collected
  const [wasteGenerated, setWasteGenerated] = useState<number | string>(""); // Total volume of waste generated
  const [collectionScore, setCollectionScore] = useState<string | null>(null); // Final score

  const calculateSolidWasteCollection = () => {
    if (!wasteCollected || !wasteGenerated) {
      alert("Please enter both the waste collected and waste generated values.");
      return;
    }

    const collected = parseFloat(wasteCollected.toString());
    const generated = parseFloat(wasteGenerated.toString());

    if (collected < 0 || generated <= 0) {
      alert("Please ensure waste collected is >= 0 and waste generated is > 0.");
      return;
    }

    if (collected > generated) {
      alert("Waste collected cannot exceed waste generated.");
      return;
    }

    // Formula: Solid waste collection (%) = (Volume of waste collected / Total volume of waste generated) * 100
    const score = (collected / generated) * 100;
    setCollectionScore(score.toFixed(2)); // Limit to 2 decimal places
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Solid Waste Collection Evaluation</h2>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Volume of Waste Collected (units):</label>
        <input
          type="number"
          value={wasteCollected}
          onChange={(e) => setWasteCollected(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter waste collected"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Total Volume of Waste Generated (units):</label>
        <input
          type="number"
          value={wasteGenerated}
          onChange={(e) => setWasteGenerated(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter waste generated"
        />
      </div>

      <button
        onClick={calculateSolidWasteCollection}
        className="p-2 bg-green-500 text-white rounded w-full hover:bg-green-600 transition"
      >
        Calculate Collection Score
      </button>

      {collectionScore !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Solid Waste Collection Score: {collectionScore}%
          </h3>
        </div>
      )}
    </div>
  );
};

export default SolidWasteCollection;
