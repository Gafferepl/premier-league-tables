// SEO Head Component 2026 - Latest SEO Standards
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHead2026Props {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
  noindex?: boolean;
  structuredData?: Record<string, any>;
  article?: boolean;
  author?: string;
  publishDate?: string;
  modifiedDate?: string;
  pageType?: 'article' | 'product' | 'website' | 'video' | 'recipe';
  targetAudience?: string;
  about?: string[];
  mentions?: string[];
  mainEntity?: Record<string, any>;
}

const SEOHead2026: React.FC<SEOHead2026Props> = ({
  title = "Premier League Tables | Fantasy Football Tips & Analysis 2026",
  description = "Get expert Premier League fantasy football tips, player analysis, captain picks, and squad builder tools. Beat your rivals with AI-powered insights for 2026 season.",
  keywords = "Premier League 2026, fantasy football, FPL 2026, fantasy tips, captain picks, squad builder, player analysis, Premier League predictions, AI football analysis",
  ogImage = "/og-image-2026.jpg",
  ogUrl,
  canonical,
  noindex = false,
  structuredData,
  article = false,
  author = "The Gaffer",
  publishDate,
  modifiedDate,
  pageType = 'website',
  targetAudience = "Fantasy Football Managers",
  about = ["Sports", "Fantasy Football", "Premier League", "Football"],
  mentions = ["Premier League", "FPL", "Fantasy Premier League"],
  mainEntity
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://premierleaguetables.com';
  const fullUrl = ogUrl || siteUrl;
  const canonicalUrl = canonical || fullUrl;

  // 2026 Enhanced structured data with AI and machine learning context
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": article ? "Article" : pageType,
    "name": title,
    "description": description,
    "url": canonicalUrl,
    "image": ogImage,
    "author": {
      "@type": "Person",
      "name": author,
      "sameAs": ["https://twitter.com/premierleaguetables"]
    },
    "publisher": {
      "@type": "Organization",
      "name": "Premier League Tables",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo-2026.png`
      },
      "sameAs": [
        "https://twitter.com/premierleaguetables",
        "https://facebook.com/premierleaguetables",
        "https://instagram.com/premierleaguetables"
      ]
    },
    "datePublished": publishDate || new Date().toISOString(),
    "dateModified": modifiedDate || publishDate || new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "about": about.map(topic => ({
      "@type": "Thing",
      "name": topic
    })),
    "mentions": mentions.map(mention => ({
      "@type": "Thing",
      "name": mention
    })),
    "targetAudience": {
      "@type": "Audience",
      "audienceType": targetAudience
    },
    "inLanguage": "en-GB",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Premier League Tables",
      "url": siteUrl
    },
    // 2026 AI/ML context
    "applicationCategory": "SportsApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    },
    ...(mainEntity && { mainEntity }),
    // 2026 specific additions
    "contentLocation": {
      "@type": "Country",
      "name": "United Kingdom"
    },
    "genre": ["Sports", "Fantasy Sports", "Football"],
    "keywords": keywords,
    "educationalUse": "instruction",
    "learningResourceType": "analysis tool",
    "teaches": ["Fantasy Football Strategy", "Player Analysis", "Team Management"]
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags - 2026 enhanced */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* 2026 Enhanced Open Graph */}
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Premier League Tables" />
      <meta property="og:locale" content="en_GB" />
      
      {/* 2026 Twitter/X integration */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${siteUrl}${ogImage}`} />
      <meta property="twitter:creator" content="@premierleaguetables" />
      <meta property="twitter:site" content="@premierleaguetables" />
      
      {/* 2026 Additional SEO Meta */}
      <meta name="theme-color" content="#dc2626" />
      <meta name="msapplication-TileColor" content="#dc2626" />
      <meta name="application-name" content="Premier League Tables 2026" />
      <meta name="apple-mobile-web-app-title" content="PL Tables 2026" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      
      {/* 2026 Preconnect and DNS prefetch */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.supabase.co" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      
      {/* 2026 DNS prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//connect.facebook.net" />
      <link rel="dns-prefetch" href="//www.facebook.com" />
      <link rel="dns-prefetch" href="//twitter.com" />
      
      {/* 2026 Early hints */}
      <link rel="modulepreload" href="/js/main-2026.js" />
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/hero-image-2026.webp" as="image" />
      
      {/* 2026 Structured Data with AI context */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
      
      {/* 2026 Additional structured data for AI/ML */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Premier League Tables - Fantasy Football Intelligence",
          "description": "AI-powered fantasy football analysis and recommendations",
          "applicationCategory": "SportsApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "GBP"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1250"
          },
          "author": {
            "@type": "Organization",
            "name": "Premier League Tables - Beat The Gaffer",
          },
          "datePublished": new Date().toISOString(),
          "url": canonicalUrl
        })}
      </script>
      
      {/* 2026 Favicon and app icons */}
      <link rel="icon" type="image/svg+xml" href="/favicon-2026.svg" />
      <link rel="icon" type="image/png" href="/favicon-2026.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon-2026.png" />
      <link rel="manifest" href="/manifest-2026.json" />
      
      {/* 2026 Security and privacy */}
      <meta name="referrer" content="no-referrer-when-downgrade" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="msapplication-tap-highlight" content="no" />
      
      {/* 2026 Content classification */}
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="language" content="en" />
      <meta name="geo.region" content="GB" />
      <meta name="geo.placename" content="United Kingdom" />
      
      {/* 2026 Alternative links for internationalization */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en-GB" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      
      {/* 2026 Social media verification */}
      <meta name="facebook-domain-verification" content="your-verification-code" />
      <meta name="google-site-verification" content="your-google-verification-code" />
      <meta name="p:domain_verify" content="your-pinterest-verification-code" />
      
      {/* 2026 Performance hints */}
      <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
      <link rel="preconnect" href="//cdn.jsdelivr.net" crossOrigin="anonymous" />
    </Helmet>
  );
};

export default SEOHead2026;


