"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const WomenInLocalGovernment: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [womenInGovJobs, setWomenInGovJobs] = useState<number | string>(""); // Number of women in government jobs
  const [totalGovJobs, setTotalGovJobs] = useState<number | string>(""); // Total government jobs
  const [standardizedRate, setStandardizedRate] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<string | null>(null); // Decision evaluation
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Benchmark
  const BENCHMARK = 50; // X* = 50%

  // Function to get comment based on standardized score
  const getComment = (score: number) => {
    if (score >= 80) return "VERY SOLID";
    else if (score >= 70) return "SOLID";
    else if (score >= 60) return "MODERATELY SOLID";
    else if (score >= 50) return "MODERATELY WEAK";
    else if (score >= 40) return "WEAK";
    else return "VERY WEAK";
  };

  const calculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    // Convert inputs to numbers
    const womenInGovJobsNum = parseFloat(womenInGovJobs.toString());
    const totalGovJobsNum = parseFloat(totalGovJobs.toString());

    // Validate inputs
    if (isNaN(womenInGovJobsNum) || isNaN(totalGovJobsNum)) {
      alert("All inputs must be valid numbers.");
      return;
    }
    if (totalGovJobsNum <= 0) {
      alert("Total government jobs must be greater than zero.");
      return;
    }

    // Women in the local government formula
    const womenInLocalGov = (womenInGovJobsNum / totalGovJobsNum) * 100;

    // Standardized formula with absolute value
    const standardizedValue =
      100 * (1 - Math.abs((womenInLocalGov - BENCHMARK) / BENCHMARK));

    // Get the comment based on the standardized value
    const evaluationComment = getComment(standardizedValue);

    setStandardizedRate(standardizedValue.toFixed(2));
    setEvaluation(evaluationComment);

    // Prepare data to send
    const postData = {
      women_in_local_government: womenInLocalGov,
      women_in_local_government_comment: evaluationComment,
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
      <h2 className="text-2xl font-bold mb-4">Women in the Local Government</h2>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Number of Women in Government Jobs:
        </label>
        <input
          type="number"
          value={womenInGovJobs}
          onChange={(e) => setWomenInGovJobs(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter number of women in government jobs"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Total Government Jobs:</label>
        <input
          type="number"
          value={totalGovJobs}
          onChange={(e) => setTotalGovJobs(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter total government jobs"
        />
      </div>
      <button
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate Standardized Rate'}
      </button>
      {standardizedRate !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Standardized Women in Local Government: {standardizedRate}%
          </h3>
          <h3 className="text-lg">
            Evaluation: {evaluation}
          </h3>
        </div>
      )}
    </div>
  );
};

export default WomenInLocalGovernment;