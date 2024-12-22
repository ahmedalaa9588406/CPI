"use client";

import React, { useState } from "react";

const CivicParticipation: React.FC = () => {
  const [engagedPeople, setEngagedPeople] = useState<number | string>("");
  const [adultPeople, setAdultPeople] = useState<number | string>("");

  const calculateCivicParticipation = () => {
    const engaged = Number(engagedPeople);
    const adults = Number(adultPeople);

    if (adults === 0 || isNaN(engaged) || isNaN(adults)) {
      return "Invalid data";
    }

    const participationRate = (engaged / adults) * 100;
    return participationRate.toFixed(2); // Limit to 2 decimal places
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Civic Participation Indicator</h2>

      <p className="mb-4">
        This indicator calculates the percentage of people engaged in civic
        associations relative to the total adult population in the city.
      </p>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          People Engaged in Civic Associations:
        </label>
        <input
          type="number"
          value={engagedPeople}
          onChange={(e) => setEngagedPeople(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          placeholder="Enter the number of engaged people"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Total Adult Population in the City:
        </label>
        <input
          type="number"
          value={adultPeople}
          onChange={(e) => setAdultPeople(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          placeholder="Enter the total adult population"
        />
      </div>

      <div className="mt-4">
        <p className="font-semibold">
          Civic Participation Rate:{" "}
          <span className="font-bold">{calculateCivicParticipation()}%</span>
        </p>
        <p>
          Engagement Level:{" "}
          <span className="font-bold">
            {(() => {
              const rate = parseFloat(calculateCivicParticipation());
              if (isNaN(rate)) return "Invalid data";
              if (rate >= 75) return "High Engagement";
              if (rate >= 50) return "Moderate Engagement";
              return "Low Engagement";
            })()}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CivicParticipation;
