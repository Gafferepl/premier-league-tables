// Gaffer's Reply Bank - Pre-canned responses for common scenarios
// Reduces API calls and maintains authentic Gaffer personality

export interface GafferReply {
  reply: string;
  useAPI: boolean;
  category?: string;
}

export const GAFFER_REPLIES = {
  // Abuse/Insults handling - No API calls needed
  abuse: [
    "Pftt! Is that all you have, Son?",
    "At least engage the squidy stuff between your lugs before you open your Pie Hole!",
    "Listen here, sunshine. I've had more constructive conversations with the tea lady.",
    "Oi! Save the attitude for the dressing room. This ain't Saturday night at the pub.",
    "Blimey, someone's got their knickers in a twist. Take a number, pal.",
    "I've seen better banter from a traffic cone. Try again when you've had your Weetabix.",
    "Son, I've managed prima donnas with more charm than you. And that's saying something.",
    "Right then. Either ask a proper question or go kick a ball against a wall. Your choice."
  ],
  
  // Help/Guidance pointing - Direct users to guides first
  help: [
    "Listen, son. We've got proper guides for that. Click the 'Guides' button in the nav - it's the purple one with the book icon. Can't miss it, unless you're as blind as a linesman.",
    "Hold your horses. Before you ask me everything, check out the guides first. Top of the page, purple button. Go on, off you pop.",
    "Smart thinking! We've got comprehensive guides that'll explain everything better than I can over chat. Look for the 'Guides' button - it's got a book icon, can't miss it.",
    "Good question! But first, have a look at our guides. They cover most things. Click 'Guides' in the navigation - purple button, book icon. Come back if you're still stuck!"
  ],
  
  // Common FPL questions - Quick replies + API option
  captain: [
    "Captain choice, eh? Always a tricky one. Look at fixtures, form, and bonus points. But don't overthink it - sometimes the obvious choice is the right choice.",
    "Captaincy... the million-dollar question. Check who's playing at home against a weak defense. And remember - points are points, whether they're pretty or ugly."
  ],
  
  transfers: [
    "Transfers! The joy and pain of FPL. Look ahead at fixtures, don't panic buy after one bad week, and always keep an eye on those price changes. Patience, son, patience.",
    "Wildcard or chip? That's the question. My advice: save them for double gameweeks or when your team's looking more sorry than a relegated side."
  ],
  
  // Greetings - No API needed
  greeting: [
    "Alright, son? What's on your mind then?",
    "Ey up! What can I do for you today?",
    "Come on then, let's hear it. What's the emergency?"
  ],
  
  // Generic fallbacks - Use these before API calls
  generic: [
    "Right then. Let's have a proper think about this...",
    "Hmm. Interesting one, that. Let me give you the Gaffer's take on it...",
    "Blimey. That's a proper head-scratcher. Here's what I reckon..."
  ],
  
  // When confused/unclear - No API needed
  confused: [
    "Sorry, son. You're gonna have to run that by me again. Speak English, not whatever that was.",
    "Right. I've heard some things in my time, but that takes the biscuit. Try again, but slower this time.",
    "Hold on. Are you speaking FPL or did you just fall asleep on your keyboard? Clarify, please."
  ],
  
  // When happy/pleased - No API needed
  pleased: [
    "Now you're talking! Proper FPL thinking there, son.",
    "See? That's what I like to hear. Smart question.",
    "Good stuff! You're thinking like a proper FPL manager there."
  ],
  
  // Price/Value questions - Quick advice + API
  price: [
    "Price changes, eh? Keep an eye on those rises and falls. But don't panic - a player's value doesn't affect their points. Focus on performance, not price tags.",
    "Team value... looks good on paper but doesn't win you points. Better to have solid performers than expensive benchwarmers."
  ],
  
  // Fixture questions - Quick advice + API
  fixtures: [
    "Fixtures are key, son. Look for teams playing at home against the bottom half. Double gameweeks are gold dust if you play your cards right.",
    "Always check the run of fixtures. A star player against tough defenses might be worth benching for a midfielder against the relegation candidates."
  ]
};

// Function to detect message type and get appropriate response
export const getGafferReply = (userMessage: string): GafferReply => {
  const message = userMessage.toLowerCase().trim();
  
  // Detect abuse/insults - NEVER use API for these
  const abuseWords = ['idiot', 'stupid', 'crap', 'useless', 'shit', 'fuck', 'wanker', 'dickhead', 'moron', 'twat', 'bellend'];
  if (abuseWords.some(word => message.includes(word))) {
    return {
      reply: GAFFER_REPLIES.abuse[Math.floor(Math.random() * GAFFER_REPLIES.abuse.length)],
      useAPI: false,
      category: 'abuse'
    };
  }
  
  // Detect help requests - Point to guides first
  const helpWords = ['help', 'how do i', 'how to', 'guide', 'tutorial', 'explain', 'confused', 'lost'];
  if (helpWords.some(word => message.includes(word))) {
    return {
      reply: GAFFER_REPLIES.help[Math.floor(Math.random() * GAFFER_REPLIES.help.length)],
      useAPI: false,
      category: 'help'
    };
  }
  
  // Detect captain questions
  if (message.includes('captain') || message.includes('skipper')) {
    return {
      reply: GAFFER_REPLIES.captain[Math.floor(Math.random() * GAFFER_REPLIES.captain.length)],
      useAPI: true,
      category: 'captain'
    };
  }
  
  // Detect transfer questions
  if (message.includes('transfer') || message.includes('wildcard') || message.includes('chip') || message.includes('bench')) {
    return {
      reply: GAFFER_REPLIES.transfers[Math.floor(Math.random() * GAFFER_REPLIES.transfers.length)],
      useAPI: true,
      category: 'transfers'
    };
  }
  
  // Detect price/value questions
  if (message.includes('price') || message.includes('value') || message.includes('cost')) {
    return {
      reply: GAFFER_REPLIES.price[Math.floor(Math.random() * GAFFER_REPLIES.price.length)],
      useAPI: true,
      category: 'price'
    };
  }
  
  // Detect fixture questions
  if (message.includes('fixture') || message.includes('gameweek') || message.includes('schedule')) {
    return {
      reply: GAFFER_REPLIES.fixtures[Math.floor(Math.random() * GAFFER_REPLIES.fixtures.length)],
      useAPI: true,
      category: 'fixtures'
    };
  }
  
  // Detect greetings - No API needed
  const greetingWords = ['hi', 'hello', 'hey', 'morning', 'afternoon', 'evening'];
  if (greetingWords.some(word => message.includes(word)) || message.length < 10) {
    return {
      reply: GAFFER_REPLIES.greeting[Math.floor(Math.random() * GAFFER_REPLIES.greeting.length)],
      useAPI: false,
      category: 'greeting'
    };
  }
  
  // Generic responses - Use API for detailed answers
  return {
    reply: GAFFER_REPLIES.generic[Math.floor(Math.random() * GAFFER_REPLIES.generic.length)],
    useAPI: true
  };
};

// Function to check if we should use a quick reply instead of API
export const shouldUseQuickReply = (userMessage: string): boolean => {
  const reply = getGafferReply(userMessage);
  return !reply.useAPI;
};

// Get quick reply for common scenarios
export const getQuickReply = (userMessage: string): string => {
  const reply = getGafferReply(userMessage);
  return reply.reply;
};

// Gaffer's thinking messages - Human-like delay indicators
export const GAFFER_THINKING_MESSAGES = [
  "Just going through me notes!",
  "I'm sure I wrote this on me pie wrapping paper!",
  "Hmm! Let me have a proper think...",
  "Right then, just scratching me head...",
  "One second! Just checking me little black book...",
  "Okie dokie, just a mo!",
  "Hold your horses, thinking cap on...",
  "Blimey, let me consult the tea leaves...",
  "Right, just having a look in me notebook...",
  "Give us a sec, me brain's warming up...",
  "Just checking me tactics board...",
  "Hmm, interesting one that...",
  "Right then, let me have a proper gander...",
  "Just dusting off me crystal ball...",
  "Hold on, me memory's not what it used to be...",
  "Right, just having a word with meself...",
  "Blimey, that's a proper head-scratcher...",
  "Just checking me notes from last night's match...",
  "Right, let me put me thinking flat cap on...",
  "Hmm, let me consult the back of the fag packet..."
];

// Get random thinking message
export const getThinkingMessage = (): string => {
  return GAFFER_THINKING_MESSAGES[Math.floor(Math.random() * GAFFER_THINKING_MESSAGES.length)];
};

// Calculate realistic typing delay based on message length and complexity
export const calculateTypingDelay = (message: string, isQuickReply: boolean = false): number => {
  const baseDelay = isQuickReply ? 800 : 1200; // Quick replies are faster
  const messageLength = message.length;
  
  // Add delay based on message complexity
  if (messageLength < 50) {
    return baseDelay + Math.random() * 500; // Short messages: 0.8-1.3s or 1.2-1.7s
  } else if (messageLength < 150) {
    return baseDelay + 800 + Math.random() * 700; // Medium messages: 1.6-2.5s or 2.0-2.9s
  } else {
    return baseDelay + 1500 + Math.random() * 1000; // Long messages: 2.3-3.3s or 2.7-3.7s
  }
};

// Analytics tracking for quick replies
export const trackQuickReplyUsage = (category: string, userMessage: string) => {
  // Store usage analytics in localStorage for reporting
  const analytics = JSON.parse(localStorage.getItem('gafferChatAnalytics') || '{}');
  
  if (!analytics.quickReplies) {
    analytics.quickReplies = {};
  }
  
  if (!analytics.quickReplies[category]) {
    analytics.quickReplies[category] = {
      count: 0,
      examples: []
    };
  }
  
  analytics.quickReplies[category].count++;
  
  // Store a few examples for review (max 5 per category)
  if (analytics.quickReplies[category].examples.length < 5) {
    analytics.quickReplies[category].examples.push({
      message: userMessage,
      timestamp: new Date().toISOString()
    });
  }
  
  localStorage.setItem('gafferChatAnalytics', JSON.stringify(analytics));
  
  // Log for development
  // console.log(`Gaffer Chat Quick Reply Used: ${category} - Total: ${analytics.quickReplies[category].count}`);
};


