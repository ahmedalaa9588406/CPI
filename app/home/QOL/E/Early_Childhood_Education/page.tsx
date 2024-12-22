"use client";

import React, { useState } from "react";

function EarlyChildhoodEducationCalculator() {
  const [childrenInECEP, setChildrenInECEP] = useState<string>(""); // Number of children under 6 in ECEP
  const [totalChildren, setTotalChildren] = useState<string>(""); // Total children under 6
  const [participationRate, setParticipationRate] = useState<string | null>(null);

  // Function to calculate the participation rate
  const calculateParticipationRate = () => {
    const childrenECEP = parseFloat(childrenInECEP);
    const total = parseFloat(totalChildren);

    if (!isNaN(childrenECEP) && !isNaN(total) && total > 0) {
      const rate = (childrenECEP / total) * 100;
      setParticipationRate(rate.toFixed(2));
    } else {
      alert("Please provide valid inputs for the calculation.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">
        Under-Six Participation in Early Childhood Education Programme
      </h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Children under 6 in ECEP:
        </label>
        <input
          type="number"
          value={childrenInECEP}
          onChange={(e) => setChildrenInECEP(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter number of children in ECEP"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Total children under 6:
        </label>
        <input
          type="number"
          value={totalChildren}
          onChange={(e) => setTotalChildren(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter total number of children under 6"
        />
      </div>

      <button
        onClick={calculateParticipationRate}
        className="p-2 bg-blue-500 text-white rounded w-full"
      >
        Calculate Participation Rate
      </button>

      {participationRate && (
        <div className="mt-4">
          <p className="text-xl font-bold">
            Participation Rate: {participationRate}%
          </p>
        </div>
      )}
    </div>
  );
}

export default EarlyChildhoodEducationCalculator;
