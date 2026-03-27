// Memory Cache - L1 Cache (fastest)
export class MemoryCache {
  private cache = new Map<string, { data: any; expires: number }>();
  private maxSize = 1000; // Maximum cache entries

  set(key: string, data: any, ttlSeconds: number = 300): void {
    // Clean up if cache is too large
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    const expires = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { data, expires });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private evictOldest(): void {
    const oldest = Array.from(this.cache.entries())
      .sort((a, b) => a[1].expires - b[1].expires)[0];
    
    if (oldest) {
      this.cache.delete(oldest[0]);
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys())
    };
  }
}


