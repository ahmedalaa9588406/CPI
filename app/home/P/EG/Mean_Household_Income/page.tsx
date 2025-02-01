"use client";
import React, { useState, useEffect } from "react";
import { useUser } from '@clerk/nextjs';

const MeanHouseholdIncomeApp: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [householdIncome, setHouseholdIncome] = useState<number | undefined>(); // Allow undefined for no fixed zero value
  const [standardizedIncome, setStandardizedIncome] = useState<number>(0);
  const [decision, setDecision] = useState<string>("");
  const [economicStrength, setEconomicStrength] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const minIncome = 6315; // Minimum income
  const maxIncome = 44773; // Maximum income

  const calculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    if (!householdIncome || householdIncome <= 0) {
      alert("Please enter a valid household income greater than zero.");
      return;
    }

    // Standardization formula
    const standardized =
      100 *
      ((Math.log(householdIncome) - Math.log(minIncome)) /
        (Math.log(maxIncome) - Math.log(minIncome)));
    setStandardizedIncome(standardized);

    // Decision logic
    if (householdIncome >= maxIncome) {
      setDecision("Good");
    } else if (householdIncome > minIncome && householdIncome < maxIncome) {
      setDecision("Moderate");
    } else {
      setDecision("Bad");
    }

    // Prepare data to send
    const postData = {
      mean_household_income: householdIncome,
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

  useEffect(() => {
    // Fetch the values from localStorage and calculate the economic strength
    const cityProductPerCapita = parseFloat(localStorage.getItem("cityProductPerCapita") || "0");
    const oldAgeDependencyRatio = parseFloat(localStorage.getItem("oldAgeDependencyRatio") || "0");
    const values = [cityProductPerCapita, oldAgeDependencyRatio, householdIncome ?? 0].filter((value): value is number => value > 0);
    const average = values.reduce((acc: number, value: number) => acc + value, 0) / values.length;
    setEconomicStrength(average);
  }, [householdIncome]);

  return (
    <div className="max-w-md mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Mean Household Income Calculator</h1>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Enter Mean Household Income (US$):
        </label>
        <input
          type="number"
          value={householdIncome !== undefined ? householdIncome : ""}
          onChange={(e) => setHouseholdIncome(Number(e.target.value) || undefined)}
          className="border rounded p-2 w-full"
          placeholder="Enter household income"
        />
      </div>
      <button
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate Standardized Income'}
      </button>
      {decision && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">
            Standardized Income: {standardizedIncome.toFixed(2)}
          </h2>
          <h2 className="text-lg font-semibold">Decision: {decision}</h2>
          <h2 className="text-lg font-semibold">Economic Strength: {economicStrength.toFixed(2)}</h2>
        </div>
      )}
    </div>
  );
};

export default MeanHouseholdIncomeApp;