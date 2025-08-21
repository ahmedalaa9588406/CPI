/**
 * AI Data Insights Page
 * Shows comprehensive AI-powered data quality and collection insights
 */

"use client";

import React from 'react';
import { DataQualityDashboard } from '@/components/DataQualityDashboard';

const AIDataInsights: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI Data Insights
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get AI-powered insights into your City Prosperity Index data collection. 
            Our machine learning algorithms help identify missing data, predict values, 
            and improve overall data quality from multiple sources.
          </p>
        </div>

        {/* Main Dashboard */}
        <DataQualityDashboard />

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-4">
                Missing Value Prediction
              </h3>
            </div>
            <p className="text-gray-600">
              AI algorithms predict missing indicator values based on correlations with available data, 
              improving data completeness and reliability.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-4">
                Multi-Source Integration
              </h3>
            </div>
            <p className="text-gray-600">
              Collect and harmonize data from sensors, satellites, administrative records, 
              and social media with weighted averaging based on source reliability.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-4">
                Quality Validation
              </h3>
            </div>
            <p className="text-gray-600">
              Statistical analysis detects outliers, validates data consistency, 
              and provides quality scores with actionable recommendations.
            </p>
          </div>
        </div>

        {/* Implementation Notes */}
        <div className="mt-12 bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            AI Implementation Notes
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              <strong>Correlation-Based Prediction:</strong> Uses established relationships between 
              urban indicators (e.g., GDP per capita ↔ literacy rate) to estimate missing values.
            </p>
            <p>
              <strong>Confidence Scoring:</strong> Each prediction includes a confidence level 
              based on data availability and correlation strength.
            </p>
            <p>
              <strong>External Data Sources:</strong> Simulates integration with environmental 
              sensors, satellite imagery, and government databases.
            </p>
            <p>
              <strong>Data Quality Assessment:</strong> Uses statistical methods like IQR for 
              outlier detection and source reliability weighting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDataInsights;