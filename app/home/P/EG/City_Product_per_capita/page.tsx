"use client";
import React, { useState } from "react";

type Sector = {
  name: string;
  nationalProduct: number;
  nationalEmployment: number;
  cityEmployment: number;
  employmentRatio: number;
  citySectorProduct: number;
};

const App: React.FC = () => {
  const [sectors, setSectors] = useState<Sector[]>([
    {
      name: "Agriculture and mining",
      nationalProduct: 0,
      nationalEmployment: 0,
      cityEmployment: 0,
      employmentRatio: 0,
      citySectorProduct: 0,
    },
    {
      name: "Manufacturing, utilities, construction",
      nationalProduct: 0,
      nationalEmployment: 0,
      cityEmployment: 0,
      employmentRatio: 0,
      citySectorProduct: 0,
    },
    {
      name: "Wholesale and retail trade, transport and communication",
      nationalProduct: 0,
      nationalEmployment: 0,
      cityEmployment: 0,
      employmentRatio: 0,
      citySectorProduct: 0,
    },
    {
      name: "Finance, insurance, real estate and business services",
      nationalProduct: 0,
      nationalEmployment: 0,
      cityEmployment: 0,
      employmentRatio: 0,
      citySectorProduct: 0,
    },
    {
      name: "Community, personal and other services",
      nationalProduct: 0,
      nationalEmployment: 0,
      cityEmployment: 0,
      employmentRatio: 0,
      citySectorProduct: 0,
    },
    {
      name: "Government",
      nationalProduct: 0,
      nationalEmployment: 0,
      cityEmployment: 0,
      employmentRatio: 0,
      citySectorProduct: 0,
    },
    {
      name: "Other",
      nationalProduct: 0,
      nationalEmployment: 0,
      cityEmployment: 0,
      employmentRatio: 0,
      citySectorProduct: 0,
    },
  ]);

  const totalCityPopulation = 1000000; // Example value

  const handleSectorChange = (
    index: number,
    field: keyof Sector,
    value: string
  ) => {
    const updatedSectors = [...sectors];
    (updatedSectors[index][field] as number | string) =
      field === "nationalProduct" ||
      field === "nationalEmployment" ||
      field === "cityEmployment"
        ? parseFloat(value) || 0
        : value;
    setSectors(updatedSectors);
  };

  const calculateEmploymentRatiosAndProducts = () => {
    const updatedSectors = sectors.map((sector) => {
      const employmentRatio =
        sector.nationalEmployment > 0
          ? sector.cityEmployment / sector.nationalEmployment
          : 0;
      const citySectorProduct = sector.nationalProduct * employmentRatio;
      return { ...sector, employmentRatio, citySectorProduct };
    });
    setSectors(updatedSectors);
  };

  const calculateCityProductPerCapita = () => {
    const totalCitySectorProduct = sectors.reduce(
      (total, sector) => total + sector.citySectorProduct,
      0
    );
    return totalCitySectorProduct / totalCityPopulation;
  };

  const determineDecision = (value: number) => {
    const min = Math.log(714.64); // Min in natural log
    const max = Math.log(108818.96); // Max in natural log
    const lnValue = Math.log(value);

    if (lnValue >= max) return "Good";
    if (lnValue < max && lnValue > min) return "Moderate";
    return "Bad";
  };

  const cityProductPerCapita = calculateCityProductPerCapita();
  const decision = determineDecision(cityProductPerCapita);

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">City Product Per Capita Calculator</h1>
      
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Sector</th>
            <th className="border border-gray-300 p-2">National Product</th>
            <th className="border border-gray-300 p-2">National Employment</th>
            <th className="border border-gray-300 p-2">City Employment</th>
            <th className="border border-gray-300 p-2">Employment Ratio</th>
            <th className="border border-gray-300 p-2">City Sector Product</th>
          </tr>
        </thead>
        <tbody>
          {sectors.map((sector, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{sector.name}</td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  value={sector.nationalProduct}
                  onChange={(e) =>
                    handleSectorChange(index, "nationalProduct", e.target.value)
                  }
                  className="border rounded w-full p-1"
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  value={sector.nationalEmployment}
                  onChange={(e) =>
                    handleSectorChange(
                      index,
                      "nationalEmployment",
                      e.target.value
                    )
                  }
                  className="border rounded w-full p-1"
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  value={sector.cityEmployment}
                  onChange={(e) =>
                    handleSectorChange(index, "cityEmployment", e.target.value)
                  }
                  className="border rounded w-full p-1"
                />
              </td>
              <td className="border border-gray-300 p-2">{sector.employmentRatio.toFixed(2)}</td>
              <td className="border border-gray-300 p-2">{sector.citySectorProduct.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button 
        onClick={calculateEmploymentRatiosAndProducts} 
        className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
       >
        Calculate Employment Ratios and Products
       </button>

       <h2 className="mt-4 text-lg font-semibold">City Product Per Capita: {cityProductPerCapita.toFixed(2)}</h2>
       <h2 className="mt-2 text-lg font-semibold">Decision: {decision}</h2>
     </div>
   );
};

export default App;
