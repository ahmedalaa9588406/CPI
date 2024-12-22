"use client";

import React, { useState } from "react";

function HigherEducationEnrollmentCalculator() {
  const [enrolledPopulation, setEnrolledPopulation] = useState<string>(""); // Population enrolled in tertiary education
  const [tertiaryAgePopulation, setTertiaryAgePopulation] = useState<string>(""); // People in the tertiary education age range
  const [enrollmentRate, setEnrollmentRate] = useState<string | null>(null);

  // Function to calculate the enrollment rate
  const calculateEnrollmentRate = () => {
    const enrolled = parseFloat(enrolledPopulation);
    const ageRangePopulation = parseFloat(tertiaryAgePopulation);

    if (!isNaN(enrolled) && !isNaN(ageRangePopulation) && ageRangePopulation > 0) {
      let rate = (enrolled / ageRangePopulation) * 100;

      // Ensure the value is within the range of 0–100%
      if (rate > 100) {
        rate = 100;
      } else if (rate < 0) {
        rate = 0;
      }

      setEnrollmentRate(rate.toFixed(2));
    } else {
      alert("Please provide valid inputs for the calculation.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">
        Net Enrollment Rate in Higher Education
      </h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Population enrolled in tertiary education:
        </label>
        <input
          type="number"
          value={enrolledPopulation}
          onChange={(e) => setEnrolledPopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter number of enrolled people"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          People that belong to the tertiary education age range:
        </label>
        <input
          type="number"
          value={tertiaryAgePopulation}
          onChange={(e) => setTertiaryAgePopulation(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter number of people in the age range"
        />
      </div>

      <button
        onClick={calculateEnrollmentRate}
        className="p-2 bg-blue-500 text-white rounded w-full"
      >
        Calculate Enrollment Rate
      </button>

      {enrollmentRate && (
        <div className="mt-4">
          <p className="text-xl font-bold">
            Enrollment Rate: {enrollmentRate}%
          </p>
        </div>
      )}
    </div>
  );
}

export default HigherEducationEnrollmentCalculator;
