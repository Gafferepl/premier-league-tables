import { NextResponse } from 'next/server';
import { HybridDataService } from '@/lib/data/HybridDataService';

const dataService = new HybridDataService();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameweek = searchParams.get('gw');

    if (!gameweek) {
      return NextResponse.json(
        { error: 'Gameweek parameter required' },
        { status: 400 }
      );
    }

    const gameweekData = await dataService.getGameweekData(parseInt(gameweek));
    return NextResponse.json(gameweekData);
  } catch (error) {
    console.error('Error fetching gameweek data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gameweek data' },
      { status: 500 }
    );
  }
}
