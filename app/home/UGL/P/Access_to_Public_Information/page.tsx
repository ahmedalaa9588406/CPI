"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const AccessToPublicInfo: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const totalElements = 10; // Total number of elements to check
  const [accessScore, setAccessScore] = useState<number | null>(null);
  const [transparencyLevel, setTransparencyLevel] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const handleCheckboxChange = (element: string) => {
    setSelectedElements((prev) =>
      prev.includes(element)
        ? prev.filter((item) => item !== element)
        : [...prev, element]
    );
  };

  const calculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const numberOfSelected = selectedElements.length;
    const score = (numberOfSelected / totalElements) * 100;
    setAccessScore(score);

    let transparencyText;
    if (score === 100) {
      transparencyText = "High Transparency";
    } else if (score >= 50) {
      transparencyText = "Moderate Transparency";
    } else {
      transparencyText = "Low Transparency";
    }
    setTransparencyLevel(transparencyText);

    // Prepare data to send
    const postData = {
      access_to_public_information: score,
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
      <h2 className="text-2xl font-bold mb-4">Access to Local Public Information</h2>
      
      <p className="mb-4">
        Does the E-government website possess the following elements? Select all that apply:
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
      <button
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`p-4 bg-blue-600 text-white rounded-lg w-full text-xl hover:bg-blue-700 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate Access Score'}
      </button>
      {accessScore !== null && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-4">
            Access Score: {accessScore.toFixed(2)}%
          </h2>
          <h2 className="text-xl font-semibold">
            Transparency Level: {transparencyLevel}
          </h2>
        </div>
      )}
    </div>
  );
};

export default AccessToPublicInfo;