"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

function BroadbandSpeedCalculator() {
  const { user, isLoaded } = useUser();
  const [speeds, setSpeeds] = useState<string>(""); // Input: comma-separated broadband speeds
  const [averageSpeed, setAverageSpeed] = useState<number | null>(null); // Average broadband speed
  const [standardizedSpeed, setStandardizedSpeed] = useState<string | null>(null); // Standardized speed
  const [comment, setComment] = useState<string | null>(null); // Comment based on score
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Constants for benchmarks
  const MIN_SPEED = 470 / 8; // Convert Kbps to Mbps
  const MAX_SPEED = 87088 / 8; // Convert Kbps to Mbps

  // Function to get comment based on standardized score
  const getComment = (score: number) => {
    if (score >= 80) return "VERY SOLID";
    else if (score >= 70) return "SOLID";
    else if (score >= 60) return "MODERATELY SOLID";
    else if (score >= 50) return "MODERATELY WEAK";
    else if (score >= 40) return "WEAK";
    else return "VERY WEAK";
  };

  // Function to calculate standardized broadband speed
  const calculateStandardizedBroadbandSpeed = () => {
    const speedArray = speeds.split(",").map(Number).filter((speed) => !isNaN(speed));
    if (speedArray.length === 0) {
      alert("Please enter valid broadband speeds.");
      return null;
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

    const scoreNum = standardizedValue.toFixed(2); // Limit to 2 decimal places
    setStandardizedSpeed(scoreNum);
    const calculatedComment = getComment(parseFloat(scoreNum));
    setComment(calculatedComment); // Set comment based on score
    console.log('Calculated Score:', scoreNum, 'Calculated Comment:', calculatedComment);
    return { avgSpeed, scoreNum, calculatedComment };
  };

  // Function to handle calculation and saving data
  const handleCalculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const calculationResult = calculateStandardizedBroadbandSpeed();
    if (calculationResult === null) return; // Exit if calculation fails

    const { avgSpeed, calculatedComment } = calculationResult;

    try {
      setIsSubmitting(true); // Start loading
      console.log("Submitting data...");

      const postData = {
        average_broadband_speed: avgSpeed, // Post the average broadband speed
        average_broadband_speed_comment: calculatedComment, // Use the calculated comment
        userId: user.id,
      };

      console.log("Post Data:", postData); // Debug: Log the post data

      const response = await fetch('/api/calculation-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      console.log("Response Status:", response.status); // Debug: Log the response status

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Result:", result); // Debug: Log the result

      alert("Data calculated and saved successfully!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error saving data:', errorMessage);
      alert("Failed to save data. Please try again.");
    } finally {
      setIsSubmitting(false); // Stop loading
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
        onClick={handleCalculateAndSave}
        disabled={isSubmitting}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate'}
      </button>

      {averageSpeed !== null && standardizedSpeed !== null && comment !== null && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-lg">
            Average Speed: <span className="font-bold">{averageSpeed.toFixed(2)} Mbps</span>
          </p>
          <p className="text-lg">
            Standardized Speed: <span className="font-bold">{standardizedSpeed}%</span>
          </p>
          <p className="text-lg">
            Comment: <span className="text-blue-500">{comment}</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default BroadbandSpeedCalculator;