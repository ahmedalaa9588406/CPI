import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { aiDataService } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { missingIndicators, availableData } = await req.json();

    if (!missingIndicators || !Array.isArray(missingIndicators) || missingIndicators.length === 0) {
      return NextResponse.json({ error: "Missing indicators array is required" }, { status: 400 });
    }

    if (!availableData || typeof availableData !== 'object') {
      return NextResponse.json({ error: "Available data object is required" }, { status: 400 });
    }

    const predictions = await aiDataService.fillMissingData(missingIndicators, availableData);

    return NextResponse.json({
      predictions,
      summary: {
        total: missingIndicators.length,
        predicted: Object.values(predictions).filter(p => p !== null).length,
        failed: Object.values(predictions).filter(p => p === null).length
      }
    });
  } catch (error) {
    console.error('[AI_MISSING_DATA_PREDICTION]', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const predictionModels = aiDataService.getPredictionModels();

    return NextResponse.json({
      models: predictionModels,
      totalModels: predictionModels.length
    });
  } catch (error) {
    console.error('[AI_PREDICTION_MODELS]', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}