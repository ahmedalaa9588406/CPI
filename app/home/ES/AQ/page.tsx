"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

function CardSlider() {
  const router = useRouter();

  const handleCardClick = (id: number) => {
    // Navigation based on the card clicked
    if (id === 1) {
      router.push("/home/ES/AQ/Number_of_Monitoring_Stations");
    } else if (id === 2) {
      router.push("/home/ES/AQ/PM2.5_Concentration");
    } else if (id === 3) {
      router.push("/home/ES/AQ/CO2_Emissions");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-4/5 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Gini Coefficient */}
          <div
            className="relative group bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
            onClick={() => handleCardClick(1)}
          >
            <div className="flex flex-col items-center p-6">
              <div className="w-16 h-16 bg-blue-500 text-white text-2xl flex items-center justify-center rounded-full mb-4 shadow-lg">
                1
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Number of Monitoring Stations</h4>
            </div>
          </div>

          {/* Poverty Rate */}
          <div
            className="relative group bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
            onClick={() => handleCardClick(2)}
          >
            <div className="flex flex-col items-center p-6">
              <div className="w-16 h-16 bg-blue-500 text-white text-2xl flex items-center justify-center rounded-full mb-4 shadow-lg">
                2
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">PM2.5 Concentration</h4>
            </div>
          </div>

          {/* Unemployment Rate */}
          <div
            className="relative group bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
            onClick={() => handleCardClick(3)}
          >
            <div className="flex flex-col items-center p-6">
              <div className="w-16 h-16 bg-blue-500 text-white text-2xl flex items-center justify-center rounded-full mb-4 shadow-lg">
                3
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">CO2 Emissions</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardSlider;
