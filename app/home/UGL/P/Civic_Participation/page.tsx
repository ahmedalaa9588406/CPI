"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const CivicParticipation: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [engagedPeople, setEngagedPeople] = useState<number | string>("");
  const [adultPeople, setAdultPeople] = useState<number | string>("");
  const [participationRate, setParticipationRate] = useState<number | null>(null);
  const [engagementLevel, setEngagementLevel] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const calculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const engaged = parseFloat(engagedPeople.toString());
    const adults = parseFloat(adultPeople.toString());

    if (isNaN(engaged) || isNaN(adults) || adults <= 0) {
      alert("Please provide valid inputs for both fields.");
      return;
    }

    const rate = (engaged / adults) * 100;
    setParticipationRate(rate);

    let engagementText;
    if (rate >= 75) {
      engagementText = "High Engagement";
    } else if (rate >= 50) {
      engagementText = "Moderate Engagement";
    } else {
      engagementText = "Low Engagement";
    }
    setEngagementLevel(engagementText);

    // Prepare data to send
    const postData = {
      civic_participation: rate,
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
      <h1 className="text-2xl font-bold mb-6 text-center">Civic Participation Indicator</h1>
      
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          People Engaged in Civic Associations:
        </label>
        <input
          type="number"
          value={engagedPeople}
          onChange={(e) => setEngagedPeople(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter the number of engaged people"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Total Adult Population in the City:
        </label>
        <input
          type="number"
          value={adultPeople}
          onChange={(e) => setAdultPeople(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter the total adult population"
        />
      </div>
      <button
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`p-4 bg-blue-600 text-white rounded-lg w-full text-xl hover:bg-blue-700 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate Civic Participation'}
      </button>
      {participationRate !== null && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-4">
            Civic Participation Rate: {participationRate.toFixed(2)}%
          </h2>
          <h2 className="text-xl font-semibold">
            Engagement Level: {engagementLevel}
          </h2>
        </div>
      )}
    </div>
  );
};

export default CivicParticipation;