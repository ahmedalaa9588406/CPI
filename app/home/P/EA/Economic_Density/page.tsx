"use client";
import React, { useState } from "react";

const EconomicDensityCalculator: React.FC = () => {
  const [cityProduct, setCityProduct] = useState<number | undefined>();
  const [cityArea, setCityArea] = useState<number | undefined>();
  const [economicDensity, setEconomicDensity] = useState<number>(0); // Economic Density
  const [standardizedEconomicDensity, setStandardizedEconomicDensity] = useState<number>(0); // Standardized Economic Density
  const [decision, setDecision] = useState<string>("");

  const benchmark = 857.37; // X* benchmark in million PPP/km²

  const calculateEconomicDensity = () => {
    if (!cityArea || cityArea === 0) {
      alert("City area cannot be zero.");
      return;
    }

    if (!cityProduct || cityProduct < 0) {
      alert("Please enter a valid city product.");
      return;
    }

    // Calculate Economic Density
    const density = cityProduct / cityArea;
    setEconomicDensity(density);

    // Standardized Economic Density Formula with absolute value
    const standardized = 100 * (1 - Math.abs((density - benchmark) / benchmark));
    setStandardizedEconomicDensity(standardized);

    // Decision Logic
    if (density >= benchmark) {
      setDecision("Good");
    } else if (density > 0 && density < benchmark) {
      setDecision("Moderate");
    } else {
      setDecision("Bad");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-10 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Economic Density Calculator</h1>

      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          City Product (in million PPP):
        </label>
        <input
          type="number"
          value={cityProduct !== undefined ? cityProduct : ""}
          onChange={(e) => setCityProduct(Number(e.target.value) || undefined)}
          className="border rounded-lg p-4 w-full text-lg"
          placeholder="Enter the city product"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          City Area (in square kilometers):
        </label>
        <input
          type="number"
          value={cityArea !== undefined ? cityArea : ""}
          onChange={(e) => setCityArea(Number(e.target.value) || undefined)}
          className="border rounded-lg p-4 w-full text-lg"
          placeholder="Enter the city area"
        />
      </div>

      <button
        onClick={calculateEconomicDensity}
        className="p-4 bg-blue-600 text-white rounded-lg w-full text-xl hover:bg-blue-700 transition"
      >
        Calculate Economic Density
      </button>

      {decision && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-4">
            Economic Density: {economicDensity.toFixed(2)} (million PPP/km²)
          </h2>
          <h2 className="text-xl font-semibold mb-4">
            Standardized Economic Density: {standardizedEconomicDensity.toFixed(2)}
          </h2>
          <h2 className="text-xl font-semibold">
            Decision:{" "}
            <span
              className={`${
                decision === "Good"
                  ? "text-green-600"
                  : decision === "Moderate"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {decision}
            </span>
          </h2>
        </div>
      )}
    </div>
  );
};

export default EconomicDensityCalculator;
