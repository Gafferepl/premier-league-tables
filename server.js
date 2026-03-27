
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import Stripe from 'stripe';

dotenv.config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

// Price IDs for different tiers (you'll need to create these in Stripe Dashboard)
const PRICE_IDS = {
  firstTeam: 'price_1Oxxxxxxx', // Replace with actual First Team price ID
  seasonPass: 'price_1Oxxxxxxx', // Replace with actual Season Pass price ID
};

const app = express();
const port = 3000;

// Secure CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? 
    process.env.ALLOWED_ORIGINS.split(',') : 
    ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
// HTTPS enforcement in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

// Enhanced security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://www.googletagmanager.com",
        "https://cdn.tailwindcss.com",
        "https://cdnjs.cloudflare.com",
        "https://aistudiocdn.com",
        "https://esm.run",
        "https://esm.sh"
      ],
      scriptSrcElem: [
        "'self'",
        "https://www.googletagmanager.com",
        "https://cdn.tailwindcss.com",
        "https://cdnjs.cloudflare.com"
      ],
      styleSrc: [
        "'self'",
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com",
        "https://cdn.tailwindcss.com"
      ],
      styleSrcElem: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com"
      ],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: [
        "'self'",
        "https://generativelanguage.googleapis.com",
        "https://fantasy.premierleague.com",
        "https://api.premierleague.com",
        process.env.NEXT_PUBLIC_SUPABASE_URL
      ].filter(Boolean),
      frameSrc: ["'self'", "https://js.stripe.com"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Additional security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

// In-memory cache
let cachedData = null;
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

const fetchFromGemini = async () => {
  if (!process.env.API_KEY) {
    console.warn("Server: No API_KEY found.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = "gemini-2.5-flash";
    
    // STRICTLY USE TODAY'S DATE
    const today = new Date();
    const dateString = today.toLocaleDateString("en-US", { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    const prompt = `
      You are a specialized Premier League Football Data API.
      
      **CONTEXT:**
      The current real-world date is **${dateString}**.
      
      **TASK:**
      Use the 'googleSearch' tool to find the **LATEST, LIVE Premier League data active as of TODAY (${dateString})**.
      Do not assume a specific season (like 2024/25 or 2025/26) based on training data. 
      Use the provided date to determine the current active season and Gameweek.
      
      **REQUIRED JSON OUTPUT:**
      {
         "currentGameweek": number,
         "weeklyTip": "string",
         "table": [ 
            { "team": "String", "played": number, "won": number, "drawn": number, "lost": number, "gd": number, "points": number, "form": ["W","D","L","W","W"] } 
         ],
         "fixtures": [
            { "homeTeam": "String", "awayTeam": "String", "time": "String", "date": "String", "status": "upcoming"|"live"|"finished" }
         ],
         "scorers": [
            { "name": "String", "team": "String", "goals": number, "assists": number, "penalties": number, "shirtNumber": number, "boots": "String", "transferSentiment": "up"|"down"|"stable" }
         ],
         "news": [
            { "title": "String", "summary": "String", "source": "String", "time": "String", "quote": "String", "isAdvanced": boolean }
         ],
         "matchStats": [
            { "homeTeam": "String", "awayTeam": "String", "score": "String", "date": "String", "homeScorers": ["Player Min'"], "awayScorers": ["Player Min'"], "possession": { "home": number, "away": number }, "shots": { "home": number, "away": number }, "shotsOnTarget": { "home": number, "away": number } }
         ],
         "sackRace": [
            { "manager": "String", "team": "String", "temperature": number, "gafferVerdict": "String", "nextManager": "String", "odds": "String" }
         ]
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    if (response.text) {
      // Robust JSON Extraction
      let jsonString = response.text.trim();
      const startIndex = jsonString.indexOf('{');
      const endIndex = jsonString.lastIndexOf('}');
      
      if (startIndex !== -1 && endIndex !== -1) {
        jsonString = jsonString.substring(startIndex, endIndex + 1);
        const data = JSON.parse(jsonString);
        data.lastUpdated = Date.now();
        return data;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

// Stripe checkout endpoint
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const { email, name, tier } = req.body;

    if (!email || !name || !tier || !['firstTeam', 'seasonPass'].includes(tier)) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const priceId = PRICE_IDS[tier];

    if (!priceId) {
      return res.status(400).json({ error: 'Invalid tier selected' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      billing_address_collection: 'required',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: tier === 'seasonPass' ? 'payment' : 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5173'}/newsletter?cancelled=true`,
      metadata: {
        customer_email: email,
        customer_name: name,
        tier: tier,
      },
      allow_promotion_codes: true,
      automatic_tax: {
        enabled: true,
      },
      customer_creation: 'always',
    });

    res.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Stripe checkout session creation failed:', error);
    
    if (error.type === 'StripeCardError') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Discord signup endpoint
app.post('/api/discord/signup', async (req, res) => {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { email, source, notification_type } = req.body;

    // Validate input
    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        error: 'Valid email is required' 
      });
    }

    // Check if email already exists for Discord notifications
    const { data: existingEmail, error: checkError } = await supabase
      .from('discord_notifications')
      .select('email')
      .eq('email', email)
      .eq('notification_type', 'discord_launch')
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // Real error occurred
      console.error('Error checking existing email:', checkError);
      return res.status(500).json({ 
        error: 'Database error' 
      });
    }

    // If email already exists, return success but don't duplicate
    if (existingEmail) {
      return res.json({
        success: true,
        message: 'Email already registered for Discord notifications',
        duplicate: true
      });
    }

    // Insert new email for Discord notifications
    const { data, error } = await supabase
      .from('discord_notifications')
      .insert({
        email: email,
        source: source || 'support_page',
        notification_type: notification_type || 'discord_launch',
        created_at: new Date().toISOString(),
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving email to Supabase:', error);
      return res.status(500).json({ 
        error: 'Failed to save email' 
      });
    }

    res.json({
      success: true,
      message: 'Email successfully registered for Discord notifications',
      data: data
    });

  } catch (error) {
    console.error('Discord signup API error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

app.get('/api/data', async (req, res) => {
  const now = Date.now();

  // Return cached data if fresh
  if (cachedData && (now - lastFetchTime < CACHE_DURATION)) {
    console.log("Serving cached data");
    return res.json(cachedData);
  }

  console.log("Cache expired or empty. Fetching from Gemini...");
  const newData = await fetchFromGemini();

  if (newData) {
    cachedData = newData;
    lastFetchTime = now;
    return res.json(cachedData);
  } else if (cachedData) {
    console.log("Fetch failed, serving stale cache");
    return res.json(cachedData);
  } else {
    // If no cache and fetch failed, return 500 so client can use its fallback
    return res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(port, () => {
  console.log(`Gaffer Server running on port ${port}`);
});
