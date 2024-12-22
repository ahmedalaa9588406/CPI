"use client";

import React, { useState } from "react";

interface LifeTableRow {
  age: string;
  lx: string;
  tx: string;
}

function LifeExpectancyCalculator() {
  const [data, setData] = useState<LifeTableRow[]>([{ age: "", lx: "", tx: "" }]);
  const [lifeExpectancy, setLifeExpectancy] = useState<string | null>(null);
  const [standardizedScore, setStandardizedScore] = useState<string | null>(null);

  const MIN_LIFE_EXPECTANCY = 49;
  const MAX_LIFE_EXPECTANCY = 83.48;

  // Function to update data for each row
  const updateRow = (index: number, field: keyof LifeTableRow, value: string) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  // Add a new row for additional age band data
  const addRow = () => {
    setData([...data, { age: "", lx: "", tx: "" }]);
  };

  // Remove the last row
  const removeRow = () => {
    if (data.length > 1) {
      setData(data.slice(0, -1));
    }
  };

  // Function to calculate life expectancy at birth
  const calculateLifeExpectancy = () => {
    let t0 = 0; // Total years lived
    let l0 = 0; // Number of people alive at age 0

    for (const row of data) {
      const lx = parseFloat(row.lx);
      const tx = parseFloat(row.tx);

      if (!isNaN(lx) && !isNaN(tx)) {
        t0 += tx; // Accumulate total years lived
        if (l0 === 0) l0 = lx; // Set l0 from the first row (age 0)
      }
    }

    if (l0 > 0) {
      const e0 = t0 / l0; // Calculate life expectancy
      setLifeExpectancy(e0.toFixed(2));

      // Calculate the standardized score
      const standardized = Math.min(
        100,
        Math.max(
          0,
          ((e0 - MIN_LIFE_EXPECTANCY) / (MAX_LIFE_EXPECTANCY - MIN_LIFE_EXPECTANCY)) * 100
        )
      );
      setStandardizedScore(standardized.toFixed(2));
    } else {
      alert("Please ensure valid values for the number of people alive at age 0 (l0).");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Life Expectancy Calculator</h1>

      <table className="w-full mb-4 border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">Age</th>
            <th className="border border-gray-400 px-4 py-2">\( l_x \) (Number of people alive at start)</th>
            <th className="border border-gray-400 px-4 py-2">\( T_x \) (Total years lived)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td className="border border-gray-400 px-4 py-2">
                <input
                  type="number"
                  value={row.age}
                  onChange={(e) => updateRow(index, "age", e.target.value)}
                  className="border rounded p-2 w-full"
                  placeholder="Age"
                />
              </td>
              <td className="border border-gray-400 px-4 py-2">
                <input
                  type="number"
                  value={row.lx}
                  onChange={(e) => updateRow(index, "lx", e.target.value)}
                  className="border rounded p-2 w-full"
                  placeholder="l_x"
                />
              </td>
              <td className="border border-gray-400 px-4 py-2">
                <input
                  type="number"
                  value={row.tx}
                  onChange={(e) => updateRow(index, "tx", e.target.value)}
                  className="border rounded p-2 w-full"
                  placeholder="T_x"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-4">
        <button
          onClick={addRow}
          className="mr-2 p-2 bg-blue-500 text-white rounded"
        >
          Add Age Band
        </button>
        <button
          onClick={removeRow}
          className="p-2 bg-red-500 text-white rounded"
        >
          Remove Age Band
        </button>
      </div>

      <button
        onClick={calculateLifeExpectancy}
        className="p-2 bg-green-500 text-white rounded w-full"
      >
        Calculate Life Expectancy
      </button>

      {lifeExpectancy && (
        <div className="mt-4">
          <p className="text-xl font-bold">
            Life Expectancy at Birth (\( e_0 \)): {lifeExpectancy} years
          </p>
          {standardizedScore && (
            <p className="text-lg font-semibold mt-2">
              Standardized Score: {standardizedScore}%
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default LifeExpectancyCalculator;
