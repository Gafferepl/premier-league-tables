// CDN Service
// Manages static asset delivery through CDN

interface CDNConfig {
  staticUrl: string;
  imageUrl: string;
  enabled: boolean;
}

class CDNService {
  private readonly config: CDNConfig;

  constructor() {
    this.config = {
      staticUrl: process.env.CDN_URL || '',
      imageUrl: process.env.IMAGE_CDN_URL || '',
      enabled: process.env.NODE_ENV === 'production' && !!(process.env.CDN_URL || process.env.IMAGE_CDN_URL)
    };
  }

  /**
   * Get CDN URL for static asset
   */
  getStaticUrl(path: string): string {
    if (!this.config.enabled || !this.config.staticUrl) {
      return path;
    }

    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${this.config.staticUrl}/${cleanPath}`;
  }

  /**
   * Get CDN URL for image with optimization parameters
   */
  getImageUrl(path: string, options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  }): string {
    if (!this.config.enabled || !this.config.imageUrl) {
      return path;
    }

    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    let url = `${this.config.imageUrl}/${cleanPath}`;

    if (options) {
      const params = new URLSearchParams();
      if (options.width) params.append('w', options.width.toString());
      if (options.height) params.append('h', options.height.toString());
      if (options.quality) params.append('q', options.quality.toString());
      if (options.format) params.append('f', options.format);

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return url;
  }

  /**
   * Preload critical assets
   */
  preloadAssets(assets: Array<{ url: string; type: 'script' | 'style' | 'image' | 'font' }>): void {
    if (typeof window === 'undefined') return;

    assets.forEach(asset => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = this.getStaticUrl(asset.url);

      switch (asset.type) {
        case 'script':
          link.as = 'script';
          break;
        case 'style':
          link.as = 'style';
          break;
        case 'image':
          link.as = 'image';
          break;
        case 'font':
          link.as = 'font';
          link.crossOrigin = 'anonymous';
          break;
      }

      document.head.appendChild(link);
    });
  }

  /**
   * Get responsive image srcset
   */
  getResponsiveSrcSet(path: string, widths: number[] = [320, 640, 960, 1280, 1920]): string {
    return widths
      .map(width => `${this.getImageUrl(path, { width })} ${width}w`)
      .join(', ');
  }

  /**
   * Check if CDN is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Get CDN configuration
   */
  getConfig(): CDNConfig {
    return { ...this.config };
  }

  /**
   * Purge CDN cache (if supported)
   */
  async purgeCache(paths?: string[]): Promise<boolean> {
    // This would integrate with your CDN provider's API
    // Example for Cloudflare, Fastly, etc.
    // console.log('CDN cache purge requested for:', paths || 'all');
    
    // Implementation depends on CDN provider
    // For now, just log the request
    return true;
  }
}

export const cdnService = new CDNService();
export type { CDNConfig };


