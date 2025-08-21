import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { aiDataService, DataPoint } from '@/lib/ai-data-service';

interface LocationData {
  lat: number;
  lng: number;
  city: string;
}

interface DataPointInput {
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

function isDataPointInput(obj: unknown): obj is DataPointInput {
  return typeof obj === 'object' && obj !== null &&
    'indicator' in obj && 'value' in obj && 'timestamp' in obj && 'source' in obj;
}

function isLocationData(obj: unknown): obj is LocationData {
  return typeof obj === 'object' && obj !== null &&
    'lat' in obj && 'lng' in obj && 'city' in obj;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, indicator, data } = await req.json();

    switch (action) {
      case 'predict_missing':
        return await handlePredictMissing(indicator, userId, data);
      
      case 'validate_quality':
        return await handleValidateQuality(data);
      
      case 'harmonize_data':
        return await handleHarmonizeData(data);
      
      case 'collect_external':
        return await handleCollectExternal(indicator, data);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' }, 
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[AI_DATA_SERVICE_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

async function handlePredictMissing(
  indicator: string, 
  userId: string, 
  availableData?: Record<string, number>
) {
  if (!indicator) {
    return NextResponse.json(
      { error: 'Indicator is required' }, 
      { status: 400 }
    );
  }

  const prediction = await aiDataService.predictMissingValue(
    indicator, 
    userId, 
    availableData
  );

  if (!prediction) {
    return NextResponse.json({
      message: 'Unable to predict value with available data',
      suggestion: 'Please provide more indicator values to enable prediction'
    });
  }

  return NextResponse.json({
    prediction,
    message: `Predicted ${indicator} with ${(prediction.confidence * 100).toFixed(1)}% confidence`
  });
}

async function handleValidateQuality(dataPoints: unknown[]) {
  if (!Array.isArray(dataPoints) || dataPoints.length === 0) {
    return NextResponse.json(
      { error: 'Data points array is required' }, 
      { status: 400 }
    );
  }

  // Convert to proper DataPoint format with validation
  const formattedDataPoints: DataPoint[] = dataPoints
    .filter(isDataPointInput)
    .map(dp => ({
      indicator: dp.indicator,
      value: dp.value,
      timestamp: new Date(dp.timestamp),
      source: {
        type: dp.source.type as 'sensor' | 'satellite' | 'social_media' | 'administrative' | 'api',
        name: dp.source.name,
        confidence: dp.source.confidence
      },
      metadata: dp.metadata
    }));

  if (formattedDataPoints.length === 0) {
    return NextResponse.json(
      { error: 'No valid data points provided' }, 
      { status: 400 }
    );
  }

  const validation = aiDataService.validateDataQuality(formattedDataPoints);

  return NextResponse.json({
    validation,
    message: `Data quality: ${(validation.quality * 100).toFixed(1)}%`
  });
}

async function handleHarmonizeData(dataPoints: unknown[]) {
  if (!Array.isArray(dataPoints) || dataPoints.length === 0) {
    return NextResponse.json(
      { error: 'Data points array is required' }, 
      { status: 400 }
    );
  }

  // Convert to proper DataPoint format with validation
  const formattedDataPoints: DataPoint[] = dataPoints
    .filter(isDataPointInput)
    .map(dp => ({
      indicator: dp.indicator,
      value: dp.value,
      timestamp: new Date(dp.timestamp),
      source: {
        type: dp.source.type as 'sensor' | 'satellite' | 'social_media' | 'administrative' | 'api',
        name: dp.source.name,
        confidence: dp.source.confidence
      },
      metadata: dp.metadata
    }));

  if (formattedDataPoints.length === 0) {
    return NextResponse.json(
      { error: 'No valid data points provided' }, 
      { status: 400 }
    );
  }

  const harmonized = aiDataService.harmonizeMultiSourceData(formattedDataPoints);

  return NextResponse.json({
    harmonized,
    message: `Harmonized data from ${harmonized.sources.length} sources`
  });
}

async function handleCollectExternal(indicator: string, locationData: unknown) {
  if (!indicator || !isLocationData(locationData)) {
    return NextResponse.json(
      { error: 'Indicator and valid location data are required' }, 
      { status: 400 }
    );
  }

  const dataPoints = await aiDataService.collectExternalData(indicator, locationData);

  return NextResponse.json({
    dataPoints,
    count: dataPoints.length,
    message: `Collected ${dataPoints.length} data points for ${indicator}`
  });
}