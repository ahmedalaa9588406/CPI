"use client";

import React, { useState } from "react";

const LandUseEfficiencyIndicator: React.FC = () => {
  const [urbInit, setUrbInit] = useState<number | string>(""); // Built-up area in the initial year
  const [urbFinal, setUrbFinal] = useState<number | string>(""); // Built-up area in the final year
  const [popInit, setPopInit] = useState<number | string>(""); // Population in the initial year
  const [popFinal, setPopFinal] = useState<number | string>(""); // Population in the final year
  const [years, setYears] = useState<number | string>(""); // Number of years between initial and final year

  const calculateLandUseEfficiency = () => {
    const urb_t = Number(urbInit); // Initial built-up area
    const urb_tn = Number(urbFinal); // Final built-up area
    const pop_t = Number(popInit); // Initial population
    const pop_tn = Number(popFinal); // Final population
    const y = Number(years); // Number of years

    // Validate inputs
    if (
      isNaN(urb_t) ||
      isNaN(urb_tn) ||
      isNaN(pop_t) ||
      isNaN(pop_tn) ||
      isNaN(y) ||
      urb_t <= 0 ||
      urb_tn <= 0 ||
      pop_t <= 0 ||
      pop_tn <= 0 ||
      y <= 0
    ) {
      return "Invalid data";
    }

    // Numerator: Urban expansion growth
    const urbanGrowthRate = Math.pow((urb_tn - urb_t) / urb_t, 1 / y);

    // Denominator: Population annual growth rate
    const populationGrowthRate = Math.pow((pop_tn - pop_t) / pop_t, 1 / y);

    // Land Use Efficiency calculation
    const landUseEfficiency = urbanGrowthRate / populationGrowthRate;

    return landUseEfficiency.toFixed(4); // Limit to 4 decimal places
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Land Use Efficiency Indicator</h2>
      <p className="mb-4">
        This indicator measures the efficiency of urban land use by comparing the growth
        rate of built-up areas to the growth rate of population over a specified period.
      </p>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Built-up Area (Initial Year - Urbₜ):
        </label>
        <input
          type="number"
          value={urbInit}
          onChange={(e) => setUrbInit(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          placeholder="Enter initial built-up area (km²)"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Built-up Area (Final Year - Urbₜ₊ₙ):
        </label>
        <input
          type="number"
          value={urbFinal}
          onChange={(e) => setUrbFinal(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          placeholder="Enter final built-up area (km²)"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Population (Initial Year - Popₜ):
        </label>
        <input
          type="number"
          value={popInit}
          onChange={(e) => setPopInit(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          placeholder="Enter initial population"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Population (Final Year - Popₜ₊ₙ):
        </label>
        <input
          type="number"
          value={popFinal}
          onChange={(e) => setPopFinal(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          placeholder="Enter final population"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Number of Years (y):</label>
        <input
          type="number"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
          placeholder="Enter number of years between initial and final year"
        />
      </div>

      <div className="mt-4">
        <p className="font-semibold">
          Land Use Efficiency:{" "}
          <span className="font-bold">{calculateLandUseEfficiency()}</span>
        </p>
      </div>
    </div>
  );
};

export default LandUseEfficiencyIndicator;
