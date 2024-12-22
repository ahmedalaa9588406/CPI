"use client";

import React, { useState } from "react";

const VoterTurnout: React.FC = () => {
  const [votersWhoCastBallot, setVotersWhoCastBallot] = useState<number | string>(""); // Input for voters who cast a ballot
  const [eligibleVoters, setEligibleVoters] = useState<number | string>(""); // Input for number of eligible voters
  const [voterTurnout, setVoterTurnout] = useState<string | null>(null); // Resulting voter turnout percentage

  const calculateVoterTurnout = () => {
    if (
      votersWhoCastBallot === "" ||
      eligibleVoters === "" ||
      isNaN(Number(votersWhoCastBallot)) ||
      isNaN(Number(eligibleVoters))
    ) {
      alert("Please enter valid numbers for both inputs.");
      return;
    }

    const castBallot = parseFloat(votersWhoCastBallot.toString());
    const eligible = parseFloat(eligibleVoters.toString());

    if (eligible <= 0) {
      alert("Number of eligible voters must be greater than zero.");
      return;
    }

    if (castBallot < 0) {
      alert("Number of voters who cast a ballot cannot be negative.");
      return;
    }

    if (castBallot > eligible) {
      alert("Number of voters who cast a ballot cannot exceed the number of eligible voters.");
      return;
    }

    // Voter Turnout Calculation
    const turnout = (castBallot / eligible) * 100;
    setVoterTurnout(turnout.toFixed(2)); // Limit to 2 decimal places
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Voter Turnout Calculator</h2>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
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

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
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
        onClick={calculateVoterTurnout}
        className="p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition"
      >
        Calculate Voter Turnout
      </button>

      {voterTurnout !== null && (
        <div className="mt-4">
          <h3 className="text-lg">
            Voter Turnout: <span className="font-bold">{voterTurnout}%</span>
          </h3>
        </div>
      )}
    </div>
  );
};

export default VoterTurnout;
