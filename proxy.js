// Express Proxy Server to bypass CORS issues
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// FPL API Proxy endpoints
app.get('/api/fpl/bootstrap-static', async (req, res) => {
  try {
    console.log(' Fetching FPL bootstrap data...');
    const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(' FPL bootstrap error:', error);
    res.status(500).json({ error: 'Failed to fetch FPL bootstrap data' });
  }
});

app.get('/api/fpl/fixtures', async (req, res) => {
  try {
    console.log(' Fetching FPL fixtures...');
    const response = await fetch('https://fantasy.premierleague.com/api/fixtures/');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(' FPL fixtures error:', error);
    res.status(500).json({ error: 'Failed to fetch FPL fixtures' });
  }
});

app.get('/api/fpl/events', async (req, res) => {
  try {
    console.log(' Fetching FPL events...');
    const response = await fetch('https://fantasy.premierleague.com/api/events/');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(' FPL events error:', error);
    res.status(500).json({ error: 'Failed to fetch FPL events' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(' FPL Proxy Server running on http://localhost:' + PORT);
  console.log(' Available endpoints:');
  console.log('   GET /api/fpl/bootstrap-static');
  console.log('   GET /api/fpl/fixtures');
  console.log('   GET /api/fpl/events');
  console.log('   GET /api/health');
});
