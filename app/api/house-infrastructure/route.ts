import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { improved_shelter } = body;

    const result = await prisma.houseInfrastructure.create({
      data: {
        improved_shelter,
        improved_water: 0, // Default values for required fields
        improved_sanitation: 0,
        sufficient_living: 0,
        population: 0,
        electricity: 0,
        house_Infrastructure: 0, // Add the required property
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to store data' }, { status: 500 });
  }
} 