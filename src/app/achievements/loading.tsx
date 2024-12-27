export default function LoadingAchievements() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
      
      <div className="mb-8">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className="h-32 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
      </div>

      <div>
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className="h-32 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
} 