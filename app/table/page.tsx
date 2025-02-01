'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

type Category = {
  name: string;
  fields: { name: string; description: string }[];
};

const categories: Category[] = [
  {
    name: "House Infrastructure",
    fields: [
      { name: "improved_shelter", description: "Improved Shelter Rating" },
      { name: "improved_water", description: "Improved Water Access" },
      { name: "improved_sanitation", description: "Improved Sanitation" },
      { name: "sufficient_living", description: "Sufficient Living Space" },
      { name: "population", description: "Population" },
      { name: "electricity", description: "Electricity Access" },
      { name: "house_Infrastructure", description: "Overall House Infrastructure Score" },
    ]
  },
  {
    name: "Economic Strength",
    fields: [
      { name: "city_product_per_capita", description: "City Product Per Capita" },
      { name: "old_age_dependency_ratio", description: "Old Age Dependency Ratio" },
      { name: "mean_household_income", description: "Mean Household Income" },
      { name: "economic_strength", description: "Overall Economic Strength Score" },
    ]
  },
  {
    name: "Economic Agglomeration",
    fields: [
      { name: "economic_density", description: "Economic Density" },
      { name: "economic_specialization", description: "Economic Specialization" },
      { name: "economic_agglomeration", description: "Overall Economic Agglomeration Score" },
    ]
  },
  {
    name: "Employment",
    fields: [
      { name: "unemployment_rate", description: "Unemployment Rate" },
      { name: "employment_to_population_ratio", description: "Employment to Population Ratio" },
      { name: "informal_employment", description: "Informal Employment" },
      { name: "employment", description: "Overall Employment Score" },
    ]
  },
  {
    name: "Social Infrastructure",
    fields: [
      { name: "physician_density", description: "Physician Density" },
      { name: "number_of_public_libraries", description: "Number of Public Libraries" },
      { name: "social_infrastructure", description: "Overall Social Infrastructure Score" },
    ]
  },
  {
    name: "Urban Mobility",
    fields: [
      { name: "use_of_public_transport", description: "Use of Public Transport" },
      { name: "average_daily_travel_time", description: "Average Daily Travel Time" },
      { name: "length_of_mass_transport_network", description: "Length of Mass Transport Network" },
      { name: "traffic_fatalities", description: "Traffic Fatalities" },
      { name: "affordability_of_transport", description: "Affordability of Transport" },
      { name: "urban_mobility", description: "Overall Urban Mobility Score" },
    ]
  },
  {
    name: "Urban Form",
    fields: [
      { name: "street_intersection_density", description: "Street Intersection Density" },
      { name: "street_density", description: "Street Density" },
      { name: "land_allocated_to_streets", description: "Land Allocated to Streets" },
      { name: "urban_form", description: "Overall Urban Form Score" },
    ]
  },
  {
    name: "Health",
    fields: [
      { name: "life_expectancy_at_birth", description: "Life Expectancy at Birth" },
      { name: "under_five_mortality_rate", description: "Under Five Mortality Rate" },
      { name: "vaccination_coverage", description: "Vaccination Coverage" },
      { name: "maternal_mortality", description: "Maternal Mortality" },
      { name: "health", description: "Overall Health Score" },
    ]
  },
  {
    name: "Education",
    fields: [
      { name: "literacy_rate", description: "Literacy Rate" },
      { name: "mean_years_of_schooling", description: "Mean Years of Schooling" },
      { name: "early_childhood_education", description: "Early Childhood Education" },
      { name: "net_enrollment_rate_in_higher_education", description: "Net Enrollment Rate in Higher Education" },
      { name: "education", description: "Overall Education Score" },
    ]
  },
  {
    name: "Safety and Security",
    fields: [
      { name: "homicide_rate", description: "Homicide Rate" },
      { name: "theft_rate", description: "Theft Rate" },
      { name: "safety_and_security", description: "Overall Safety and Security Score" },
    ]
  },
  {
    name: "Public Space",
    fields: [
      { name: "accessibility_to_open_public_areas", description: "Accessibility to Open Public Areas" },
      { name: "green_area_per_capita", description: "Green Area Per Capita" },
      { name: "public_space", description: "Overall Public Space Score" },
    ]
  },
  {
    name: "Economic Equity",
    fields: [
      { name: "gini_coefficient", description: "Gini Coefficient" },
      { name: "poverty_rate", description: "Poverty Rate" },
      { name: "economic_equity", description: "Overall Economic Equity Score" },
    ]
  },
  {
    name: "Social Inclusion",
    fields: [
      { name: "slums_households", description: "Slums Households" },
      { name: "youth_unemployment", description: "Youth Unemployment" },
      { name: "social_inclusion", description: "Overall Social Inclusion Score" },
    ]
  },
  {
    name: "Gender Inclusion",
    fields: [
      { name: "equitable_secondary_school_enrollment", description: "Equitable Secondary School Enrollment" },
      { name: "women_in_local_government", description: "Women in Local Government" },
      { name: "women_in_local_work_force", description: "Women in Local Work Force" },
      { name: "gender_inclusion", description: "Overall Gender Inclusion Score" },
    ]
  },
  {
    name: "Urban Diversity",
    fields: [
      { name: "land_use_mix", description: "Land Use Mix" },
      { name: "urban_diversity", description: "Overall Urban Diversity Score" },
    ]
  },
  {
    name: "Air Quality",
    fields: [
      { name: "number_of_monitoring_stations", description: "Number of Monitoring Stations" },
      { name: "pm25_concentration", description: "PM2.5 Concentration" },
      { name: "co2_emissions", description: "CO2 Emissions" },
      { name: "air_quality", description: "Overall Air Quality Score" },
    ]
  },
  {
    name: "Waste Management",
    fields: [
      { name: "solid_waste_collection", description: "Solid Waste Collection" },
      { name: "waste_water_treatment", description: "Waste Water Treatment" },
      { name: "solid_waste_recycling_share", description: "Solid Waste Recycling Share" },
      { name: "waste_management", description: "Overall Waste Management Score" },
    ]
  },
  {
    name: "Sustainable Energy",
    fields: [
      { name: "share_of_renewable_energy", description: "Share of Renewable Energy" },
      { name: "sustainable_energy", description: "Overall Sustainable Energy Score" },
    ]
  },
  {
    name: "Participation",
    fields: [
      { name: "voter_turnout", description: "Voter Turnout" },
      { name: "access_to_public_information", description: "Access to Public Information" },
      { name: "civic_participation", description: "Civic Participation" },
      { name: "participation", description: "Overall Participation Score" },
    ]
  },
  {
    name: "Municipal Financing",
    fields: [
      { name: "own_revenue_collection", description: "Own Revenue Collection" },
      { name: "days_to_start_a_business", description: "Days to Start a Business" },
      { name: "subnational_debt", description: "Subnational Debt" },
      { name: "local_expenditure_efficiency", description: "Local Expenditure Efficiency" },
      { name: "municipal_financing_and_institutional_capacity", description: "Overall Municipal Financing Score" },
    ]
  },
  {
    name: "Governance",
    fields: [
      { name: "land_use_efficiency", description: "Land Use Efficiency" },
      { name: "governance_of_urbanization", description: "Governance of Urbanization" },
    ]
  },
  {
    name: "ICT",
    fields: [
      { name: "internet_access", description: "Internet Access" },
      { name: "home_computer_access", description: "Home Computer Access" },
      { name: "average_broadband_speed", description: "Average Broadband Speed" },
      { name: "ict", description: "Overall ICT Score" },
    ]
  },
];

export default function ContentTable() {
  type CalculationData = {
    [key: string]: number;
  };

  const [calculationData, setCalculationData] = useState<CalculationData | null>(null);
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    const fetchCalculationHistory = async () => {
      if (!isLoaded || !userId) return;

      try {
        const response = await fetch('/api/calculation-history', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCalculationData(data[0] || null);
        } else {
          console.error('Failed to fetch calculation history');
        }
      } catch (error) {
        console.error('Error fetching calculation history:', error);
      }
    };

    fetchCalculationHistory();
  }, [isLoaded, userId]);

  const formatValue = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-';
    return typeof value === 'number' ? value.toFixed(2) : '-';
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Category", "Fields", "Description", "Value"];
    const tableRows: (string | number)[][] = [];

    // Add circular logo and title to first page only
    const logoSize = 25;
    doc.setFillColor(255, 255, 255);
    doc.circle(25, 20, logoSize/2, 'F'); // Create white circular background
    doc.addImage('/assets/AI_PAT.jpg', 'JPEG', 15, 10, logoSize, logoSize);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);

    categories.forEach(category => {
      category.fields.forEach(field => {
        const rowData = [
          category.name,
          field.name,
          field.description,
          calculationData ? formatValue(calculationData[field.name]) : '-'
        ];
        tableRows.push(rowData);
      });
    });

    autoTable(doc, { 
      head: [tableColumn], 
      body: tableRows, 
      startY: 40,
      didDrawPage: function(data) {
        // Only add title on subsequent pages
        if (data.pageNumber > 1) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(16);
        }
      }
    });

    doc.save('city_prosperity_index.pdf');
  };

  const exportToExcel = () => {
    const worksheetData = categories.map(category => 
      category.fields.map(field => ({
        Category: category.name,
        Fields: field.name,
        Description: field.description,
        Value: calculationData ? formatValue(calculationData[field.name]) : '-'
      }))
    ).flat();

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "City Prosperity Index");
    XLSX.writeFile(workbook, 'city_prosperity_index.xlsx');
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return <div>Please sign in to view your calculation history.</div>;
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section with Image */}
      <div className="w-full relative mb-8 bg-gradient-to-b from-gray-900 to-gray-800 p-8">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <h1 className="text-3xl font-bold text-white mb-4 text-center">
            City Prosperity Index Calculations
          </h1>
          <div className="relative w-full max-w-2xl h-[300px] mx-auto">
            <Image
              src="/assets/major.png"
              alt="CPI Major Diagram"
              fill
              style={{ objectFit: 'contain' }}
              className="transition-transform duration-300 hover:scale-105"
              priority
            />
          </div>
          <p className="text-gray-300 text-center mt-4 max-w-2xl">
            This comprehensive dashboard displays the calculated values across all major categories
            of the City Prosperity Index, providing insights into urban development and sustainability metrics.
          </p>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-4 mb-4">
        <button 
          onClick={exportToPDF}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Export to PDF
        </button>
        <button 
          onClick={exportToExcel}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Export to Excel
        </button>
      </div>

      {/* Existing Table Section */}
      <div className="w-full p-4 overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Fields
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Value
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <React.Fragment key={category.name}>
                {category.fields.map((field, fieldIndex) => (
                  <tr 
                    key={`${category.name}-${field.name}`}
                    className={fieldIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  >
                    {fieldIndex === 0 && (
                      <td 
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                        rowSpan={category.fields.length}
                      >
                        {category.name}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {field.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {field.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {calculationData ? formatValue(calculationData[field.name]) : '-'}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}