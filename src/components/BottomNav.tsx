import Link from 'next/link'
import { Home, Activity, BarChart2, Dumbbell } from 'lucide-react'

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        <Link href="/" className="flex flex-col items-center text-blue-500 hover:text-blue-700">
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1 text-gray-600">Home</span>
        </Link>
        <Link href="/workouts" className="flex flex-col items-center text-blue-500 hover:text-blue-700">
          <Activity className="h-6 w-6" />
          <span className="text-xs mt-1 text-gray-600">Workouts</span>
        </Link>
        <Link href="/progress" className="flex flex-col items-center text-blue-500 hover:text-blue-700">
          <BarChart2 className="h-6 w-6" />
          <span className="text-xs mt-1 text-gray-600">Progress</span>
        </Link>
        <Link href="/exercises" className="flex flex-col items-center text-blue-500 hover:text-blue-700">
          <Dumbbell className="h-6 w-6" />
          <span className="text-xs mt-1 text-gray-600">Exercises</span>
        </Link>
      </div>
    </nav>
  )
}
