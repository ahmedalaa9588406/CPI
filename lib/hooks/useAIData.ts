/**
 * React hook for AI-powered data collection and quality improvements
 */

import { useState, useCallback } from 'react';

interface PredictionResponse {
  prediction?: {
    predictedValue: number;
    confidence: number;
    method: string;
    basedOn: string[];
  };
  message: string;
  suggestion?: string;
}

interface DataPoint {
  indicator: string;
  value: number;
  timestamp: string;
  source: {
    type: string;
    name: string;
    confidence: number;
  };
  metadata?: Record<string, unknown>;
}

interface ValidationResponse {
  validation: {
    isValid: boolean;
    quality: number;
    issues: string[];
    recommendations: string[];
  };
  message: string;
}

interface HarmonizedResponse {
  harmonized: {
    harmonizedValue: number;
    confidence: number;
    sources: string[];
  };
  message: string;
}

interface ExternalDataResponse {
  dataPoints: DataPoint[];
  count: number;
  message: string;
}

interface LocationData {
  lat: number;
  lng: number;
  city: string;
}

export interface AIDataHookResult {
  // State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  predictMissingValue: (indicator: string, availableData?: Record<string, number>) => Promise<PredictionResponse>;
  validateDataQuality: (dataPoints: DataPoint[]) => Promise<ValidationResponse>;
  harmonizeData: (dataPoints: DataPoint[]) => Promise<HarmonizedResponse>;
  collectExternalData: (indicator: string, location: LocationData) => Promise<ExternalDataResponse>;
  
  // Clear functions
  clearError: () => void;
}

export function useAIData(): AIDataHookResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = useCallback(async (action: string, payload: Record<string, unknown>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          ...payload
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const predictMissingValue = useCallback(async (
    indicator: string, 
    availableData?: Record<string, number>
  ): Promise<PredictionResponse> => {
    return makeRequest('predict_missing', {
      indicator,
      data: availableData
    });
  }, [makeRequest]);

  const validateDataQuality = useCallback(async (dataPoints: DataPoint[]): Promise<ValidationResponse> => {
    return makeRequest('validate_quality', {
      data: dataPoints
    });
  }, [makeRequest]);

  const harmonizeData = useCallback(async (dataPoints: DataPoint[]): Promise<HarmonizedResponse> => {
    return makeRequest('harmonize_data', {
      data: dataPoints
    });
  }, [makeRequest]);

  const collectExternalData = useCallback(async (
    indicator: string, 
    location: LocationData
  ): Promise<ExternalDataResponse> => {
    return makeRequest('collect_external', {
      indicator,
      data: location
    });
  }, [makeRequest]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    predictMissingValue,
    validateDataQuality,
    harmonizeData,
    collectExternalData,
    clearError
  };
}