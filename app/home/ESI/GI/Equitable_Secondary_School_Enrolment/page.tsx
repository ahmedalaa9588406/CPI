"use client";

import React, { useState } from "react";

const EquitableSecondarySchoolEnrollment: React.FC = () => {
  const [femaleEnrollment, setFemaleEnrollment] = useState<string>(""); // Input: Female enrollment in secondary school
  const [femaleAgeRange, setFemaleAgeRange] = useState<string>(""); // Input: Female secondary education age range
  const [maleEnrollment, setMaleEnrollment] = useState<string>(""); // Input: Male enrollment in secondary school
  const [maleAgeRange, setMaleAgeRange] = useState<string>(""); // Input: Male secondary education age range
  const [standardizedRate, setStandardizedRate] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<string | null>(null); // Decision evaluation

  // Benchmark
  const BENCHMARK = 1; // X* = 1

  const calculateEquitableEnrollment = () => {
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
    if (equitableEnrollment === 0 || equitableEnrollment >= 2 * BENCHMARK) {
      setStandardizedRate("0");
      setEvaluation("Bad");
    } else if (equitableEnrollment > 0 && equitableEnrollment < 2 * BENCHMARK) {
      setStandardizedRate(standardizedEnrollment.toFixed(2));
      setEvaluation("Average");
    } else if (equitableEnrollment === BENCHMARK) {
      setStandardizedRate("100");
      setEvaluation("Good");
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
          type="text"
          value={femaleEnrollment}
          onChange={(e) => setFemaleEnrollment(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter female enrollment"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Female Age Range (Secondary Education):</label>
        <input
          type="text"
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
          type="text"
          value={maleEnrollment}
          onChange={(e) => setMaleEnrollment(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter male enrollment"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Male Age Range (Secondary Education):</label>
        <input
          type="text"
          value={maleAgeRange}
          onChange={(e) => setMaleAgeRange(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter male age range"
        />
      </div>

      <button
        onClick={calculateEquitableEnrollment}
        className="p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition"
      >
        Calculate Standardized Rate
      </button>

      {standardizedRate !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Standardized Equitable Secondary Enrollment: {standardizedRate}
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
