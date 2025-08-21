import React from 'react';
import { AIEnhancedCalculation, formatDataQuality } from '@/lib/hooks/useAIEnhancedCalculation';

interface AIEnhancementPanelProps {
  aiData: AIEnhancedCalculation;
  onGetAIEnhancement: () => void;
  onGetAIPrediction?: () => void;
  canPredict?: boolean;
}

export const AIEnhancementPanel: React.FC<AIEnhancementPanelProps> = ({
  aiData,
  onGetAIEnhancement,
  onGetAIPrediction,
  canPredict = false
}) => {
  const dataQuality = formatDataQuality(aiData.dataQuality.score);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
      <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
        AI-Powered Data Enhancement
      </h3>

      {/* AI Action Buttons */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={onGetAIEnhancement}
          disabled={aiData.isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
        >
          {aiData.isLoading ? (
            <>
              <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Collecting Data...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              Collect from Sources
            </>
          )}
        </button>
        
        {canPredict && onGetAIPrediction && (
          <button
            onClick={onGetAIPrediction}
            disabled={aiData.isLoading}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:bg-purple-300 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Predict
          </button>
        )}
      </div>

      {/* Error Display */}
      {aiData.error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {aiData.error}
        </div>
      )}

      {/* AI Enhanced Values */}
      {aiData.aiEnhancedValue !== null && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Enhanced Value */}
            <div className="bg-white p-3 rounded border">
              <h4 className="font-semibold text-gray-700 text-sm">AI-Enhanced Value</h4>
              <p className="text-2xl font-bold text-blue-600">
                {aiData.aiEnhancedValue.toFixed(2)}
              </p>
            </div>

            {/* Data Quality Score */}
            <div className="bg-white p-3 rounded border">
              <h4 className="font-semibold text-gray-700 text-sm">Data Quality</h4>
              <p className={`text-lg font-bold ${dataQuality.color}`}>
                {dataQuality.label} ({(aiData.dataQuality.score * 100).toFixed(0)}%)
              </p>
              <p className="text-xs text-gray-500">{dataQuality.description}</p>
            </div>
          </div>

          {/* Confidence and AI Enhancement Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded border">
              <h4 className="font-semibold text-gray-700 text-sm">Confidence Level</h4>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${aiData.dataQuality.confidence * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{(aiData.dataQuality.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded border">
              <h4 className="font-semibold text-gray-700 text-sm">Enhancement Status</h4>
              <div className="flex items-center">
                {aiData.dataQuality.aiEnhanced ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    AI Enhanced
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Original Data
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* AI Suggestions */}
          {aiData.suggestions.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h4 className="font-semibold text-yellow-800 text-sm mb-2">AI Insights & Suggestions</h4>
              <ul className="space-y-1">
                {aiData.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-yellow-700 flex items-start">
                    <svg className="w-3 h-3 mr-2 mt-0.5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Help Text when no AI data */}
      {!aiData.aiEnhancedValue && !aiData.isLoading && !aiData.error && (
        <div className="text-gray-600 text-sm">
          <p className="mb-2">
            <strong>AI Data Collection:</strong> Automatically gather data from multiple sources including satellites, APIs, and sensors.
          </p>
          <p>
            <strong>AI Prediction:</strong> Use machine learning to estimate missing values based on related indicators.
          </p>
        </div>
      )}
    </div>
  );
};