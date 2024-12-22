"use client";

import React, { useState } from "react";

const AccessToPublicInfo: React.FC = () => {
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const totalElements = 10; // Total number of elements to check

  const handleCheckboxChange = (element: string) => {
    setSelectedElements((prev) =>
      prev.includes(element)
        ? prev.filter((item) => item !== element)
        : [...prev, element]
    );
  };

  const calculateScore = () => {
    const numberOfSelected = selectedElements.length;
    const accessScore = (numberOfSelected / totalElements) * 100;
    return accessScore.toFixed(2); // Limit to 2 decimal places
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Access to Local Public Information</h2>

      <p className="mb-4">
        Does the E-government website possess the following elements? Select all
        that apply:
      </p>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        {[
          "Budgets and spending",
          "Senior salaries",
          "Organizational chart",
          "Copies of contracts and tenders",
          "Access to statistics",
          "Posting public notices on meetings, resolution, etc.",
          "Local reporting complaints, concerns, and emergencies",
          "Results of local elections",
          "Tax information",
          "Open tendering procedures",
        ].map((element, index) => (
          <label key={index} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedElements.includes(element)}
              onChange={() => handleCheckboxChange(element)}
              className="mr-2"
            />
            {element}
          </label>
        ))}
      </div>

      <div className="mt-4">
        <p className="font-semibold">
          Access Score: <span className="font-bold">{calculateScore()}%</span>
        </p>
        <p>
          Transparency Level:{" "}
          <span className="font-bold">
            {(() => {
              const score = parseFloat(calculateScore());
              if (score === 100) return "High Transparency";
              if (score >= 50) return "Moderate Transparency";
              return "Low Transparency";
            })()}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AccessToPublicInfo;
