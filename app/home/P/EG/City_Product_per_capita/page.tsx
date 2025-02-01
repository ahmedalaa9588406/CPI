"use client";
import React, { useState } from "react";
import { useUser } from '@clerk/nextjs';

const CityProductPerCapitaPage: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [nationalProduct, setNationalProduct] = useState<number[]>(Array(7).fill(0));
  const [nationalEmployment, setNationalEmployment] = useState<number[]>(Array(7).fill(0));
  const [cityEmployment, setCityEmployment] = useState<number[]>(Array(7).fill(0));
  const [cityPopulation, setCityPopulation] = useState<number>(0);
  const [pppExchangeRate, setPppExchangeRate] = useState<number>(1);
  const [cityProductPerCapita, setCityProductPerCapita] = useState<number | null>(null);
  const [standardizedValue, setStandardizedValue] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const sectors = [
    'Agriculture and mining',
    'Manufacturing, utilities, construction',
    'Wholesale and retail trade, transport and communication',
    'Finance, insurance, real estate and business services',
    'Community, personal and other services',
    'Government',
    'Other',
  ];

  const calculateAndSave = async () => {
    if (!isLoaded || !user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    let totalCityProduct = 0;
    for (let i = 0; i < sectors.length; i++) {
      const employmentRatio = cityEmployment[i] / nationalEmployment[i];
      const citySectorProduct = nationalProduct[i] * employmentRatio;
      totalCityProduct += citySectorProduct;
    }
    const cityProductPerCapitaValue = (totalCityProduct / cityPopulation) * pppExchangeRate;
    setCityProductPerCapita(cityProductPerCapitaValue);

    // Standardization
    const min = 714.64;
    const max = 108818.96;
    const lnCityProduct = Math.log(cityProductPerCapitaValue);
    const lnMin = Math.log(min);
    const lnMax = Math.log(max);
    let standardizedValue = 0;
    if (lnCityProduct >= 11.60) {
      standardizedValue = 100;
    } else if (lnCityProduct > 6.57 && lnCityProduct < 11.60) {
      standardizedValue = ((lnCityProduct - lnMin) / (lnMax - lnMin)) * 100;
    } else if (lnCityProduct <= 6.57) {
      standardizedValue = 0;
    }
    setStandardizedValue(standardizedValue);

    // Prepare data to send
    const postData = {
      city_product_per_capita: cityProductPerCapitaValue,
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
      <h1 className="text-3xl font-bold mb-6 text-center">City Product Per Capita Calculator</h1>
      
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Input Data</h2>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Sector</th>
              <th className="border border-gray-300 p-2">National Product</th>
              <th className="border border-gray-300 p-2">National Employment</th>
              <th className="border border-gray-300 p-2">City Employment</th>
            </tr>
          </thead>
          <tbody>
            {sectors.map((sector, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{sector}</td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    value={nationalProduct[index]}
                    onChange={(e) => {
                      const newNationalProduct = [...nationalProduct];
                      newNationalProduct[index] = parseFloat(e.target.value);
                      setNationalProduct(newNationalProduct);
                    }}
                    className="border rounded w-full p-1"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    value={nationalEmployment[index]}
                    onChange={(e) => {
                      const newNationalEmployment = [...nationalEmployment];
                      newNationalEmployment[index] = parseFloat(e.target.value);
                      setNationalEmployment(newNationalEmployment);
                    }}
                    className="border rounded w-full p-1"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    value={cityEmployment[index]}
                    onChange={(e) => {
                      const newCityEmployment = [...cityEmployment];
                      newCityEmployment[index] = parseFloat(e.target.value);
                      setCityEmployment(newCityEmployment);
                    }}
                    className="border rounded w-full p-1"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-6">
        <label className="block mb-2 font-semibold">
          City Population:
          <input
            type="number"
            value={cityPopulation}
            onChange={(e) => setCityPopulation(parseFloat(e.target.value))}
            className="border rounded p-2 w-full"
          />
        </label>
      </div>
      <div className="mb-6">
        <label className="block mb-2 font-semibold">
          PPP Exchange Rate:
          <input
            type="number"
            value={pppExchangeRate}
            onChange={(e) => setPppExchangeRate(parseFloat(e.target.value))}
            className="border rounded p-2 w-full"
          />
        </label>
      </div>
      <button
        onClick={calculateAndSave}
        disabled={isSubmitting}
        className={`p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Calculating and Saving...' : 'Calculate City Product Per Capita'}
      </button>
      {cityProductPerCapita !== null && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <p className="text-lg">
            <strong>City Product Per Capita:</strong> {cityProductPerCapita.toFixed(2)} US$ (2011 PPP)
          </p>
          <p className="text-lg">
            <strong>Standardized Value:</strong> {standardizedValue?.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default CityProductPerCapitaPage;