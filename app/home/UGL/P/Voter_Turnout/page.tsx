"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const VoterTurnout: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [votersWhoCastBallot, setVotersWhoCastBallot] = useState<number | string>(""); // Input for voters who cast a ballot
  const [eligibleVoters, setEligibleVoters] = useState<number | string>(""); // Input for number of eligible voters
  const [voterTurnout, setVoterTurnout] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const calculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const castBallot = parseFloat(votersWhoCastBallot.toString());
    const eligible = parseFloat(eligibleVoters.toString());

    if (isNaN(castBallot) || isNaN(eligible) || eligible <= 0 || castBallot < 0 || castBallot > eligible) {
      alert("Please provide valid inputs for both fields.");
      return;
    }

    const turnout = (castBallot / eligible) * 100;
    setVoterTurnout(turnout);

    // Prepare data to send
    const postData = {
      voter_turnout: turnout,
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
      <h1 className="text-2xl font-bold mb-6 text-center">Voter Turnout Calculator</h1>
      
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Voters Who Cast a Ballot:
        </label>
        <input
          type="number"
          value={votersWhoCastBallot}
          onChange={(e) => setVotersWhoCastBallot(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter number of voters who cast a ballot"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold">
          Number of Eligible Voters:
        </label>
        <input
          type="number"
          value={eligibleVoters}
          onChange={(e) => setEligibleVoters(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter number of eligible voters"
        />
      </div>
      <button
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`p-4 bg-blue-600 text-white rounded-lg w-full text-xl hover:bg-blue-700 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate Voter Turnout'}
      </button>
      {voterTurnout !== null && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold mb-4">
            Voter Turnout: {voterTurnout.toFixed(2)}%
          </h2>
        </div>
      )}
    </div>
  );
};

export default VoterTurnout;