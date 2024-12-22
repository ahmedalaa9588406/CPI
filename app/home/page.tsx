"use client"
import React from 'react'
import { useRouter } from "next/navigation"; 


export function CardWithForm() {
  const router = useRouter();

  const handleCardClick = (id:number) => {
    // Static navigation based on the card clicked
    if (id === 1) {
      router.push("/home/P");
    } else if (id === 2) {
      router.push("/home/ID");
    } else if (id === 3) {
      router.push("/home/QOL");
    } else if (id === 4) {
      router.push("/home/ESI");
    } else if (id === 5) {
      router.push("/home/ES");
    }
    else if (id === 6) {
      router.push("/home/UGL");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-4/5 max-w-6xl">
        {/* Grid container for all cards */}
        <div className="grid grid-cols-1 gap-8">
          {/* First row with three cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Productivity Index*/}
            <div
              className="relative group bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handleCardClick(1)} // Static navigation on click
            >
              <div className="flex flex-col items-center p-6">
                <div className="w-16 h-16 bg-blue-500 text-white text-2xl flex items-center justify-center rounded-full mb-4 shadow-lg">
                  1
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Productivity Index</h4>
              </div>
            </div>

            {/* Infrastructure Index */}
            <div
              className="relative group bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handleCardClick(2)} // Static navigation on click
            >
              <div className="flex flex-col items-center p-6">
                <div className="w-16 h-16 bg-blue-500 text-white text-2xl flex items-center justify-center rounded-full mb-4 shadow-lg">
                  2
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Infrastructure Index</h4>
              </div>
            </div>

            {/* Quality of Life Index */}
            <div
              className="relative group bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handleCardClick(3)} // Static navigation on click
            >
              <div className="flex flex-col items-center p-6">
                <div className="w-16 h-16 bg-blue-500 text-white text-2xl flex items-center justify-center rounded-full mb-4 shadow-lg">
                  3
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Quality of Life Index</h4>
              </div>
            </div>
          </div>

          {/* Second row with two centered cards */}
          <div className="flex justify-center gap-8">
            {/* Equity and Social Inclusion Index  */}
            <div
              className="relative group bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handleCardClick(4)} // Static navigation on click
            >
              <div className="flex flex-col items-center p-6">
                <div className="w-16 h-16 bg-blue-500 text-white text-2xl flex items-center justify-center rounded-full mb-4 shadow-lg">
                  4
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Equity and Social Inclusion Index </h4>
              </div>
            </div>

            {/* Environmental Sustainability Index  */}
            <div
              className="relative group bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handleCardClick(5)} // Static navigation on click
            >
              <div className="flex flex-col items-center p-6">
                <div className="w-16 h-16 bg-blue-500 text-white text-2xl flex items-center justify-center rounded-full mb-4 shadow-lg">
                  5
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Environmental Sustainability Index </h4>
              </div>
            </div>

            {/* Governance and Legislation Index  */}
            <div
              className="relative group bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handleCardClick(6)} // Static navigation on click
            >
              <div className="flex flex-col items-center p-6">
                <div className="w-16 h-16 bg-blue-500 text-white text-2xl flex items-center justify-center rounded-full mb-4 shadow-lg">
                  6
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Governance and Legislation Index </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardWithForm;
