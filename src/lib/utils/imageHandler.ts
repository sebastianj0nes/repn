import imageCompression from 'browser-image-compression';
import { UsageLogger } from '@/lib/utils/usageLogger';

interface ImageHandlerOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  quality?: number;
}

export class ImageHandler {
  private static signedUrlCache: Map<string, { url: string; expiry: number }> = new Map();

  static async compressImage(file: File, options?: Partial<ImageHandlerOptions>): Promise<File> {
    const defaultOptions: ImageHandlerOptions = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1024,
      quality: 0.8
    };

    const finalOptions = { ...defaultOptions, ...options };

    // Skip compression if image is already small enough
    if (file.size <= finalOptions.maxSizeMB * 1024 * 1024) {
      return file;
    }

    try {
      const compressedFile = await imageCompression(file, finalOptions);
      return new File([compressedFile], file.name, { type: compressedFile.type });
    } catch (error) {
      console.error('Image compression failed:', error);
      return file;
    }
  }

  static async getSignedUrl(supabase: any, imageUrl: string, userId?: string): Promise<string | null> {
    const cacheKey = `signed_url_${imageUrl}`;
    const now = Date.now();

    // Check localStorage first
    try {
      const storedCache = localStorage.getItem(cacheKey);
      if (storedCache) {
        const parsed = JSON.parse(storedCache);
        if (new Date(parsed.expiry).getTime() > now) {
          // Update memory cache
          this.signedUrlCache.set(cacheKey, {
            url: parsed.url,
            expiry: new Date(parsed.expiry).getTime()
          });

          if (userId) {
            await UsageLogger.logUsage({
              operation_type: 'signed_url',
              bytes_transferred: 0,
              resource_path: imageUrl,
              user_id: userId,
              cached: true
            });
          }
          console.log('URL retrieved from localStorage cache');
          return parsed.url;
        }
        localStorage.removeItem(cacheKey);
      }
    } catch (error) {
      console.error('Cache read error:', error);
    }

    // If not in localStorage, check memory cache
    const memoryCache = this.signedUrlCache.get(cacheKey);
    if (memoryCache && now < memoryCache.expiry) {
      console.log('URL retrieved from memory cache');
      return memoryCache.url;
    }

    // Generate new signed URL if no valid cache exists
    try {
      const { data, error } = await supabase
        .storage
        .from('users-workout-img')
        .createSignedUrl(imageUrl, 60 * 60 * 24);

      if (error) throw error;

      if (data?.signedUrl) {
        const expiry = now + (23 * 60 * 60 * 1000);
        
        // Update both caches
        this.signedUrlCache.set(cacheKey, {
          url: data.signedUrl,
          expiry
        });
        
        localStorage.setItem(cacheKey, JSON.stringify({
          url: data.signedUrl,
          expiry: new Date(expiry).toISOString()
        }));

        if (userId) {
          await UsageLogger.logUsage({
            operation_type: 'signed_url',
            bytes_transferred: UsageLogger.calculateBytes(data),
            resource_path: imageUrl,
            user_id: userId,
            cached: false
          });
        }
        console.log('New signed URL generated and cached');
        return data.signedUrl;
      }
    } catch (error) {
      console.error('Error creating signed URL:', error);
    }

    return null;
  }

  static clearExpiredCache(): void {
    const now = Date.now();
    Array.from(this.signedUrlCache.entries()).forEach(([key, value]) => {
      if (now >= value.expiry) {
        this.signedUrlCache.delete(key);
      }
    });
  }
} 