"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

function BroadbandSpeedCalculator() {
  const { user, isLoaded } = useUser();
  const [speeds, setSpeeds] = useState<string>("");
  const [averageSpeed, setAverageSpeed] = useState<number | null>(null);
  const [standardizedSpeed, setStandardizedSpeed] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Constants for benchmarks
  const MIN_SPEED = 470 / 8; // Convert Kbps to Mbps
  const MAX_SPEED = 87088 / 8; // Convert Kbps to Mbps

  const calculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const speedArray = speeds.split(",").map(Number).filter((speed) => !isNaN(speed));
    if (speedArray.length === 0) {
      alert("Please enter valid broadband speeds.");
      return;
    }

    // Calculate Average Speed
    const totalSpeed = speedArray.reduce((acc, speed) => acc + speed, 0);
    const avgSpeed = totalSpeed / speedArray.length;
    setAverageSpeed(avgSpeed);

    // Standardized formula with cube root
    const cubeRootAvgSpeed = Math.cbrt(avgSpeed);
    const standardizedValue =
      100 *
      (1 -
        (cubeRootAvgSpeed - Math.cbrt(MIN_SPEED)) /
          (Math.cbrt(MAX_SPEED) - Math.cbrt(MIN_SPEED)));

    // Decision logic
    let standardizedSpeedValue: string;
    if (avgSpeed >= MAX_SPEED) {
      standardizedSpeedValue = "100";
    } else if (avgSpeed > MIN_SPEED && avgSpeed < MAX_SPEED) {
      standardizedSpeedValue = standardizedValue.toFixed(2);
    } else {
      standardizedSpeedValue = "0";
    }
    setStandardizedSpeed(standardizedSpeedValue);

    // Prepare data to send
    const postData = {
      average_broadband_speed: avgSpeed,
      userId: user.id,
    };

    try {
      setIsSubmitting(true);
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
      console.log('Result:', result);
      alert("Data calculated and saved successfully!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error saving data:', errorMessage);
      alert("Failed to save data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Calculate Average and Standardized Broadband Speed
      </h1>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Enter Broadband Speeds (Mbps) for the Month (comma-separated):
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={speeds}
            onChange={(e) => setSpeeds(e.target.value)}
            placeholder="50, 55, 53, 52, 54"
            required
          />
        </label>
      </div>
      <button
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate'}
      </button>
      {averageSpeed !== null && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-lg">Average Speed: {averageSpeed.toFixed(2)} Mbps</p>
          <p className="text-lg">Standardized Speed: {standardizedSpeed}%</p>
        </div>
      )}
    </div>
  );
}

export default BroadbandSpeedCalculator;