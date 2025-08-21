import React, { useState, useEffect } from 'react';
import { formatDataQuality } from '@/lib/hooks/useAIEnhancedCalculation';

interface DataQualityIndicatorsProps {
  userId?: string;
}

interface DataQualityOverview {
  totalIndicators: number;
  aiEnhancedIndicators: number;
  averageQualityScore: number;
  highQualityIndicators: number;
  lowQualityIndicators: number;
  lastAIUpdate?: string;
}

export const DataQualityIndicators: React.FC<DataQualityIndicatorsProps> = ({ userId }) => {
  const [qualityOverview, setQualityOverview] = useState<DataQualityOverview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fetchDataQuality = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // This would ideally fetch actual data quality metrics from the database
      // For now, we'll simulate the data
      const simulatedData: DataQualityOverview = {
        totalIndicators: 85,
        aiEnhancedIndicators: 12,
        averageQualityScore: 0.78,
        highQualityIndicators: 45,
        lowQualityIndicators: 8,
        lastAIUpdate: new Date().toISOString()
      };

      setQualityOverview(simulatedData);
    } catch (error) {
      console.error('Failed to fetch data quality metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runAIEnhancement = async () => {
    setIsLoading(true);
    try {
      // Common CPI indicators to enhance
      const indicators = [
        'pm25_concentration',
        'green_area_per_capita',
        'life_expectancy_at_birth',
        'literacy_rate',
        'maternal_mortality'
      ];

      const response = await fetch(`/api/ai/data-collection?indicators=${indicators.join(',')}&lat=40.7128&lon=-74.0060`);
      
      if (response.ok) {
        await fetchDataQuality(); // Refresh the overview
        alert('AI data enhancement completed successfully!');
      } else {
        throw new Error('AI enhancement failed');
      }
    } catch (error) {
      console.error('AI enhancement failed:', error);
      alert('Failed to run AI enhancement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataQuality();
  }, [userId]);

  if (!qualityOverview) {
    return null;
  }

  const qualityFormatted = formatDataQuality(qualityOverview.averageQualityScore);
  const enhancementPercentage = (qualityOverview.aiEnhancedIndicators / qualityOverview.totalIndicators) * 100;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Data Quality & AI Enhancement</h3>
              <p className="text-sm text-gray-600">Overview of your CPI data quality and AI enhancements</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg 
                className={`w-5 h-5 transform transition-transform ${expanded ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{qualityOverview.totalIndicators}</div>
            <div className="text-xs text-gray-500">Total Indicators</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${qualityFormatted.color}`}>
              {(qualityOverview.averageQualityScore * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-500">Avg Quality</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{qualityOverview.aiEnhancedIndicators}</div>
            <div className="text-xs text-gray-500">AI Enhanced</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{qualityOverview.highQualityIndicators}</div>
            <div className="text-xs text-gray-500">High Quality</div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Enhancement Progress */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">AI Enhancement Progress</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Enhanced Indicators</span>
                  <span className="text-sm font-medium">{enhancementPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${enhancementPercentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {qualityOverview.aiEnhancedIndicators} of {qualityOverview.totalIndicators} indicators enhanced
                </div>
              </div>
            </div>

            {/* Quality Distribution */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Quality Distribution</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">High Quality</span>
                  </div>
                  <span className="text-sm font-medium">{qualityOverview.highQualityIndicators}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Medium Quality</span>
                  </div>
                  <span className="text-sm font-medium">
                    {qualityOverview.totalIndicators - qualityOverview.highQualityIndicators - qualityOverview.lowQualityIndicators}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Low Quality</span>
                  </div>
                  <span className="text-sm font-medium">{qualityOverview.lowQualityIndicators}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={runAIEnhancement}
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Enhancing Data...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Run AI Enhancement
                </>
              )}
            </button>
            
            <button
              onClick={fetchDataQuality}
              disabled={isLoading}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:bg-gray-300 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Status
            </button>
          </div>

          {qualityOverview.lastAIUpdate && (
            <div className="mt-3 text-xs text-gray-500">
              Last AI update: {new Date(qualityOverview.lastAIUpdate).toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};