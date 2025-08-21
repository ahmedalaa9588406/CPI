import { useState, useCallback } from 'react';
import { EnhancedCPIData } from '@/lib/ai';

export interface AIEnhancedCalculation {
  originalValue: number | null;
  aiEnhancedValue: number | null;
  dataQuality: {
    score: number;
    aiEnhanced: boolean;
    confidence: number;
  };
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for integrating AI-powered data enhancement with existing calculation pages
 */
export function useAIEnhancedCalculation(indicatorName: string) {
  const [aiData, setAiData] = useState<AIEnhancedCalculation>({
    originalValue: null,
    aiEnhancedValue: null,
    dataQuality: { score: 0, aiEnhanced: false, confidence: 0 },
    suggestions: [],
    isLoading: false,
    error: null
  });

  /**
   * Get AI-enhanced data for the current indicator
   */
  const getAIEnhancement = useCallback(async (
    cityLocation?: { lat: number; lon: number },
    existingData?: Record<string, number | null>
  ) => {
    setAiData(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/ai/data-collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          indicatorName,
          cityLocation,
          existingData
        })
      });

      if (!response.ok) {
        throw new Error(`AI enhancement failed: ${response.statusText}`);
      }

      const enhancedData: EnhancedCPIData = await response.json();
      
      setAiData({
        originalValue: enhancedData.originalValue,
        aiEnhancedValue: enhancedData.value,
        dataQuality: {
          score: enhancedData.dataQuality.overallScore,
          aiEnhanced: enhancedData.dataQuality.aiEnhanced,
          confidence: enhancedData.dataQuality.confidence
        },
        suggestions: generateSuggestions(enhancedData),
        isLoading: false,
        error: null
      });

    } catch (error) {
      setAiData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }, [indicatorName]);

  /**
   * Get AI prediction for missing data
   */
  const getAIPrediction = useCallback(async (availableData: Record<string, number | null>) => {
    setAiData(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/ai/missing-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missingIndicators: [indicatorName],
          availableData
        })
      });

      if (!response.ok) {
        throw new Error(`AI prediction failed: ${response.statusText}`);
      }

      const result = await response.json();
      const prediction = result.predictions[indicatorName];

      if (prediction) {
        setAiData({
          originalValue: null,
          aiEnhancedValue: prediction.value,
          dataQuality: {
            score: prediction.dataQuality.overallScore,
            aiEnhanced: prediction.dataQuality.aiEnhanced,
            confidence: prediction.dataQuality.confidence
          },
          suggestions: generateSuggestions(prediction),
          isLoading: false,
          error: null
        });
      } else {
        setAiData(prev => ({
          ...prev,
          isLoading: false,
          error: 'No AI prediction available for this indicator'
        }));
      }

    } catch (error) {
      setAiData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }, [indicatorName]);

  /**
   * Reset AI data
   */
  const resetAIData = useCallback(() => {
    setAiData({
      originalValue: null,
      aiEnhancedValue: null,
      dataQuality: { score: 0, aiEnhanced: false, confidence: 0 },
      suggestions: [],
      isLoading: false,
      error: null
    });
  }, []);

  return {
    aiData,
    getAIEnhancement,
    getAIPrediction,
    resetAIData
  };
}

/**
 * Generate helpful suggestions based on AI-enhanced data
 */
function generateSuggestions(enhancedData: EnhancedCPIData): string[] {
  const suggestions: string[] = [];

  // Data quality suggestions
  if (enhancedData.dataQuality.overallScore < 0.7) {
    suggestions.push('Consider collecting more data sources to improve accuracy');
  }

  if (enhancedData.isAIPredicted) {
    suggestions.push(`This value is AI-predicted using ${enhancedData.metadata.predictionMethod}`);
    
    if (enhancedData.metadata.proxyIndicators?.length) {
      suggestions.push(`Based on proxy indicators: ${enhancedData.metadata.proxyIndicators.join(', ')}`);
    }
  }

  if (enhancedData.metadata.outlierDetected) {
    suggestions.push('Unusual data values detected - please verify manually');
  }

  if (enhancedData.metadata.harmonizationApplied) {
    suggestions.push('Data has been harmonized from multiple sources');
  }

  if (enhancedData.dataQuality.confidence > 0.9) {
    suggestions.push('High confidence AI-enhanced data available');
  } else if (enhancedData.dataQuality.confidence < 0.6) {
    suggestions.push('Low confidence - consider manual verification');
  }

  return suggestions;
}

/**
 * Helper function to format AI data quality for display
 */
export function formatDataQuality(score: number): {
  label: string;
  color: string;
  description: string;
} {
  if (score >= 0.9) {
    return {
      label: 'Excellent',
      color: 'text-green-600',
      description: 'Very high quality data with multiple reliable sources'
    };
  } else if (score >= 0.8) {
    return {
      label: 'Good',
      color: 'text-green-500',
      description: 'Good quality data with reliable sources'
    };
  } else if (score >= 0.7) {
    return {
      label: 'Fair',
      color: 'text-yellow-600',
      description: 'Acceptable quality but may benefit from additional sources'
    };
  } else if (score >= 0.5) {
    return {
      label: 'Poor',
      color: 'text-orange-600',
      description: 'Limited data quality - consider additional verification'
    };
  } else {
    return {
      label: 'Very Poor',
      color: 'text-red-600',
      description: 'Low quality data - manual verification recommended'
    };
  }
}