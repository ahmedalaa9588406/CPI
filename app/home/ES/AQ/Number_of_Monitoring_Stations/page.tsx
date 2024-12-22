"use client";

import React, { useState } from "react";

const PM10MonitoringStations: React.FC = () => {
  const [population, setPopulation] = useState<number | string>(""); // Input: Population
  const [pm10Level, setPm10Level] = useState<string>(""); // Input: PM10 Level
  const [numStations, setNumStations] = useState<number | string>(""); // Input: Number of monitoring stations
  const [standardizedScore, setStandardizedScore] = useState<string | null>(null); // Standardized score
  const [evaluation, setEvaluation] = useState<string | null>(null); // Decision evaluation

  const calculateMonitoringStations = () => {
    if (!population || !pm10Level || !numStations) {
      alert("Please fill in all fields.");
      return;
    }

    const populationNum = parseFloat(population.toString());
    const stationsNum = parseFloat(numStations.toString());

    if (populationNum <= 0 || stationsNum < 0) {
      alert("Population must be greater than zero and monitoring stations cannot be negative.");
      return;
    }

    // Determine the maximum number of monitoring stations based on PM10 level
    let max = 0;

    if (pm10Level === "greater_or_equal_48") {
      max = populationNum / 125000;
    } else if (pm10Level === "between_32_and_48") {
      max = populationNum / 250000;
    } else if (pm10Level === "less_than_32") {
      max = populationNum / 500000;
    } else {
      alert("Invalid PM10 level selection.");
      return;
    }

    const min = 0; // Minimum benchmark is always 0

    // Calculate standardized score
    let standardizedValue = 0;
    if (stationsNum >= max) {
      standardizedValue = 100;
      setEvaluation("Excellent");
    } else if (stationsNum > min && stationsNum < max) {
      standardizedValue = (stationsNum / max) * 100;
      setEvaluation("Moderate");
    } else if (stationsNum === min) {
      standardizedValue = 0;
      setEvaluation("Poor");
    }

    setStandardizedScore(standardizedValue.toFixed(2));
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">PM10 Monitoring Stations</h2>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Population:</label>
        <input
          type="number"
          value={population}
          onChange={(e) => setPopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter population"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">PM10 Level:</label>
        <select
          value={pm10Level}
          onChange={(e) => setPm10Level(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">Select PM10 Level</option>
          <option value="greater_or_equal_48">≥ 48 μg/m³</option>
          <option value="between_32_and_48">≥ 32 μg/m³ and < 48 μg/m³</option>
          <option value="less_than_32">{`< 32 μg/m³`}</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Number of Monitoring Stations:</label>
        <input
          type="number"
          value={numStations}
          onChange={(e) => setNumStations(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter number of monitoring stations"
        />
      </div>

      <button
        onClick={calculateMonitoringStations}
        className="p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition"
      >
        Calculate Standardized Score
      </button>

      {standardizedScore !== null && (
        <div className="mt-4">
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

export default PM10MonitoringStations;
