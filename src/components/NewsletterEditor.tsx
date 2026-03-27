import React, { useState, useEffect } from 'react';
import { authService, User } from '../services/auth';

interface NewsletterSection {
  id: string;
  type: 'header' | 'leaderboard' | 'fixtures' | 'predictions' | 'stats' | 'premium' | 'footer';
  title: string;
  content: any;
  order: number;
  enabled: boolean;
  tier: 'firstTeam' | 'seasonPass' | 'both';
}

interface NewsletterTemplate {
  id: string;
  name: string;
  tier: 'firstTeam' | 'seasonPass';
  subject: string;
  previewText: string;
  sections: NewsletterSection[];
  lastGenerated: string;
}

const NewsletterEditor: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedTier, setSelectedTier] = useState<'firstTeam' | 'seasonPass'>('firstTeam');
  const [templates, setTemplates] = useState<NewsletterTemplate[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<NewsletterTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Load templates first
    loadTemplates();
    
    // Check for URL reset parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reset') === 'true') {
      // console.log('URL reset detected - forcing all states to false');
      setIsGenerating(false);
      setIsEditing(false);
      setCurrentTemplate(null);
      setSelectedTier('firstTeam');
      // Remove reset parameter from URL
      window.history.replaceState({}, '', window.location.pathname);
    }
    
    // Add global reset function for console access
    (window as any).emergencyReset = () => {
      // console.log('Console emergency reset triggered');
      setIsGenerating(false);
      setIsEditing(false);
      setCurrentTemplate(null);
      setSelectedTier('firstTeam');
      localStorage.removeItem('newsletterTemplates');
      alert('Console reset complete!');
    };
    
    // Then check auth
    const user = authService.getCurrentUser();
    if (user && user.email === 'admin@premierleaguehub.com') {
      setCurrentUser(user);
    } else {
      // Don't redirect immediately, show access denied message
      // console.log('Access denied - user not admin:', user?.email);
    }
  }, []);

  const loadTemplates = () => {
    // Load templates from localStorage or API
    const savedTemplates = localStorage.getItem('newsletterTemplates');
    if (savedTemplates) {
      try {
        const parsed = JSON.parse(savedTemplates);
        setTemplates(parsed);
        // console.log('Loaded templates from localStorage:', parsed);
      } catch (error) {
        // console.error('Error parsing templates:', error);
        const defaultTemplates = createDefaultTemplates();
        setTemplates(defaultTemplates);
        localStorage.setItem('newsletterTemplates', JSON.stringify(defaultTemplates));
      }
    } else {
      // Create default templates
      // console.log('Creating default templates...');
      const defaultTemplates = createDefaultTemplates();
      setTemplates(defaultTemplates);
      localStorage.setItem('newsletterTemplates', JSON.stringify(defaultTemplates));
      // console.log('Default templates created:', defaultTemplates);
    }
  };

  const createDefaultTemplates = (): NewsletterTemplate[] => {
    return [
      {
        id: 'first-team-default',
        name: 'First Team Weekly',
        tier: 'firstTeam',
        subject: "Re: Your Feedback - premierleaguetables.com - Weekly Roundup",
        previewText: 'Your weekly dose of Premier League insights and predictions',
        sections: [
          {
            id: 'header-1',
            type: 'header',
            title: 'Weekly Roundup',
            content: { title: 'Premier League Tables', subtitle: 'Weekly Roundup' },
            order: 0,
            enabled: true,
            tier: 'both'
          },
          {
            id: 'leaderboard-1',
            type: 'leaderboard',
            title: 'Top 10 Players',
            content: { maxPlayers: 10, showStats: true },
            order: 1,
            enabled: true,
            tier: 'both'
          },
          {
            id: 'fixtures-1',
            type: 'fixtures',
            title: 'Upcoming Fixtures',
            content: { maxFixtures: 5, showPredictions: true },
            order: 2,
            enabled: true,
            tier: 'both'
          },
          {
            id: 'stats-1',
            type: 'stats',
            title: 'Weekly Stats',
            content: { showTopScorers: true, showCleanSheets: true },
            order: 3,
            enabled: true,
            tier: 'both'
          },
          {
            id: 'footer-1',
            type: 'footer',
            title: 'Footer',
            content: { showSocial: true, showUnsubscribe: true },
            order: 4,
            enabled: true,
            tier: 'both'
          }
        ],
        lastGenerated: new Date().toISOString()
      },
      {
        id: 'season-pass-default',
        name: 'Season Pass Premium',
        tier: 'seasonPass',
        subject: '🌟 Paid Tier Exclusive - Premium Insights',
        previewText: 'Exclusive content and advanced analytics for Season Pass members',
        sections: [
          {
            id: 'header-2',
            type: 'header',
            title: 'Paid Tier Exclusive',
            content: { title: 'Season Pass', subtitle: 'Premium Insights' },
            order: 0,
            enabled: true,
            tier: 'both'
          },
          {
            id: 'leaderboard-2',
            type: 'leaderboard',
            title: 'Elite Leaderboard',
            content: { maxPlayers: 20, showStats: true, showAccuracy: true },
            order: 1,
            enabled: true,
            tier: 'both'
          },
          {
            id: 'premium-1',
            type: 'premium',
            title: 'Premium Analysis',
            content: { 
              showAdvancedStats: true, 
              showPredictions: true, 
              showInsights: true,
              exclusiveContent: true 
            },
            order: 2,
            enabled: true,
            tier: 'seasonPass'
          },
          {
            id: 'fixtures-2',
            type: 'fixtures',
            title: 'Featured Fixtures',
            content: { maxFixtures: 8, showPredictions: true, showOdds: true },
            order: 3,
            enabled: true,
            tier: 'both'
          },
          {
            id: 'stats-2',
            type: 'stats',
            title: 'Advanced Analytics',
            content: { 
              showTopScorers: true, 
              showCleanSheets: true, 
              showFormTrends: true,
              showHeadToHead: true 
            },
            order: 4,
            enabled: true,
            tier: 'seasonPass'
          },
          {
            id: 'footer-2',
            type: 'footer',
            title: 'Premium Footer',
            content: { showSocial: true, showUnsubscribe: true, showPremiumPerks: true },
            order: 5,
            enabled: true,
            tier: 'both'
          }
        ],
        lastGenerated: new Date().toISOString()
      }
    ];
  };

  const generateNewsletter = async (tier: 'firstTeam' | 'seasonPass') => {
    // console.log('=== GENERATION START ===');
    // console.log('Starting generation for tier:', tier);
    // console.log('Current isGenerating state:', isGenerating);
    
    // Safety check - don't start if already generating
    if (isGenerating) {
      // console.log('Already generating, aborting...');
      alert('Already generating! Please wait or use Emergency Reset.');
      return;
    }
    
    // Force set to generating
    setIsGenerating(true);
    // console.log('Set isGenerating to true');
    
    // Add timeout safety net
    const timeoutId = setTimeout(() => {
      // console.log('TIMEOUT - forcing isGenerating to false');
      setIsGenerating(false);
      alert('Generation timed out! Please try Emergency Reset.');
    }, 5000); // 5 second timeout
    
    try {
      // Simulate API call to generate content
      // console.log('Simulating API call...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ensure templates are loaded
      let templatesToUse = templates;
      // console.log('Current templates count:', templatesToUse.length);
      
      if (templatesToUse.length === 0) {
        // console.log('No templates found, creating defaults...');
        templatesToUse = createDefaultTemplates();
        setTemplates(templatesToUse);
        // console.log('Default templates created:', templatesToUse.length);
      }
      
      const template = templatesToUse.find(t => t.tier === tier);
      // console.log('Template found:', template ? 'YES' : 'NO');
      
      if (!template) {
        // console.error('Template not found for tier:', tier);
        // console.log('Available templates:', templatesToUse.map(t => ({ id: t.id, tier: t.tier })));
        alert(`Template not found for tier: ${tier}. Available: ${templatesToUse.map(t => t.tier).join(', ')}`);
        return;
      }
      
      // console.log('Using template:', template.name);
      
      // Generate fresh content for each section
      const updatedSections = template.sections.map(section => {
        const newContent = generateSectionContent(section.type, section.content, tier);
        // console.log('Generated content for section:', section.type, newContent);
        return {
          ...section,
          content: newContent
        };
      });
      
      const updatedTemplate = {
        ...template,
        sections: updatedSections,
        lastGenerated: new Date().toISOString()
      };
      
      // console.log('Generated template successfully');
      // console.log('Setting current template and isEditing to true');
      setCurrentTemplate(updatedTemplate);
      setIsEditing(true);
      
    } catch (error) {
      // console.error('Error generating newsletter:', error);
      alert('Failed to generate newsletter. Please try again.');
    } finally {
      // Clear timeout
      clearTimeout(timeoutId);
      // console.log('=== GENERATION FINISHED ===');
      // console.log('Setting isGenerating to false');
      setIsGenerating(false);
    }
  };

  const generateSectionContent = (type: string, baseContent: any, tier: string) => {
    // Simulate content generation based on type and tier
    switch (type) {
      case 'leaderboard':
        return {
          ...baseContent,
          players: generateMockLeaderboard(baseContent.maxPlayers || 10)
        };
      case 'fixtures':
        return {
          ...baseContent,
          fixtures: generateMockFixtures(baseContent.maxFixtures || 5)
        };
      case 'stats':
        return {
          ...baseContent,
          topScorers: generateMockTopScorers(),
          cleanSheets: generateMockCleanSheets()
        };
      case 'premium':
        return {
          ...baseContent,
          insights: generateMockInsights(tier),
          predictions: generateMockPremiumPredictions()
        };
      default:
        return baseContent;
    }
  };

  const generateMockLeaderboard = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      rank: i + 1,
      username: `Player${i + 1}`,
      points: Math.floor(Math.random() * 500) + 100,
      accuracy: Math.floor(Math.random() * 30) + 70,
      streak: Math.floor(Math.random() * 10)
    }));
  };

  const generateMockFixtures = (count: number) => {
    const teams = ['Man City', 'Liverpool', 'Arsenal', 'Chelsea', 'Man Utd', 'Tottenham'];
    return Array.from({ length: count }, (_, i) => ({
      homeTeam: teams[i % teams.length],
      awayTeam: teams[(i + 1) % teams.length],
      date: `Sat ${15 + i}:00`,
      prediction: { home: Math.floor(Math.random() * 3), away: Math.floor(Math.random() * 3) }
    }));
  };

  const generateMockTopScorers = () => [
    { name: 'Haaland', goals: 20, team: 'Man City' },
    { name: 'Salah', goals: 18, team: 'Liverpool' },
    { name: 'Saka', goals: 15, team: 'Arsenal' }
  ];

  const generateMockCleanSheets = () => [
    { name: 'Ederson', cleanSheets: 12, team: 'Man City' },
    { name: 'Alisson', cleanSheets: 10, team: 'Liverpool' },
    { name: 'Raya', cleanSheets: 9, team: 'Arsenal' }
  ];

  const generateMockInsights = (tier: string) => {
    const baseInsights = [
      'City showing title-winning form',
      'Arsenal defense solidifying',
      'Liverpool attack firing'
    ];
    
    if (tier === 'seasonPass') {
      return [
        ...baseInsights,
        '🔒 Exclusive: Tactical analysis of City\'s pressing system',
        '🔒 Premium: Key injury updates for weekend fixtures',
        '🔒 Insider: Transfer market movements affecting top 6'
      ];
    }
    
    return baseInsights;
  };

  const generateMockPremiumPredictions = () => [
    { fixture: 'Man City vs Liverpool', prediction: '2-1', confidence: 85 },
    { fixture: 'Arsenal vs Chelsea', prediction: '2-0', confidence: 78 },
    { fixture: 'Man Utd vs Tottenham', prediction: '1-1', confidence: 65 }
  ];

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!currentTemplate) return;

    const sections = [...currentTemplate.sections];
    const currentIndex = sections.findIndex(s => s.id === sectionId);
    
    if (direction === 'up' && currentIndex > 0) {
      [sections[currentIndex], sections[currentIndex - 1]] = [sections[currentIndex - 1], sections[currentIndex]];
    } else if (direction === 'down' && currentIndex < sections.length - 1) {
      [sections[currentIndex], sections[currentIndex + 1]] = [sections[currentIndex + 1], sections[currentIndex]];
    }

    const updatedTemplate = {
      ...currentTemplate,
      sections: sections.map((item, index) => ({ ...item, order: index }))
    };

    setCurrentTemplate(updatedTemplate);
  };

  const toggleSection = (sectionId: string) => {
    if (!currentTemplate) return;

    const updatedTemplate = {
      ...currentTemplate,
      sections: currentTemplate.sections.map(section =>
        section.id === sectionId ? { ...section, enabled: !section.enabled } : section
      )
    };

    setCurrentTemplate(updatedTemplate);
  };

  const addSection = (sectionType: 'header' | 'leaderboard' | 'fixtures' | 'predictions' | 'stats' | 'premium' | 'footer') => {
    if (!currentTemplate) return;

    const newSection: NewsletterSection = {
      id: `${sectionType}-${Date.now()}`,
      type: sectionType,
      title: sectionType.charAt(0).toUpperCase() + sectionType.slice(1),
      content: getDefaultContent(sectionType),
      order: currentTemplate.sections.length,
      enabled: true,
      tier: selectedTier
    };

    const updatedTemplate = {
      ...currentTemplate,
      sections: [...currentTemplate.sections, newSection]
    };

    setCurrentTemplate(updatedTemplate);
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'header':
        return { title: 'Newsletter Header', subtitle: 'Weekly Update' };
      case 'leaderboard':
        return { maxPlayers: 10, showStats: true };
      case 'fixtures':
        return { maxFixtures: 5, showPredictions: true };
      case 'predictions':
        return { showGafferPredictions: true, showUserPredictions: false };
      case 'stats':
        return { showTopScorers: true, showCleanSheets: true, showFormTrends: false };
      case 'premium':
        return { showPremiumPerks: true, showExclusiveContent: true };
      case 'footer':
        return { showSocial: true, showUnsubscribe: true, showPremiumPerks: false };
      default:
        return {};
    }
  };

  const removeSection = (sectionId: string) => {
    if (!currentTemplate) return;

    const updatedTemplate = {
      ...currentTemplate,
      sections: currentTemplate.sections.filter(s => s.id !== sectionId)
    };

    setCurrentTemplate(updatedTemplate);
  };

  const saveTemplate = () => {
    if (!currentTemplate) return;

    const updatedTemplates = templates.map(template =>
      template.id === currentTemplate.id ? currentTemplate : template
    );

    setTemplates(updatedTemplates);
    localStorage.setItem('newsletterTemplates', JSON.stringify(updatedTemplates));
  };

  const exportTemplate = () => {
    if (!currentTemplate) return;

    const dataStr = JSON.stringify(currentTemplate, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `newsletter-${currentTemplate.tier}-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const renderSectionEditor = (section: NewsletterSection) => {
    switch (section.type) {
      case 'header':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={section.content.title || ''}
                onChange={(e) => updateSectionContent(section.id, 'title', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <input
                type="text"
                value={section.content.subtitle || ''}
                onChange={(e) => updateSectionContent(section.id, 'subtitle', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        );
      
      case 'leaderboard':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Max Players</label>
              <input
                type="number"
                value={section.content.maxPlayers || 10}
                onChange={(e) => updateSectionContent(section.id, 'maxPlayers', parseInt(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={section.content.showStats || false}
                onChange={(e) => updateSectionContent(section.id, 'showStats', e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm font-medium">Show Stats</label>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Editor for {section.type} section</p>
          </div>
        );
    }
  };

  const updateSectionContent = (sectionId: string, key: string, value: any) => {
    if (!currentTemplate) return;

    const updatedTemplate = {
      ...currentTemplate,
      sections: currentTemplate.sections.map(section =>
        section.id === sectionId
          ? { ...section, content: { ...section.content, [key]: value } }
          : section
      )
    };

    setCurrentTemplate(updatedTemplate);
  };

  const renderPreview = () => {
    if (!currentTemplate) return null;

    const isMobile = previewMode === 'mobile';
    const containerClass = isMobile ? 'max-w-sm mx-auto' : 'max-w-4xl mx-auto';

    return (
      <div className={`${containerClass} bg-white rounded-lg shadow-lg overflow-hidden`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">
            {currentTemplate.sections.find(s => s.type === 'header')?.content?.title || 'Premier League Tables'}
          </h1>
          <p className="text-blue-100">
            {currentTemplate.sections.find(s => s.type === 'header')?.content?.subtitle || 'Weekly Newsletter'}
          </p>
        </div>

        {/* Sections */}
        <div className="p-6 space-y-6">
          {currentTemplate.sections
            .filter(section => section.enabled)
            .map(section => (
              <div key={section.id} className="border-b pb-6 last:border-b-0">
                <h3 className="text-lg font-bold mb-4">{section.title}</h3>
                
                {section.type === 'leaderboard' && section.content.players && (
                  <div className="space-y-2">
                    {section.content.players.slice(0, section.content.maxPlayers || 10).map((player: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">#{player.rank} {player.username}</span>
                        <span className="text-sm text-gray-600">{player.points} pts</span>
                      </div>
                    ))}
                  </div>
                )}

                {section.type === 'fixtures' && section.content.fixtures && (
                  <div className="space-y-2">
                    {section.content.fixtures.slice(0, section.content.maxFixtures || 5).map((fixture: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">{fixture.homeTeam} vs {fixture.awayTeam}</span>
                        <span className="text-xs text-gray-500">{fixture.date}</span>
                      </div>
                    ))}
                  </div>
                )}

                {section.type === 'premium' && (
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                    <div className="space-y-2">
                      {section.content.insights?.map((insight: string, idx: number) => (
                        <div key={idx} className="text-sm">
                          {insight.startsWith('🔒') ? (
                            <span className="text-purple-700 font-medium">{insight}</span>
                          ) : (
                            <span>{insight}</span>
                          )}
                        </div>
                      ))}
                    </div>
                    {selectedTier === 'seasonPass' && (
                      <div className="mt-4 pt-4 border-t border-purple-200">
                        <h4 className="font-bold text-purple-800 mb-2">Premium Predictions</h4>
                        <div className="space-y-1">
                          {section.content.predictions?.map((pred: any, idx: number) => (
                            <div key={idx} className="text-xs text-purple-700">
                              {pred.fixture}: {pred.prediction} ({pred.confidence}% confidence)
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {section.type === 'stats' && (
                  <div className="grid grid-cols-2 gap-4">
                    {section.content.showTopScorers && (
                      <div>
                        <h4 className="font-medium mb-2">Top Scorers</h4>
                        {section.content.topScorers?.map((scorer: any, idx: number) => (
                          <div key={idx} className="text-sm">{scorer.name}: {scorer.goals}</div>
                        ))}
                      </div>
                    )}
                    {section.content.showCleanSheets && (
                      <div>
                        <h4 className="font-medium mb-2">Clean Sheets</h4>
                        {section.content.cleanSheets?.map((keeper: any, idx: number) => (
                          <div key={idx} className="text-sm">{keeper.name}: {keeper.cleanSheets}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-4 text-center text-sm text-gray-600">
          <p>© 2024 Premier League Tables</p>
          <p className="mt-1">
            <a href="#" className="text-blue-600 hover:underline">Unsubscribe</a> | 
            <a href="#" className="text-blue-600 hover:underline ml-2">Privacy</a>
          </p>
        </div>
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <p className="text-sm text-gray-500 mb-4">Current user: {authService.getCurrentUser()?.email || 'Not logged in'}</p>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Back to Home
            </button>
            <button 
              onClick={() => {
                // Bypass for testing - create mock admin user
                const mockUser: User = {
                  id: 'admin-test',
                  email: 'admin@premierleaguehub.com',
                  username: 'admin',
                  team: 'Test Team',
                  joinedDate: new Date(),
                  totalPredictions: 0,
                  accuracy: 0,
                  currentStreak: 0,
                  bestStreak: 0,
                  weeklyPoints: 0,
                  monthlyPoints: 0,
                  allTimePoints: 0
                };
                setCurrentUser(mockUser);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Bypass for Testing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Newsletter Editor</h1>
            <div className="flex gap-2">
              {/* Emergency reset button - always visible */}
              <button
                onClick={() => {
                  // console.log('EMERGENCY RESET - forcing all states to false');
                  setIsGenerating(false);
                  setIsEditing(false);
                  setCurrentTemplate(null);
                  setSelectedTier('firstTeam');
                  
                  // Force re-render by updating templates
                  const currentTemplates = [...templates];
                  setTemplates([]);
                  setTimeout(() => {
                    setTemplates(currentTemplates);
                    // console.log('Emergency reset complete');
                    alert('Emergency reset complete! The button should now work.');
                  }, 100);
                }}
                className="bg-red-800 text-white px-4 py-2 rounded text-sm hover:bg-red-900"
              >
                🚨 EMERGENCY RESET
              </button>
              
              {/* Ultimate reset - page reload */}
              <button
                onClick={() => {
                  // console.log('ULTIMATE RESET - reloading page');
                  localStorage.removeItem('newsletterTemplates');
                  window.location.href = '/newsletter-editor?reset=true';
                }}
                className="bg-orange-800 text-white px-4 py-2 rounded text-sm hover:bg-orange-900"
              >
                🔄 PAGE RELOAD
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Back to Site
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tier Selection */}
        {!isEditing && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Select Newsletter Tier</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedTier('firstTeam')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedTier === 'firstTeam'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-bold text-lg mb-2">First Team</h3>
                <p className="text-sm text-gray-600">Standard newsletter for all subscribers</p>
              </button>
              <button
                onClick={() => setSelectedTier('seasonPass')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedTier === 'seasonPass'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-bold text-lg mb-2">Season Pass</h3>
                <p className="text-sm text-gray-600">Premium newsletter with exclusive content</p>
              </button>
            </div>
            <div className="mt-6 space-y-2">
              <button
                onClick={() => generateNewsletter(selectedTier)}
                disabled={isGenerating}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {isGenerating ? `Generating... (${new Date().getSeconds()})` : `Generate ${selectedTier === 'firstTeam' ? 'First Team' : 'Season Pass'} Newsletter`}
              </button>
              
              {/* Debug button */}
              <button
                onClick={() => {
                  // console.log('Debug info:', {
                    isGenerating,
                    selectedTier,
                    templatesCount: templates.length,
                    currentTemplate: currentTemplate ? 'exists' : 'null',
                    isEditing
                  });
                  alert(`Debug: isGenerating=${isGenerating}, templates=${templates.length}`);
                }}
                className="w-full bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
              >
                Debug State
              </button>
              
              {/* Force reset button */}
              <button
                onClick={() => {
                  // console.log('Force resetting all states...');
                  setIsGenerating(false);
                  setIsEditing(false);
                  setCurrentTemplate(null);
                  setSelectedTier('firstTeam');
                  alert('States reset! Try generating again.');
                }}
                className="w-full bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-700"
              >
                Force Reset States
              </button>
              
              {/* Simple test button */}
              <button
                onClick={() => {
                  // console.log('Simple test - setting isGenerating to false');
                  setIsGenerating(false);
                  setTimeout(() => {
                    // console.log('Test complete - check button text');
                  }, 100);
                }}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700"
              >
                Test State Change
              </button>
              
              {/* Emergency reset button */}
              <button
                onClick={() => {
                  // console.log('EMERGENCY RESET - forcing all states to false');
                  setIsGenerating(false);
                  setIsEditing(false);
                  setCurrentTemplate(null);
                  setSelectedTier('firstTeam');
                  
                  // Force re-render by updating templates
                  const currentTemplates = [...templates];
                  setTemplates([]);
                  setTimeout(() => {
                    setTemplates(currentTemplates);
                    // console.log('Emergency reset complete');
                    alert('Emergency reset complete! The button should now work.');
                  }, 100);
                }}
                className="w-full bg-red-800 text-white px-4 py-2 rounded text-sm hover:bg-red-900"
              >
                🚨 EMERGENCY RESET
              </button>
            </div>
          </div>
        )}

        {/* Editor */}
        {isEditing && currentTemplate && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sections Editor */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Sections</h2>
                  <button
                    onClick={saveTemplate}
                    className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                  >
                    Save
                  </button>
                </div>
                
                <div className="space-y-2">
                  {currentTemplate.sections.map((section, index) => (
                    <div
                      key={section.id}
                      className={`p-3 border rounded-lg ${
                        !section.enabled ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="flex flex-col mr-2">
                            <button
                              onClick={() => moveSection(section.id, 'up')}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            >
                              ▲
                            </button>
                            <button
                              onClick={() => moveSection(section.id, 'down')}
                              disabled={index === currentTemplate.sections.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            >
                              ▼
                            </button>
                          </div>
                          <span className="font-medium">{section.title}</span>
                        </div>
                        <button
                          onClick={() => toggleSection(section.id)}
                          className={`px-2 py-1 rounded text-xs mr-1 ${
                            section.enabled
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {section.enabled ? 'ON' : 'OFF'}
                        </button>
                        <button
                          onClick={() => removeSection(section.id)}
                          className="px-2 py-1 rounded text-xs bg-red-100 text-red-800 hover:bg-red-200"
                        >
                          🗑️
                        </button>
                      </div>
                      {section.tier === 'seasonPass' && (
                        <div className="mt-1">
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            Season Pass Only
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Section Dropdown */}
                <div className="mt-4">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addSection(e.target.value as any);
                        e.target.value = '';
                      }
                    }}
                    className="w-full p-2 border rounded text-sm"
                    defaultValue=""
                  >
                    <option value="">+ Add Section...</option>
                    <option value="header">Header</option>
                    <option value="leaderboard">Leaderboard</option>
                    <option value="fixtures">Fixtures</option>
                    <option value="predictions">Predictions</option>
                    <option value="stats">Stats</option>
                    <option value="premium">Premium</option>
                    <option value="footer">Footer</option>
                  </select>
                </div>

                <div className="mt-6 space-y-2">
                  <button
                    onClick={exportTemplate}
                    className="w-full bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
                  >
                    Export Template
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                  >
                    Back to Selection
                  </button>
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Content Editor</h2>
                <div className="space-y-6">
                  {currentTemplate.sections.map(section => (
                    <div key={section.id} className="border-b pb-6 last:border-b-0">
                      <h3 className="font-medium mb-3">{section.title}</h3>
                      {renderSectionEditor(section)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Preview</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreviewMode('desktop')}
                      className={`px-3 py-1 rounded text-sm ${
                        previewMode === 'desktop'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Desktop
                    </button>
                    <button
                      onClick={() => setPreviewMode('mobile')}
                      className={`px-3 py-1 rounded text-sm ${
                        previewMode === 'mobile'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Mobile
                    </button>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden" style={{ maxHeight: '800px', overflowY: 'auto' }}>
                  {renderPreview()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterEditor;


