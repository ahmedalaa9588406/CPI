"use client";

import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const PM10MonitoringStations: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [population, setPopulation] = useState<number | string>(""); // Input: Population
  const [pm10Level, setPm10Level] = useState<string>(""); // Input: PM10 Level
  const [numStations, setNumStations] = useState<number | string>(""); // Input: Number of monitoring stations
  const [standardizedScore, setStandardizedScore] = useState<string | null>(null); // Standardized score
  const [comment, setComment] = useState<string | null>(null); // Comment based on score
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Validate inputs
  const validateInputs = () => {
    if (!population || !pm10Level || !numStations) {
      alert("Please fill in all fields.");
      return false;
    }

    const populationNum = parseFloat(population.toString());
    const stationsNum = parseFloat(numStations.toString());

    if (isNaN(populationNum) || isNaN(stationsNum)) {
      alert("Invalid input. Please enter valid numbers.");
      return false;
    }

    if (populationNum <= 0 || stationsNum < 0) {
      alert("Population must be greater than zero and monitoring stations cannot be negative.");
      return false;
    }

    if (!["greater_or_equal_48", "between_32_and_48", "less_than_32"].includes(pm10Level)) {
      alert("Invalid PM10 level selection.");
      return false;
    }

    return true;
  };

  // Function to get comment based on standardized score
  const getComment = (score: number) => {
    if (score >= 80) return "VERY SOLID";
    else if (score >= 70) return "SOLID";
    else if (score >= 60) return "MODERATELY SOLID";
    else if (score >= 50) return "MODERATELY WEAK";
    else if (score >= 40) return "WEAK";
    else return "VERY WEAK";
  };

  // Calculate standardized score
  const calculateMonitoringStations = () => {
    if (!validateInputs()) return null;

    const populationNum = parseFloat(population.toString());
    const stationsNum = parseFloat(numStations.toString());

    // Determine the maximum number of monitoring stations based on PM10 level
    let max = 0;

    switch (pm10Level) {
      case "greater_or_equal_48":
        max = populationNum / 125000;
        break;
      case "between_32_and_48":
        max = populationNum / 250000;
        break;
      case "less_than_32":
        max = populationNum / 500000;
        break;
      default:
        alert("Invalid PM10 level selection.");
        return null;
    }

    const min = 0; // Minimum benchmark is always 0

    // Calculate standardized score
    let standardizedValue = 0;

    if (stationsNum >= max) {
      standardizedValue = 100;
    } else if (stationsNum > min && stationsNum < max) {
      standardizedValue = (stationsNum / max) * 100;
    } else if (stationsNum === min) {
      standardizedValue = 0;
    }

    const scoreNum = standardizedValue.toFixed(2);
    setStandardizedScore(scoreNum);
    const calculatedComment = getComment(parseFloat(scoreNum));
    setComment(calculatedComment); // Set comment immediately after calculating score
    console.log('Calculated Score:', scoreNum, 'Calculated Comment:', calculatedComment);
    return { scoreNum, calculatedComment };
  };

  // Handle calculation and saving data
  const handleCalculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const calculationResult = calculateMonitoringStations();
    if (calculationResult === null) return;

    const {calculatedComment } = calculationResult;
    const stationsNum = parseFloat(numStations.toString());

    try {
      setIsSubmitting(true);

      const postData = {
        number_of_monitoring_stations: stationsNum || 0,
        number_of_monitoring_stations_comment: calculatedComment || "",
        userId: user.id
      };

      // Validate postData before sending
      if (!postData.userId || postData.number_of_monitoring_stations === null) {
        throw new Error("Invalid data for submission");
      }

      const response = await fetch('/api/calculation-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      alert("Data calculated and saved successfully!");
      console.log('Result:', result);
    } catch (error) {
      console.error('Error saving data:', error);
      alert("Failed to save data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">PM10 Monitoring Stations</h2>

      <div className="mb-4">
        <label htmlFor="population" className="block mb-2 font-semibold">
          Population:
        </label>
        <input
          id="population"
          type="number"
          value={population}
          onChange={(e) => setPopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter population"
          aria-label="Enter population"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="pm10Level" className="block mb-2 font-semibold">
          PM10 Level:
        </label>
        <select
          id="pm10Level"
          value={pm10Level}
          onChange={(e) => setPm10Level(e.target.value)}
          className="border rounded p-2 w-full"
          aria-label="Select PM10 Level"
        >
          <option value="">Select PM10 Level</option>
          <option value="greater_or_equal_48">≥ 48 μg/m³</option>
          <option value="between_32_and_48">≥ 32 μg/m³ and &lt; 48 μg/m³</option>
          <option value="less_than_32">{`< 32 μg/m³`}</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="numStations" className="block mb-2 font-semibold">
          Number of Monitoring Stations:
        </label>
        <input
          id="numStations"
          type="number"
          value={numStations}
          onChange={(e) => setNumStations(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter number of monitoring stations"
          aria-label="Enter number of monitoring stations"
        />
      </div>

      <button
        onClick={handleCalculateAndSave}
        disabled={isSubmitting}
        className={`p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Calculate and Save"
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate and Save'}
      </button>

      {standardizedScore !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Standardized Score: {standardizedScore}
          </h3>
          <h3 className="text-lg">
            Comment: {comment}
          </h3>
        </div>
      )}
    </div>
  );
};

export default PM10MonitoringStations;