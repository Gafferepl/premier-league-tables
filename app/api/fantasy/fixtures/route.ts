import { NextResponse } from 'next/server';
import { HybridDataService } from '@/lib/data/HybridDataService';

const dataService = new HybridDataService();

export async function GET() {
  try {
    const fixtures = await dataService.getFixtures();
    return NextResponse.json(fixtures);
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fixtures' },
      { status: 500 }
    );
  }
}
