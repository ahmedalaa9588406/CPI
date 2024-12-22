"use client";

import React, { useState } from "react";

const ShareOfRenewableEnergy: React.FC = () => {
  const [shareOfRenewableEnergy, setShareOfRenewableEnergy] = useState<number | string>(""); // Input for SRE
  const [standardizedScore, setStandardizedScore] = useState<string | null>(null); // Final standardized score
  const [decision, setDecision] = useState<string | null>(null); // Decision based on the score

  const calculateScore = () => {
    if (shareOfRenewableEnergy === "" || isNaN(Number(shareOfRenewableEnergy))) {
      alert("Please enter a valid Share of Renewable Energy (SRE) percentage.");
      return;
    }

    const SRE = parseFloat(shareOfRenewableEnergy.toString());

    if (SRE < 0) {
      alert("Share of Renewable Energy (SRE) cannot be negative.");
      return;
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
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Share of Renewable Energy (SRE)</h2>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Share of Renewable Energy (SRE) [%]:
        </label>
        <input
          type="number"
          value={shareOfRenewableEnergy}
          onChange={(e) => setShareOfRenewableEnergy(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter SRE percentage"
        />
      </div>

      <button
        onClick={calculateScore}
        className="p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition"
      >
        Calculate Standardized Score
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
