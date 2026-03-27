// Supabase Cache - L2 Cache (medium speed)
import { createClient } from '@supabase/supabase-js';

export class SupabaseCache {
  private supabase;

  constructor() {
    const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    } else {
      // console.warn('SupabaseCache: Supabase not configured');
    }
  }

  async set(key: string, data: any, ttlSeconds: number = 3600, apiSource: string = 'fpl'): Promise<void> {
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

    const { error } = await this.supabase
      .from('cache_entries')
      .upsert({
        key,
        data,
        expires_at: expiresAt.toISOString(),
        api_source: apiSource,
        last_accessed: new Date().toISOString(),
        access_count: 1
      }, {
        onConflict: 'key'
      });

    if (error) {
      // console.error('Supabase cache set error:', error);
    }
  }

  async get(key: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('cache_entries')
      .select('data, expires_at')
      .eq('key', key)
      .single();

    if (error || !data) {
      return null;
    }

    // Check if expired
    if (new Date(data.expires_at) < new Date()) {
      await this.delete(key);
      return null;
    }

    // Update access stats
    await this.updateAccessStats(key);

    return data.data;
  }

  async has(key: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('cache_entries')
      .select('expires_at')
      .eq('key', key)
      .single();

    if (error || !data) {
      return false;
    }

    return new Date(data.expires_at) > new Date();
  }

  async delete(key: string): Promise<void> {
    await this.supabase
      .from('cache_entries')
      .delete()
      .eq('key', key);
  }

  async clear(): Promise<void> {
    await this.supabase
      .from('cache_entries')
      .delete()
      .neq('key', '');
  }

  async getStale(key: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('cache_entries')
      .select('data')
      .eq('key', key)
      .single();

    if (error || !data) {
      return null;
    }

    return data.data;
  }

  async cleanExpired(): Promise<void> {
    await this.supabase
      .from('cache_entries')
      .delete()
      .lt('expires_at', new Date().toISOString());
  }

  private async updateAccessStats(key: string): Promise<void> {
    await this.supabase.rpc('increment_access_count', { cache_key: key });
  }

  async getStats() {
    const { data, error } = await this.supabase
      .from('cache_entries')
      .select('key, api_source, access_count, created_at');

    if (error) {
      return { total: 0, bySource: {} };
    }

    const bySource = data.reduce((acc: any, entry: any) => {
      acc[entry.api_source] = (acc[entry.api_source] || 0) + 1;
      return acc;
    }, {});

    return {
      total: data.length,
      bySource
    };
  }
}


