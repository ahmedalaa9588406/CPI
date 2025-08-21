import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { aiDataService } from '@/lib/ai';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dataSources = aiDataService.getDataSources();

    return NextResponse.json({
      sources: dataSources,
      totalSources: dataSources.length,
      activeSources: dataSources.filter(source => source.isActive).length,
      sourceTypes: [...new Set(dataSources.map(source => source.type))]
    });
  } catch (error) {
    console.error('[AI_DATA_SOURCES]', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}