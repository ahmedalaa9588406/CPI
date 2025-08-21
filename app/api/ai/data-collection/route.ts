import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { aiDataService } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { indicatorName, cityLocation, existingData } = await req.json();

    if (!indicatorName) {
      return NextResponse.json({ error: "Indicator name is required" }, { status: 400 });
    }

    const enhancedData = await aiDataService.getEnhancedIndicatorData(
      indicatorName,
      cityLocation,
      existingData
    );

    if (!enhancedData) {
      return NextResponse.json({ 
        error: "Unable to collect or predict data for this indicator" 
      }, { status: 404 });
    }

    return NextResponse.json(enhancedData);
  } catch (error) {
    console.error('[AI_DATA_COLLECTION]', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const indicators = searchParams.get('indicators')?.split(',') || [];
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (indicators.length === 0) {
      return NextResponse.json({ error: "At least one indicator is required" }, { status: 400 });
    }

    const cityLocation = lat && lon ? { lat: parseFloat(lat), lon: parseFloat(lon) } : undefined;
    
    const dataQualityAssessment = await aiDataService.assessDataQuality(indicators, cityLocation);

    return NextResponse.json(dataQualityAssessment);
  } catch (error) {
    console.error('[AI_DATA_QUALITY_ASSESSMENT]', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}