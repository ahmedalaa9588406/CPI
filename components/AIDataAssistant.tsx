/**
 * AI Data Assistant Component
 * Provides AI-powered data collection and quality improvements for CPI indicators
 */

"use client";

import React, { useState, useEffect } from 'react';
import { useAIData } from '@/lib/hooks/useAIData';

interface AIDataAssistantProps {
  indicator: string;
  currentValue?: number;
  onSuggestionAccept?: (value: number) => void;
  availableData?: Record<string, number>;
  showDataCollection?: boolean;
  location?: {
    lat: number;
    lng: number;
    city: string;
  };
}

export const AIDataAssistant: React.FC<AIDataAssistantProps> = ({
  indicator,
  currentValue,
  onSuggestionAccept,
  availableData,
  showDataCollection = true,
  location
}) => {
  const { 
    isLoading, 
    error, 
    predictMissingValue, 
    collectExternalData, 
    clearError 
  } = useAIData();

  const [prediction, setPrediction] = useState<{
    predictedValue: number;
    confidence: number;
    method: string;
    basedOn: string[];
  } | null>(null);
  const [externalData, setExternalData] = useState<{
    value: number;
    source: { name: string; confidence: number };
  }[]>([]);
  const [showPrediction, setShowPrediction] = useState(false);
  const [showExternalData, setShowExternalData] = useState(false);

  // Auto-predict when component mounts and no current value
  useEffect(() => {
    if (!currentValue && availableData && Object.keys(availableData).length > 0) {
      handlePredict();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indicator, currentValue, availableData]);

  const handlePredict = async () => {
    try {
      clearError();
      const result = await predictMissingValue(indicator, availableData);
      if (result.prediction) {
        setPrediction(result.prediction);
        setShowPrediction(true);
      }
    } catch (err) {
      console.error('Prediction failed:', err);
    }
  };

  const handleCollectExternal = async () => {
    if (!location) {
      alert('Location data required for external data collection');
      return;
    }

    try {
      clearError();
      const result = await collectExternalData(indicator, location);
      setExternalData(result.dataPoints || []);
      setShowExternalData(true);
    } catch (err) {
      console.error('External data collection failed:', err);
    }
  };

  const handleAcceptPrediction = () => {
    if (prediction && onSuggestionAccept) {
      onSuggestionAccept(prediction.predictedValue);
      setShowPrediction(false);
    }
  };

  const handleAcceptExternalData = (value: number) => {
    if (onSuggestionAccept) {
      onSuggestionAccept(value);
      setShowExternalData(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
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

          {error && (
            <div className="mt-2 text-sm text-red-600 bg-red-100 p-2 rounded">
              Error: {error}
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {!currentValue && (
              <button
                onClick={handlePredict}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Predicting...' : 'Predict Value'}
              </button>
            )}

            {showDataCollection && (
              <button
                onClick={handleCollectExternal}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isLoading ? 'Collecting...' : 'Collect External Data'}
              </button>
            )}
          </div>

          {/* Prediction Results */}
          {showPrediction && prediction && (
            <div className="mt-3 p-3 bg-white border rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                AI Prediction
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Predicted Value:</span>
                  <span className="text-sm font-medium">
                    {prediction.predictedValue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Confidence:</span>
                  <span className={`text-sm font-medium ${getConfidenceColor(prediction.confidence)}`}>
                    {getConfidenceText(prediction.confidence)} ({(prediction.confidence * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Based on: {prediction.basedOn.join(', ')}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleAcceptPrediction}
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

          {/* External Data Results */}
          {showExternalData && externalData.length > 0 && (
            <div className="mt-3 p-3 bg-white border rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                External Data Sources
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {externalData.map((dataPoint, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="text-sm font-medium">
                        {dataPoint.value.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {dataPoint.source.name} ({(dataPoint.source.confidence * 100).toFixed(0)}% reliable)
                      </div>
                    </div>
                    <button
                      onClick={() => handleAcceptExternalData(dataPoint.value)}
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