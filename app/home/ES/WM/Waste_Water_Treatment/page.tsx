"use client";

import React, { useState } from "react";

const WastewaterTreatment: React.FC = () => {
  const [sewageTreated, setSewageTreated] = useState<number | string>(""); // Volume of sewage treated
  const [sewageProduced, setSewageProduced] = useState<number | string>(""); // Total volume of sewage produced
  const [treatmentScore, setTreatmentScore] = useState<string | null>(null); // Final score

  const calculateWastewaterTreatment = () => {
    if (!sewageTreated || !sewageProduced) {
      alert("Please enter both the sewage treated and sewage produced values.");
      return;
    }

    const treated = parseFloat(sewageTreated.toString());
    const produced = parseFloat(sewageProduced.toString());

    if (treated < 0 || produced <= 0) {
      alert("Please ensure sewage treated is >= 0 and sewage produced is > 0.");
      return;
    }

    if (treated > produced) {
      alert("Sewage treated cannot exceed sewage produced.");
      return;
    }

    // Formula: Wastewater treatment (%) = (sewage treated / sewage produced) * 100
    const score = (treated / produced) * 100;
    setTreatmentScore(score.toFixed(2)); // Limit to 2 decimal places
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Wastewater Treatment Evaluation</h2>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Sewage Treated (m³/year):</label>
        <input
          type="number"
          value={sewageTreated}
          onChange={(e) => setSewageTreated(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter sewage treated"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Sewage Produced (m³/year):</label>
        <input
          type="number"
          value={sewageProduced}
          onChange={(e) => setSewageProduced(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter sewage produced"
        />
      </div>

      <button
        onClick={calculateWastewaterTreatment}
        className="p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition"
      >
        Calculate Treatment Score
      </button>

      {treatmentScore !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Wastewater Treatment Score: {treatmentScore}%
          </h3>
        </div>
      )}
    </div>
  );
};

export default WastewaterTreatment;
