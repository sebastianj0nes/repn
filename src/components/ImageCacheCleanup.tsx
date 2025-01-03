'use client'

import { useEffect } from 'react'
import { ImageHandler } from '@/lib/utils/imageHandler'

export default function ImageCacheCleanup() {
  useEffect(() => {
    const cleanup = setInterval(() => {
      ImageHandler.clearExpiredCache();
    }, 60 * 60 * 1000); // Every hour

    return () => clearInterval(cleanup);
  }, []);

  return null;
} 