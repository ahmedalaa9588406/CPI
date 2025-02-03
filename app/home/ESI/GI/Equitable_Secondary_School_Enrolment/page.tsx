"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const EquitableSecondarySchoolEnrollment: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [femaleEnrollment, setFemaleEnrollment] = useState<string>(""); // Input: Female enrollment in secondary school
  const [femaleAgeRange, setFemaleAgeRange] = useState<string>(""); // Input: Female secondary education age range
  const [maleEnrollment, setMaleEnrollment] = useState<string>(""); // Input: Male enrollment in secondary school
  const [maleAgeRange, setMaleAgeRange] = useState<string>(""); // Input: Male secondary education age range
  const [standardizedRate, setStandardizedRate] = useState<string | null>(null); // Standardized rate
  const [comment, setComment] = useState<string | null>(null); // Comment based on score
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Benchmark
  const BENCHMARK = 1; // X* = 1

  // Function to get comment based on standardized score
  const getComment = (score: number) => {
    if (score >= 80) return "VERY SOLID";
    else if (score >= 70) return "SOLID";
    else if (score >= 60) return "MODERATELY SOLID";
    else if (score >= 50) return "MODERATELY WEAK";
    else if (score >= 40) return "WEAK";
    else return "VERY WEAK";
  };

  // Function to calculate standardized equitable secondary school enrollment
  const calculateStandardizedEnrollment = () => {
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
      return null;
    }
    if (femaleAgeRangeNum <= 0 || maleAgeRangeNum <= 0) {
      alert("Age range values must be greater than zero.");
      return null;
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

    if (equitableEnrollment === 0 || equitableEnrollment >= 2 * BENCHMARK) {
      standardizedRateValue = 0;
    } else if (equitableEnrollment > 0 && equitableEnrollment < 2 * BENCHMARK) {
      standardizedRateValue = standardizedEnrollment;
    } else if (equitableEnrollment === BENCHMARK) {
      standardizedRateValue = 100;
    }

    const scoreNum = standardizedRateValue.toFixed(2); // Limit to 2 decimal places
    setStandardizedRate(scoreNum);
    const calculatedComment = getComment(parseFloat(scoreNum));
    setComment(calculatedComment); // Set comment based on score
    console.log('Calculated Score:', scoreNum, 'Calculated Comment:', calculatedComment);
    return { equitableEnrollment, scoreNum, calculatedComment };
  };

  // Function to handle calculation and saving data
  const handleCalculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const calculationResult = calculateStandardizedEnrollment();
    if (calculationResult === null) return; // Exit if calculation fails

    const { equitableEnrollment, calculatedComment } = calculationResult;

    try {
      setIsSubmitting(true); // Start loading
      console.log("Submitting data...");

      const postData = {
        equitable_secondary_school_enrollment: equitableEnrollment, // Post the equitable enrollment value
        equitable_secondary_school_enrollment_comment: calculatedComment, // Use the calculated comment
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
        onClick={handleCalculateAndSave}
        disabled={isSubmitting}
        className={`p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate Standardized Rate'}
      </button>

      {standardizedRate !== null && comment !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Standardized Equitable Secondary Enrollment: <span className="font-bold">{standardizedRate}%</span>
          </h3>
          <h3 className="text-lg">
            Comment: <span className="text-blue-500">{comment}</span>
          </h3>
        </div>
      )}
    </div>
  );
};

export default EquitableSecondarySchoolEnrollment;