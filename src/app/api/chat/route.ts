import { NextRequest, NextResponse } from 'next/server';
import { apiRotator } from '@/utils/apiRotator';
import { getGafferPrompt, categorizeQuestion } from '@/utils/gafferPrompts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userEmail, userTier, userName } = body;

    // Validate input
    if (!message || !userEmail || !userTier) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate user tier
    if (!['free', 'firstTeam', 'seasonPass'].includes(userTier)) {
      return NextResponse.json(
        { error: 'Invalid user tier' },
        { status: 400 }
      );
    }

    // Check if user can chat
    const canChat = apiRotator.canUserChat(userEmail, userTier);
    if (!canChat.allowed) {
      return NextResponse.json(
        { 
          error: canChat.message,
          remaining: canChat.remaining,
          canChat: false
        },
        { status: 403 }
      );
    }

    // Categorize question and generate prompt
    const questionType = categorizeQuestion(message);
    const prompt = getGafferPrompt(message, questionType);

    // Make API request
    const result = await apiRotator.makeRequest(prompt, userEmail, userTier);

    if (result.success) {
      return NextResponse.json({
        response: result.response,
        api: result.api,
        remaining: canChat.remaining - 1,
        questionType
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to get response' },
        { status: 500 }
      );
    }
  } catch (error) {
    // console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userEmail = searchParams.get('email');
    const userTier = searchParams.get('tier');

    if (!userEmail || !userTier) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Check user's remaining questions
    const canChat = apiRotator.canUserChat(
      userEmail,
      userTier as 'free' | 'firstTeam' | 'seasonPass'
    );

    // Get usage stats
    const stats = apiRotator.getUsageStats();

    return NextResponse.json({
      canChat: canChat.allowed,
      remaining: canChat.remaining,
      message: canChat.message,
      stats
    });
  } catch (error) {
    // console.error('Chat status API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


