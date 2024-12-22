"use client";
import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

function CardSlider() {
  const router = useRouter();

  const handleCardClick = (id:number) => {
    // Static navigation based on the card clicked
    if (id === 1) {
      router.push("/home/ID/subid");
    } else if (id === 2) {
      router.push("/home/ID/SI");
    } else if (id === 3) {
      router.push("/home/ID/ICT");
    } else if (id === 4) {
      router.push("/home/ID/UM");
    } else if (id === 5) {
      router.push("/home/ID/UF");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-4/5 max-w-6xl">
        {/* Grid container for all cards */}
        <div className="grid grid-cols-1 gap-8">
          {/* First row with three cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Housing Infrastructure */}
            <div
              className="relative group bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handleCardClick(1)} // Static navigation on click
            >
              <div className="flex flex-col items-center p-6">
                <div className="w-16 h-16 bg-blue-500 text-white text-2xl flex items-center justify-center rounded-full mb-4 shadow-lg">
                  1
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Housing Infrastructure</h4>
              </div>
            </div>

            {/* Social Infrastructure */}
            <div
              className="relative group bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handleCardClick(2)} // Static navigation on click
            >
              <div className="flex flex-col items-center p-6">
                <div className="w-16 h-16 bg-blue-500 text-white text-2xl flex items-center justify-center rounded-full mb-4 shadow-lg">
                  2
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Social Infrastructure</h4>
              </div>
            </div>

            {/* Globalization */}
            <div
              className="relative group bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handleCardClick(3)} // Static navigation on click
            >
              <div className="flex flex-col items-center p-6">
                <div className="w-16 h-16 bg-blue-500 text-white text-2xl flex items-center justify-center rounded-full mb-4 shadow-lg">
                  3
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Information and Communication Technology</h4>
              </div>
            </div>
          </div>

          {/* Second row with two centered cards */}
          <div className="flex justify-center gap-8">
            {/* Urban Mobility */}
            <div
              className="relative group bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handleCardClick(4)} // Static navigation on click
            >
              <div className="flex flex-col items-center p-6">
                <div className="w-16 h-16 bg-blue-500 text-white text-2xl flex items-center justify-center rounded-full mb-4 shadow-lg">
                  4
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Urban Mobility</h4>
              </div>
            </div>

            {/* Urban Form */}
            <div
              className="relative group bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handleCardClick(5)} // Static navigation on click
            >
              <div className="flex flex-col items-center p-6">
                <div className="w-16 h-16 bg-blue-500 text-white text-2xl flex items-center justify-center rounded-full mb-4 shadow-lg">
                  5
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Urban Form</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardSlider;
