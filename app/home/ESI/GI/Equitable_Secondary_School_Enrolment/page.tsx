"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const EquitableSecondarySchoolEnrollment: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [femaleEnrollment, setFemaleEnrollment] = useState<string>(""); // Input: Female enrollment in secondary school
  const [femaleAgeRange, setFemaleAgeRange] = useState<string>(""); // Input: Female secondary education age range
  const [maleEnrollment, setMaleEnrollment] = useState<string>(""); // Input: Male enrollment in secondary school
  const [maleAgeRange, setMaleAgeRange] = useState<string>(""); // Input: Male secondary education age range
  const [standardizedRate, setStandardizedRate] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<string | null>(null); // Decision evaluation
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Benchmark
  const BENCHMARK = 1; // X* = 1

  const calculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    // Convert inputs to numbers
    const femaleEnrollmentNum = parseFloat(femaleEnrollment);
    const femaleAgeRangeNum = parseFloat(femaleAgeRange);
    const maleEnrollmentNum = parseFloat(maleEnrollment);
    const maleAgeRangeNum = parseFloat(maleAgeRange);

    // Validate inputs
    if (
      isNaN(femaleEnrollmentNum) ||
      isNaN(femaleAgeRangeNum) ||
      isNaN(maleEnrollmentNum) ||
      isNaN(maleAgeRangeNum)
    ) {
      alert("All inputs must be valid numbers.");
      return;
    }
    if (femaleAgeRangeNum <= 0 || maleAgeRangeNum <= 0) {
      alert("Age range values must be greater than zero.");
      return;
    }

    // Equitable Secondary School Enrollment formula
    const equitableEnrollment =
      (femaleEnrollmentNum / femaleAgeRangeNum) /
      (maleEnrollmentNum / maleAgeRangeNum);

    // Standardized formula with absolute value
    const standardizedEnrollment =
      100 * (1 - Math.abs((equitableEnrollment - BENCHMARK) / BENCHMARK));

    // Decision logic
    let standardizedRateValue: number = 0;
    let evaluationComment: string = "Bad";

    if (equitableEnrollment === 0 || equitableEnrollment >= 2 * BENCHMARK) {
      standardizedRateValue = 0;
      evaluationComment = "Bad";
    } else if (equitableEnrollment > 0 && equitableEnrollment < 2 * BENCHMARK) {
      standardizedRateValue = standardizedEnrollment;
      evaluationComment = "Average";
    } else if (equitableEnrollment === BENCHMARK) {
      standardizedRateValue = 100;
      evaluationComment = "Good";
    }

    setStandardizedRate(standardizedRateValue.toFixed(2));
    setEvaluation(evaluationComment);

    // Prepare data to send
    const postData = {
      equitable_secondary_school_enrollment: equitableEnrollment,
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
      <h2 className="text-2xl font-bold mb-4">Equitable Secondary School Enrollment</h2>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Female Enrollment in Secondary School:
        </label>
        <input
          type="number"
          value={femaleEnrollment}
          onChange={(e) => setFemaleEnrollment(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter female enrollment"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Female Age Range (Secondary Education):</label>
        <input
          type="number"
          value={femaleAgeRange}
          onChange={(e) => setFemaleAgeRange(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter female age range"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Male Enrollment in Secondary School:
        </label>
        <input
          type="number"
          value={maleEnrollment}
          onChange={(e) => setMaleEnrollment(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter male enrollment"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Male Age Range (Secondary Education):</label>
        <input
          type="number"
          value={maleAgeRange}
          onChange={(e) => setMaleAgeRange(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter male age range"
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
            Standardized Equitable Secondary Enrollment: {standardizedRate}%
          </h3>
          <h3 className="text-lg">
            Evaluation: {evaluation}
          </h3>
        </div>
      )}
    </div>
  );
};

export default EquitableSecondarySchoolEnrollment;