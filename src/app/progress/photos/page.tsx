'use client'

import { useState, useContext, useRef } from 'react'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { UserContext } from '@/app/UserContext'
import { Dumbbell } from 'lucide-react'
import PhotoGrid from './PhotoGrid'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ImageHandler } from '@/lib/utils/imageHandler'
import { Photo } from '@/types/photo'

const ITEMS_PER_PAGE = 12

export default function PhotoLibraryPage() {
  const { session } = useContext(UserContext)
  const supabase = createClientComponentClient()

  const fetchPhotosPage = async ({ pageParam = 0 }) => {
    const from = pageParam * ITEMS_PER_PAGE
    const to = from + ITEMS_PER_PAGE - 1

    const { data, error } = await supabase
      .from('workouts')
      .select('id, image_url, date, user_weight')
      .eq('user_id', session?.user.id)
      .not('image_url', 'is', null)
      .order('date', { ascending: false })
      .range(from, to)

    if (error) throw error

    const photosWithUrls = (await Promise.all(
      data.map(async (workout) => {
        if (workout.image_url) {
          const signedUrl = await ImageHandler.getSignedUrl(supabase, workout.image_url, session?.user?.id)
          return signedUrl ? {
            id: workout.id,
            image_url: workout.image_url,
            date: workout.date,
            user_weight: workout.user_weight,
            signedUrl
          } : null
        }
        return null
      })
    )).filter((photo): photo is NonNullable<typeof photo> => photo !== null)

    return {
      photos: photosWithUrls,
      nextPage: photosWithUrls.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined
    }
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['photos', session?.user.id],
    queryFn: fetchPhotosPage,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    enabled: !!session?.user,
  })

  // Intersection Observer for infinite scroll
  const observer = useRef<IntersectionObserver>()
  const lastPhotoElementRef = (node: HTMLDivElement) => {
    if (isFetchingNextPage) return
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage()
      }
    })

    if (node) observer.current.observe(node)
  }

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-xl text-muted-foreground">Please log in to view your photo library</p>
      </div>
    )
  }

  const allPhotos = data?.pages.flatMap(page => page.photos) ?? []

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-primary">Photo Library</h1>
        <Button asChild variant="outline">
          <Link href="/progress">← Back to Progress</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Dumbbell className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground mt-4">Loading your photos...</p>
        </div>
      ) : (
        <>
          <PhotoGrid 
            photos={allPhotos} 
            lastPhotoRef={lastPhotoElementRef}
          />
          {isFetchingNextPage && (
            <div className="flex justify-center mt-8">
              <Dumbbell className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </>
      )}
    </div>
  )
} 