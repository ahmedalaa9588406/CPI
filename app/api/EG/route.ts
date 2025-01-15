import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { city_product_per_capita, old_age_dependency_ratio, mean_household_income, economic_strength } = body;

    const result = await prisma.economicStrength.create({
      data: {
        city_product_per_capita: Number(city_product_per_capita),
        old_age_dependency_ratio: Number(old_age_dependency_ratio),
        mean_household_income: Number(mean_household_income),
        economic_strength: Number(economic_strength),
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to store data' }, { status: 500 });
  }
}
