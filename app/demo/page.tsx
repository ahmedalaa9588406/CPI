/**
 * Demo page showcasing AI Data Collection improvements
 * This bypasses authentication for demonstration purposes
 */

"use client";

import React, { useState } from 'react';

// Simple mock of the AI Data Assistant without external dependencies
const MockAIDataAssistant = ({ indicator, currentValue, onSuggestionAccept }) => {
  const [showPrediction, setShowPrediction] = useState(false);
  const [showExternalData, setShowExternalData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const mockPrediction = {
    predictedValue: 42.5,
    confidence: 0.85,
    basedOn: ['city_product_per_capita', 'literacy_rate', 'pm25_concentration']
  };

  const mockExternalData = [
    { value: 41.2, source: { name: 'Environmental Monitoring Network', confidence: 0.9 } },
    { value: 43.8, source: { name: 'Satellite Data Service', confidence: 0.85 } },
    { value: 42.1, source: { name: 'Government Statistics', confidence: 0.95 } }
  ];

  const handlePredict = () => {
    setIsLoading(true);
    setTimeout(() => {
      setShowPrediction(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleCollectExternal = () => {
    setIsLoading(true);
    setTimeout(() => {
      setShowExternalData(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded-r">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800">
            AI Data Assistant
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>Get AI-powered suggestions and external data for better accuracy.</p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {!currentValue && (
              <button
                onClick={handlePredict}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 disabled:opacity-50"
              >
                {isLoading ? 'Predicting...' : 'Predict Value'}
              </button>
            )}

            <button
              onClick={handleCollectExternal}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 disabled:opacity-50"
            >
              {isLoading ? 'Collecting...' : 'Collect External Data'}
            </button>
          </div>

          {showPrediction && (
            <div className="mt-3 p-3 bg-white border rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-900 mb-2">AI Prediction</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Predicted Value:</span>
                  <span className="text-sm font-medium">{mockPrediction.predictedValue}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Confidence:</span>
                  <span className="text-sm font-medium text-green-600">
                    High ({(mockPrediction.confidence * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Based on: {mockPrediction.basedOn.join(', ')}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => onSuggestionAccept && onSuggestionAccept(mockPrediction.predictedValue)}
                    className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Accept Prediction
                  </button>
                  <button
                    onClick={() => setShowPrediction(false)}
                    className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {showExternalData && (
            <div className="mt-3 p-3 bg-white border rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-900 mb-2">External Data Sources</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {mockExternalData.map((dataPoint, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="text-sm font-medium">{dataPoint.value}</div>
                      <div className="text-xs text-gray-500">
                        {dataPoint.source.name} ({(dataPoint.source.confidence * 100).toFixed(0)}% reliable)
                      </div>
                    </div>
                    <button
                      onClick={() => onSuggestionAccept && onSuggestionAccept(dataPoint.value)}
                      className="px-2 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700"
                    >
                      Use
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowExternalData(false)}
                className="mt-2 px-3 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Mock Data Quality Dashboard
const MockDataQualityDashboard = () => {
  const mockMetrics = {
    totalIndicators: 12,
    filledIndicators: 7,
    missingIndicators: 5,
    qualityScore: 85.3
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Quality Dashboard</h2>
        <p className="text-gray-600">AI-powered insights for your CPI data collection progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{mockMetrics.filledIndicators}</div>
          <div className="text-sm text-blue-800">Indicators Filled</div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">{mockMetrics.totalIndicators}</div>
          <div className="text-sm text-gray-800">Total Indicators</div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{mockMetrics.missingIndicators}</div>
          <div className="text-sm text-yellow-800">Missing Data</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{mockMetrics.qualityScore}%</div>
          <div className="text-sm text-green-800">Quality Score</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Data Completion</span>
          <span className="text-sm text-gray-500">{mockMetrics.filledIndicators}/{mockMetrics.totalIndicators}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${(mockMetrics.filledIndicators / mockMetrics.totalIndicators) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Recommendations</h3>
        <div className="space-y-2">
          <div className="flex items-start p-3 bg-blue-50 rounded-lg">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-blue-800">Add environmental indicators for better sustainability assessment</span>
          </div>
          <div className="flex items-start p-3 bg-blue-50 rounded-lg">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-blue-800">Consider using AI predictions for: pm25_concentration, co2_emissions, literacy_rate</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main demo page
const AIDemoPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI-Powered CPI Data Collection Demo
          </h1>
          <p className="text-lg text-gray-600">
            Enhanced City Prosperity Index with AI data collection and quality improvements
          </p>
        </div>

        {/* Sample Input Form with AI Assistant */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">PM2.5 Concentration (μg/m³)</h2>
          
          <MockAIDataAssistant
            indicator="pm25_concentration"
            currentValue={inputValue ? parseFloat(inputValue) : undefined}
            onSuggestionAccept={(value) => setInputValue(value.toString())}
          />
          
          <div className="mb-4">
            <label className="block mb-2 font-semibold">
              Enter PM2.5 Concentration:
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="border rounded p-2 w-full"
              placeholder="Enter value or use AI suggestions above"
            />
          </div>
          
          <button className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Calculate and Save
          </button>
        </div>

        {/* Toggle Dashboard */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {showDashboard ? 'Hide' : 'Show'} AI Data Quality Dashboard
          </button>
        </div>

        {/* Data Quality Dashboard */}
        {showDashboard && <MockDataQualityDashboard />}

        {/* Features Overview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-4">Missing Value Prediction</h3>
            </div>
            <p className="text-gray-600">
              AI algorithms predict missing indicator values based on correlations with available data.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-4">Multi-Source Integration</h3>
            </div>
            <p className="text-gray-600">
              Collect and harmonize data from sensors, satellites, and administrative records.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-4">Quality Validation</h3>
            </div>
            <p className="text-gray-600">
              Statistical analysis detects outliers and provides quality scores with recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDemoPage;