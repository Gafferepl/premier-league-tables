import { NextResponse } from 'next/server';
import { HybridDataService } from '@/lib/data/HybridDataService';

const dataService = new HybridDataService();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('id');

    if (playerId) {
      const playerData = await dataService.getPlayerData(parseInt(playerId));
      return NextResponse.json(playerData);
    }

    const bootstrapData = await dataService.getBootstrapData();
    return NextResponse.json(bootstrapData.elements || []);
  } catch (error) {
    console.error('Error fetching player data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player data' },
      { status: 500 }
    );
  }
}
