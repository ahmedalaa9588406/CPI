/**
 * Data Quality Dashboard Component
 * Displays AI-powered insights about data quality across all CPI indicators
 */

"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useAIData } from '@/lib/hooks/useAIData';

interface DataQualityMetrics {
  totalIndicators: number;
  filledIndicators: number;
  missingIndicators: number;
  qualityScore: number;
  recommendations: string[];
  lastUpdated: Date;
}

export const DataQualityDashboard: React.FC = () => {
  const { user, isLoaded } = useUser();
  const { isLoading, error, predictMissingValue } = useAIData();
  const [metrics, setMetrics] = useState<DataQualityMetrics | null>(null);
  const [predictableIndicators, setPredictableIndicators] = useState<string[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      loadDataQualityMetrics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user]);

  const loadDataQualityMetrics = async () => {
    try {
      // Fetch user's calculation history
      const response = await fetch('/api/calculation-history');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const history = await response.json();
      if (Array.isArray(history) && history.length > 0) {
        const latestRecord = history[0];
        calculateMetrics(latestRecord);
      } else {
        // No data available
        setMetrics({
          totalIndicators: 0,
          filledIndicators: 0,
          missingIndicators: 0,
          qualityScore: 0,
          recommendations: ['Start by entering data for key indicators'],
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      console.error('Error loading data quality metrics:', error);
    }
  };

  const calculateMetrics = (record: Record<string, unknown>) => {
    const indicators = [
      // Economic indicators
      'city_product_per_capita', 'mean_household_income', 'unemployment_rate',
      // Environmental indicators
      'pm25_concentration', 'co2_emissions', 'share_of_renewable_energy', 'waste_water_treatment',
      // Social indicators
      'literacy_rate', 'life_expectancy_at_birth', 'physician_density',
      // Infrastructure indicators
      'internet_access', 'street_intersection_density', 'number_of_monitoring_stations'
    ];

    let filledCount = 0;
    const missing: string[] = [];

    for (const indicator of indicators) {
      const value = record[indicator];
      if (value !== undefined && value !== null && typeof value === 'number' && value > 0) {
        filledCount++;
      } else {
        missing.push(indicator);
      }
    }

    const qualityScore = indicators.length > 0 ? (filledCount / indicators.length) * 100 : 0;
    
    const recommendations = generateRecommendations(filledCount, indicators.length, missing);
    setPredictableIndicators(missing.slice(0, 5)); // Show first 5 predictable indicators

    setMetrics({
      totalIndicators: indicators.length,
      filledIndicators: filledCount,
      missingIndicators: missing.length,
      qualityScore,
      recommendations,
      lastUpdated: new Date((record.updatedAt as string) || (record.createdAt as string))
    });
  };

  const generateRecommendations = (filled: number, total: number, missing: string[]): string[] => {
    const recommendations: string[] = [];
    
    const completionRate = (filled / total) * 100;
    
    if (completionRate < 30) {
      recommendations.push('Focus on collecting basic economic and social indicators first');
      recommendations.push('Use AI predictions to estimate missing values');
    } else if (completionRate < 60) {
      recommendations.push('Add environmental indicators for better sustainability assessment');
      recommendations.push('Consider external data sources for missing indicators');
    } else if (completionRate < 80) {
      recommendations.push('Fill remaining gaps to achieve comprehensive coverage');
      recommendations.push('Validate existing data quality with external sources');
    } else {
      recommendations.push('Excellent data coverage! Regularly update values for accuracy');
      recommendations.push('Consider adding more detailed sub-indicators');
    }

    if (missing.length > 0) {
      recommendations.push(`Consider using AI predictions for: ${missing.slice(0, 3).join(', ')}`);
    }

    return recommendations;
  };

  const handlePredictMissing = async (indicator: string) => {
    try {
      const result = await predictMissingValue(indicator);
      if (result.prediction) {
        alert(`Predicted ${indicator}: ${result.prediction.predictedValue.toFixed(2)} (Confidence: ${(result.prediction.confidence * 100).toFixed(1)}%)`);
      }
    } catch (error) {
      console.error('Prediction failed:', error);
    }
  };

  if (!isLoaded || !user) {
    return <div>Loading...</div>;
  }

  if (!metrics) {
    return <div>Loading data quality metrics...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Data Quality Dashboard
        </h2>
        <p className="text-gray-600">
          AI-powered insights for your CPI data collection progress
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {/* Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {metrics.filledIndicators}
          </div>
          <div className="text-sm text-blue-800">Indicators Filled</div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">
            {metrics.totalIndicators}
          </div>
          <div className="text-sm text-gray-800">Total Indicators</div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {metrics.missingIndicators}
          </div>
          <div className="text-sm text-yellow-800">Missing Data</div>
        </div>
        
        <div className={`p-4 rounded-lg ${
          metrics.qualityScore >= 80 ? 'bg-green-50' : 
          metrics.qualityScore >= 60 ? 'bg-yellow-50' : 'bg-red-50'
        }`}>
          <div className={`text-2xl font-bold ${
            metrics.qualityScore >= 80 ? 'text-green-600' : 
            metrics.qualityScore >= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {metrics.qualityScore.toFixed(1)}%
          </div>
          <div className={`text-sm ${
            metrics.qualityScore >= 80 ? 'text-green-800' : 
            metrics.qualityScore >= 60 ? 'text-yellow-800' : 'text-red-800'
          }`}>
            Quality Score
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Data Completion</span>
          <span className="text-sm text-gray-500">
            {metrics.filledIndicators}/{metrics.totalIndicators}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${metrics.qualityScore}%` }}
          ></div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          AI Recommendations
        </h3>
        <div className="space-y-2">
          {metrics.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-blue-800">{recommendation}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Predictable Indicators */}
      {predictableIndicators.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              AI-Predictable Indicators
            </h3>
            <button
              onClick={() => setShowPredictions(!showPredictions)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showPredictions ? 'Hide' : 'Show'} Predictions
            </button>
          </div>
          
          {showPredictions && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {predictableIndicators.map((indicator) => (
                <div key={indicator} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700 capitalize">
                    {indicator.replace(/_/g, ' ')}
                  </span>
                  <button
                    onClick={() => handlePredictMissing(indicator)}
                    disabled={isLoading}
                    className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Predicting...' : 'Predict'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Last Updated */}
      <div className="text-xs text-gray-500 text-center">
        Last updated: {metrics.lastUpdated.toLocaleString()}
      </div>
    </div>
  );
};