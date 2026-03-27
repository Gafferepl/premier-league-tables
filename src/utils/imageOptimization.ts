// Image Optimization Utilities
// Provides lazy loading, WebP conversion, and responsive images

interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  lazy?: boolean;
}

class ImageOptimizationService {
  private readonly CDN_URL = process.env.IMAGE_CDN_URL || '';
  private readonly SUPPORTED_FORMATS = ['webp', 'jpeg', 'png', 'jpg'];

  /**
   * Generate optimized image URL
   */
  getOptimizedUrl(src: string, options: ImageOptimizationOptions = {}): string {
    const {
      width,
      height,
      quality = 80,
      format = 'webp'
    } = options;

    // If using CDN, construct optimized URL
    if (this.CDN_URL) {
      const params = new URLSearchParams();
      if (width) params.append('w', width.toString());
      if (height) params.append('h', height.toString());
      params.append('q', quality.toString());
      params.append('f', format);

      return `${this.CDN_URL}/${src}?${params.toString()}`;
    }

    // Fallback to original URL
    return src;
  }

  /**
   * Generate responsive srcset for different screen sizes
   */
  generateSrcSet(src: string, widths: number[] = [320, 640, 960, 1280, 1920]): string {
    return widths
      .map(width => `${this.getOptimizedUrl(src, { width })} ${width}w`)
      .join(', ');
  }

  /**
   * Generate picture element with WebP fallback
   */
  generatePictureElement(src: string, alt: string, options: ImageOptimizationOptions = {}): string {
    const webpSrc = this.getOptimizedUrl(src, { ...options, format: 'webp' });
    const jpegSrc = this.getOptimizedUrl(src, { ...options, format: 'jpeg' });

    return `
      <picture>
        <source srcset="${webpSrc}" type="image/webp" />
        <source srcset="${jpegSrc}" type="image/jpeg" />
        <img 
          src="${jpegSrc}" 
          alt="${alt}" 
          ${options.lazy ? 'loading="lazy"' : ''}
          ${options.width ? `width="${options.width}"` : ''}
          ${options.height ? `height="${options.height}"` : ''}
        />
      </picture>
    `;
  }

  /**
   * Lazy load images using Intersection Observer
   */
  initLazyLoading(): void {
    if (typeof window === 'undefined') return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          const srcset = img.dataset.srcset;

          if (src) {
            img.src = src;
          }
          if (srcset) {
            img.srcset = srcset;
          }

          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    // Observe all images with lazy class
    document.querySelectorAll('img.lazy').forEach(img => {
      imageObserver.observe(img);
    });
  }

  /**
   * Preload critical images
   */
  preloadImage(src: string, options: ImageOptimizationOptions = {}): void {
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = this.getOptimizedUrl(src, options);

    if (options.format === 'webp') {
      link.type = 'image/webp';
    }

    document.head.appendChild(link);
  }

  /**
   * Convert image to WebP format (client-side)
   */
  async convertToWebP(file: File, quality: number = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Could not convert image to WebP'));
              }
            },
            'image/webp',
            quality
          );
        };
        
        img.onerror = () => reject(new Error('Could not load image'));
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Get image dimensions
   */
  async getImageDimensions(src: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => reject(new Error('Could not load image'));
      img.src = src;
    });
  }

  /**
   * Check if browser supports WebP
   */
  supportsWebP(): Promise<boolean> {
    if (typeof window === 'undefined') return Promise.resolve(false);

    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  /**
   * Compress image before upload
   */
  async compressImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          
          // Resize if needed
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Could not compress image'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        
        img.onerror = () => reject(new Error('Could not load image'));
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsDataURL(file);
    });
  }
}

export const imageOptimizationService = new ImageOptimizationService();
export type { ImageOptimizationOptions };


