// Dynamic sitemap generator for better SEO
// Generates XML sitemap with all pages, players, teams, and content

interface SitemapURL {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export class SitemapGenerator {
  private baseUrl: string;
  private urls: SitemapURL[] = [];

  constructor(baseUrl: string = 'https://thegafferEPL.com') {
    this.baseUrl = baseUrl;
  }

  /**
   * Add static pages
   */
  addStaticPages() {
    const staticPages: Omit<SitemapURL, 'loc'>[] = [
      { lastmod: this.getToday(), changefreq: 'daily', priority: 1.0 },
      { lastmod: this.getToday(), changefreq: 'daily', priority: 0.9 },
      { lastmod: this.getToday(), changefreq: 'daily', priority: 0.9 },
      { lastmod: this.getToday(), changefreq: 'hourly', priority: 0.8 },
      { lastmod: this.getToday(), changefreq: 'weekly', priority: 0.8 },
      { lastmod: this.getToday(), changefreq: 'weekly', priority: 0.8 },
      { lastmod: this.getToday(), changefreq: 'daily', priority: 0.8 },
      { lastmod: this.getToday(), changefreq: 'weekly', priority: 0.7 },
      { lastmod: this.getToday(), changefreq: 'weekly', priority: 0.7 },
      { lastmod: this.getToday(), changefreq: 'weekly', priority: 0.7 },
      { lastmod: this.getToday(), changefreq: 'weekly', priority: 0.6 },
      { lastmod: this.getToday(), changefreq: 'monthly', priority: 0.9 },
      { lastmod: this.getToday(), changefreq: 'weekly', priority: 0.6 },
      { lastmod: this.getToday(), changefreq: 'weekly', priority: 0.6 },
    ];

    const paths = [
      '/',
      '/league-table',
      '/fixtures',
      '/live-points',
      '/squad-builder',
      '/captain-picks',
      '/price-tracker',
      '/player-comparison',
      '/player-database',
      '/advanced-stats',
      '/beat-the-gaffer',
      '/newsletter',
      '/win-probability',
      '/sack-race',
    ];

    paths.forEach((path, index) => {
      this.urls.push({
        loc: `${this.baseUrl}${path}`,
        ...staticPages[index]
      });
    });
  }

  /**
   * Add player pages (if you have individual player pages)
   */
  addPlayerPages(players: Array<{ id: string; name: string; lastUpdated?: string }>) {
    players.forEach(player => {
      this.urls.push({
        loc: `${this.baseUrl}/players/${this.slugify(player.name)}`,
        lastmod: player.lastUpdated || this.getToday(),
        changefreq: 'weekly',
        priority: 0.6
      });
    });
  }

  /**
   * Add team pages
   */
  addTeamPages(teams: Array<{ id: string; name: string }>) {
    teams.forEach(team => {
      this.urls.push({
        loc: `${this.baseUrl}/teams/${this.slugify(team.name)}`,
        lastmod: this.getToday(),
        changefreq: 'daily',
        priority: 0.7
      });
    });
  }

  /**
   * Add blog/news articles
   */
  addArticles(articles: Array<{ slug: string; publishedAt: string }>) {
    articles.forEach(article => {
      this.urls.push({
        loc: `${this.baseUrl}/news/${article.slug}`,
        lastmod: article.publishedAt,
        changefreq: 'monthly',
        priority: 0.5
      });
    });
  }

  /**
   * Generate XML sitemap
   */
  generateXML(): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${this.urls.map(url => `  <url>
    <loc>${this.escapeXML(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>`;

    return xml;
  }

  /**
   * Generate robots.txt content
   */
  static generateRobotsTxt(sitemapUrl: string): string {
    return `# Robots.txt for The Gaffer's Hub
User-agent: *
Allow: /

# Sitemap
Sitemap: ${sitemapUrl}

# Block unnecessary crawlers to save bandwidth
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

# Allow major search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

# Crawl delay for politeness
Crawl-delay: 1

# Disallow admin and API routes
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /newsletter-editor
`;
  }

  private getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private escapeXML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

/**
 * Generate sitemap for current site
 */
export async function generateSitemap(): Promise<string> {
  const generator = new SitemapGenerator('https://thegafferEPL.com');
  
  // Add static pages
  generator.addStaticPages();
  
  // TODO: Add dynamic content when available
  // const players = await fetchAllPlayers();
  // generator.addPlayerPages(players);
  
  // const teams = await fetchAllTeams();
  // generator.addTeamPages(teams);
  
  return generator.generateXML();
}


