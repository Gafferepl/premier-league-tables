// API Route: /api/league/lottery
// Conducts the Gaffer's League lottery selection

import { NextRequest, NextResponse } from 'next/server';
import { leagueLotteryService } from '@/services/leagueLotteryService';
// import { leagueEmailService } from '@/services/leagueEmailService';

export async function POST(request: NextRequest) {
  try {
    // Verify authorization (add your auth logic here)
    const authHeader = request.headers.get('authorization');
    const apiKey = process.env.LEAGUE_API_KEY;
    
    if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tier, sendEmails = true } = body;

    // console.log('🎲 Starting lottery process...');

    let results;

    if (tier) {
      // Conduct lottery for specific tier
      const result = await leagueLotteryService.conductLottery(tier, 50);
      results = [result];
    } else {
      // Conduct lottery for all tiers
      results = await leagueLotteryService.conductAllLotteries();
    }

    // Send selection emails if requested
    if (sendEmails) {
      // console.log('📧 Sending selection emails...');
      // for (const result of results) {
      //   await leagueEmailService.sendAllSelectionEmails(result.tier);
      // }
    }

    return NextResponse.json({
      success: true,
      message: 'Lottery completed successfully',
      results: results.map(r => ({
        tier: r.tier,
        total_applicants: r.total_applicants,
        selected_count: r.selected.length,
        waitlist_count: r.waitlist.length,
        selection_date: r.selection_date
      }))
    });

  } catch (error) {
    // console.error('❌ Lottery error:', error);
    return NextResponse.json(
      { 
        error: 'Lottery failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Get lottery stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tier = searchParams.get('tier') as any;

    const stats = await leagueLotteryService.getStats(tier);

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    // console.error('❌ Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}


