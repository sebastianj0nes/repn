import { useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Dumbbell } from 'lucide-react'
import { format } from 'date-fns'

interface PhotoCardProps {
  photo: {
    date: string
    muscle_group: string
    signedUrl: string
  }
}

export default function PhotoCard({ photo }: PhotoCardProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <Card className="overflow-hidden group relative">
      <div className="aspect-square relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Dumbbell className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        <Image
          src={photo.signedUrl}
          alt={`Workout from ${photo.date}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onLoadingComplete={() => setIsLoading(false)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <p className="font-medium">{format(new Date(photo.date), 'PPP')}</p>
            <p className="text-sm opacity-90">{photo.muscle_group}</p>
          </div>
        </div>
      </div>
    </Card>
  )
} 