export default function PhotoSkeleton() {
  return (
    <div className="aspect-square relative overflow-hidden bg-gray-900 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900" />
    </div>
  )
} 