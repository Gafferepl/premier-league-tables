// Redis Caching Service
// High-performance distributed caching

interface RedisConfig {
  url: string;
  password?: string;
  ttl: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  errors: number;
}

class RedisCacheService {
  private client: any = null;
  private connected = false;
  private readonly config: RedisConfig;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    errors: 0
  };

  constructor() {
    this.config = {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      password: process.env.REDIS_PASSWORD,
      ttl: parseInt(process.env.CACHE_TTL || '900') // 15 minutes default
    };
  }

  /**
   * Initialize Redis connection
   */
  async connect(): Promise<void> {
    if (this.connected) {
      // console.log('✅ Redis already connected');
      return;
    }

    try {
      // Dynamic import to avoid bundling if not used
      const redis = await import('redis');
      
      this.client = redis.createClient({
        url: this.config.url,
        password: this.config.password,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              // console.error('❌ Redis connection failed after 10 retries');
              return new Error('Redis connection failed');
            }
            return retries * 100; // Exponential backoff
          }
        }
      });

      this.client.on('error', (err: Error) => {
        // console.error('Redis error:', err);
        this.stats.errors++;
      });

      this.client.on('connect', () => {
        // console.log('🔄 Redis connecting...');
      });

      this.client.on('ready', () => {
        // console.log('✅ Redis connected and ready');
        this.connected = true;
      });

      this.client.on('reconnecting', () => {
        // console.log('🔄 Redis reconnecting...');
      });

      await this.client.connect();
    } catch (error) {
      // console.error('Failed to initialize Redis:', error);
      this.stats.errors++;
      throw error;
    }
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.connected) {
      // console.warn('⚠️ Redis not connected, skipping cache get');
      this.stats.misses++;
      return null;
    }

    try {
      const value = await this.client.get(key);
      
      if (value) {
        this.stats.hits++;
        return JSON.parse(value) as T;
      }
      
      this.stats.misses++;
      return null;
    } catch (error) {
      // console.error(`Redis get error for key ${key}:`, error);
      this.stats.errors++;
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    if (!this.connected) {
      // console.warn('⚠️ Redis not connected, skipping cache set');
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      const expiryTime = ttl || this.config.ttl;
      
      await this.client.setEx(key, expiryTime, serialized);
      this.stats.sets++;
      return true;
    } catch (error) {
      // console.error(`Redis set error for key ${key}:`, error);
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Delete key from cache
   */
  async delete(key: string): Promise<boolean> {
    if (!this.connected) {
      // console.warn('⚠️ Redis not connected, skipping cache delete');
      return false;
    }

    try {
      await this.client.del(key);
      this.stats.deletes++;
      return true;
    } catch (error) {
      // console.error(`Redis delete error for key ${key}:`, error);
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Delete multiple keys matching pattern
   */
  async deletePattern(pattern: string): Promise<number> {
    if (!this.connected) {
      // console.warn('⚠️ Redis not connected, skipping pattern delete');
      return 0;
    }

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length === 0) return 0;
      
      await this.client.del(keys);
      this.stats.deletes += keys.length;
      return keys.length;
    } catch (error) {
      // console.error(`Redis pattern delete error for ${pattern}:`, error);
      this.stats.errors++;
      return 0;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    if (!this.connected) return false;

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      // console.error(`Redis exists error for key ${key}:`, error);
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Get remaining TTL for key
   */
  async ttl(key: string): Promise<number> {
    if (!this.connected) return -1;

    try {
      return await this.client.ttl(key);
    } catch (error) {
      // console.error(`Redis TTL error for key ${key}:`, error);
      this.stats.errors++;
      return -1;
    }
  }

  /**
   * Increment counter
   */
  async increment(key: string, amount: number = 1): Promise<number> {
    if (!this.connected) return 0;

    try {
      return await this.client.incrBy(key, amount);
    } catch (error) {
      // console.error(`Redis increment error for key ${key}:`, error);
      this.stats.errors++;
      return 0;
    }
  }

  /**
   * Get multiple keys at once
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    if (!this.connected || keys.length === 0) {
      return keys.map(() => null);
    }

    try {
      const values = await this.client.mGet(keys);
      return values.map((v: string | null) => {
        if (v) {
          this.stats.hits++;
          return JSON.parse(v) as T;
        }
        this.stats.misses++;
        return null;
      });
    } catch (error) {
      // console.error('Redis mget error:', error);
      this.stats.errors++;
      return keys.map(() => null);
    }
  }

  /**
   * Clear all cache
   */
  async flush(): Promise<boolean> {
    if (!this.connected) return false;

    try {
      await this.client.flushDb();
      // console.log('🧹 Redis cache flushed');
      return true;
    } catch (error) {
      // console.error('Redis flush error:', error);
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats & { hitRate: number; missRate: number } {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
    const missRate = total > 0 ? (this.stats.misses / total) * 100 : 0;

    return {
      ...this.stats,
      hitRate: Math.round(hitRate * 100) / 100,
      missRate: Math.round(missRate * 100) / 100
    };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      errors: 0
    };
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const stats = this.getStats();

    return `
╔════════════════════════════════════════════════════════════╗
║         REDIS CACHE PERFORMANCE REPORT                     ║
╚════════════════════════════════════════════════════════════╝

📊 CACHE STATISTICS:
   • Status:          ${this.connected ? '✅ Connected' : '❌ Disconnected'}
   • Hit Rate:        ${stats.hitRate}%
   • Miss Rate:       ${stats.missRate}%

📈 OPERATIONS:
   • Cache Hits:      ${stats.hits}
   • Cache Misses:    ${stats.misses}
   • Sets:            ${stats.sets}
   • Deletes:         ${stats.deletes}
   • Errors:          ${stats.errors}

💡 PERFORMANCE:
   • Efficiency:      ${stats.hitRate > 80 ? '✅ Excellent' : stats.hitRate > 50 ? '⚠️ Good' : '❌ Needs Improvement'}
   • Error Rate:      ${stats.errors > 10 ? '⚠️ High' : '✅ Low'}

╚════════════════════════════════════════════════════════════╝
    `;
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    if (!this.connected) return;

    try {
      await this.client.quit();
      this.connected = false;
      // console.log('👋 Redis disconnected');
    } catch (error) {
      // console.error('Redis disconnect error:', error);
    }
  }

  /**
   * Check connection status
   */
  isConnected(): boolean {
    return this.connected;
  }
}

export const redisCacheService = new RedisCacheService();
export type { RedisConfig, CacheStats };


