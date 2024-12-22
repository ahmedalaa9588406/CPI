"use client";
import React, { useState } from "react";

function TrafficFatalitiesForm() {
  const [totalFatalities, setTotalFatalities] = useState("");
  const [cityPopulation, setCityPopulation] = useState("");
  const [fatalitiesPer100k, setFatalitiesPer100k] = useState<number | null>(null);
  const [standardizedScore, setStandardizedScore] = useState<number | null>(null);
  const [decision, setDecision] = useState<string | null>(null);

  // Constants
  const minBenchmark = 1; // Min fatalities per 100,000 people
  const maxBenchmark = 31; // Max fatalities per 100,000 people

  const calculateTrafficFatalities = () => {
    const numericTotalFatalities = parseFloat(totalFatalities);
    const numericCityPopulation = parseFloat(cityPopulation);

    if (numericTotalFatalities > 0 && numericCityPopulation > 0) {
      // Traffic Fatalities per 100,000 People
      const fatalitiesPer100kValue =
        (numericTotalFatalities / numericCityPopulation) * 100000;
      setFatalitiesPer100k(fatalitiesPer100kValue);

      // Standardized Score (S)
      let standardizedScoreValue: number;
      if (fatalitiesPer100kValue >= maxBenchmark) {
        standardizedScoreValue = 0; // If fatalities >= max benchmark
      } else if (fatalitiesPer100kValue < minBenchmark) {
        standardizedScoreValue = 1; // If fatalities < min benchmark
      } else {
        standardizedScoreValue =
          1 - (fatalitiesPer100kValue - minBenchmark) / (maxBenchmark - minBenchmark);
      }
      setStandardizedScore(standardizedScoreValue * 100);

      // Decision based on the standardized score
      if (fatalitiesPer100kValue >= maxBenchmark) {
        setDecision("High Traffic Fatalities");
      } else if (fatalitiesPer100kValue < minBenchmark) {
        setDecision("Very Low Traffic Fatalities");
      } else {
        setDecision("Moderate Traffic Fatalities");
      }
    } else {
      alert("Both total fatalities and city population must be positive numbers.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Traffic Fatalities Calculator
      </h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Total Traffic Fatalities per Year:
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={totalFatalities}
            onChange={(e) => setTotalFatalities(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          City Population:
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={cityPopulation}
            onChange={(e) => setCityPopulation(e.target.value)}
            required
          />
        </label>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={calculateTrafficFatalities}
      >
        Calculate
      </button>
      {(fatalitiesPer100k !== null || standardizedScore !== null) && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          {fatalitiesPer100k !== null && (
            <p className="text-lg">
              Traffic Fatalities per 100,000 People: {fatalitiesPer100k.toFixed(2)}
            </p>
          )}
          {standardizedScore !== null && (
            <p className="text-lg">
              Standardized Traffic Fatalities Score: {standardizedScore.toFixed(2)}%
            </p>
          )}
          {decision && (
            <p
              className={`mt-4 p-2 text-center font-bold text-white rounded-md ${
                decision === "High Traffic Fatalities"
                  ? "bg-red-500"
                  : decision === "Very Low Traffic Fatalities"
                  ? "bg-green-500"
                  : "bg-yellow-500"
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

export default TrafficFatalitiesForm;
