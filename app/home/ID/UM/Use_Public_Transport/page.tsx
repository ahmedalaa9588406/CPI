"use client";
import React, { useState } from "react";

function PublicTransportForm() {
  const [tripsInPTModes, setTripsInPTModes] = useState("");
  const [totalMotorizedTrips, setTotalMotorizedTrips] = useState("");
  const [usePTRatio, setUsePTRatio] = useState<number | null>(null);
  const [standardizedPTRatio, setStandardizedPTRatio] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);

  // Constants
  const MIN = 5.95; // Minimum value from benchmark
  const MAX = 62.16; // Maximum value from benchmark

  const calculatePublicTransportUse = () => {
    const numericTotalTrips = Number(totalMotorizedTrips);
    if (numericTotalTrips > 0) {
      const numericTripsInPTModes = Number(tripsInPTModes);
      const calculatedPTRatio = (numericTripsInPTModes / numericTotalTrips) * 100;

      // Calculate Standardized PT Ratio (S)
      let standardizedPTRatio =
        100 * ((calculatedPTRatio - MIN) / (MAX - MIN));

      // Cap standardized ratio at 100 if it exceeds, or set to 0 if below 0
      if (standardizedPTRatio > 100) {
        standardizedPTRatio = 100;
      } else if (standardizedPTRatio < 0) {
        standardizedPTRatio = 0;
      }

      setUsePTRatio(calculatedPTRatio);
      setStandardizedPTRatio(standardizedPTRatio);

      // Determine decision message
      if (calculatedPTRatio >= MAX) {
        setDecision("Perfect");
      } else if (calculatedPTRatio > MIN && calculatedPTRatio < MAX) {
        setDecision("Moderate");
      } else {
        setDecision("Poor");
      }
    } else {
      alert("Total motorized trips must be greater than zero.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Calculate Use of Public Transport
      </h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Number of Trips in Public Transport Modes:
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={tripsInPTModes}
            onChange={(e) => setTripsInPTModes(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Total Motorized Trips:
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={totalMotorizedTrips}
            onChange={(e) => setTotalMotorizedTrips(e.target.value)}
            required
          />
        </label>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={calculatePublicTransportUse}
      >
        Calculate
      </button>
      {usePTRatio !== null && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-lg">Use of Public Transport Ratio: {usePTRatio.toFixed(2)}%</p>
          <p className="text-sm text-gray-600">Standardized PT Ratio (S):</p>
          <ul className="list-disc pl-5">
            <li>Standardized PT Ratio: {standardizedPTRatio?.toFixed(2)}%</li>
          </ul>
          {decision && (
            <p
              className={`mt-4 p-2 text-center font-bold text-white rounded-md ${
                decision === "Perfect"
                  ? "bg-green-500"
                  : decision === "Moderate"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            >
              {decision}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default PublicTransportForm;
