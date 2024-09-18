import Link from 'next/link'
import { Home, Activity, BarChart2, Utensils, BarChart3 } from 'lucide-react'

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="flex justify-around items-center h-16">
        <Link href="/" className="flex flex-col items-center">
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/workouts" className="flex flex-col items-center">
          <Activity className="h-6 w-6" />
          <span className="text-xs mt-1">Workouts</span>
        </Link>
        <Link href="/progress" className="flex flex-col items-center">
          <BarChart2 className="h-6 w-6" />
          <span className="text-xs mt-1">Progress</span>
        </Link>
        <Link href="/stats" className="flex flex-col items-center">
          <BarChart3 className="h-6 w-6" />
          <span className="text-xs mt-1">Stats</span>
        </Link>
      </div>
    </nav>
  )
}