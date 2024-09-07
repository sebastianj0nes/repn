"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, ActivityIcon, TrendingUpIcon, HeartIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useContext } from 'react'
import { UserContext } from '@/app/UserContext'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Dashboard() {
	const { session } = useContext(UserContext)
	const router = useRouter()

	if (!session) {
		return <div>Please sign in to access the dashboard</div>
	}

	const handleSignOut = async () => {
		const supabase = createClientComponentClient()
		try {
			await supabase.auth.signOut()
			router.push('/signin') // Redirect to home page after sign out
		} catch (error) {
			console.error('Error signing out:', error)
		}
	}

	return (
		<div className="container mx-auto p-4 space-y-6">
			<h1 className="text-2xl font-bold mb-4">Welcome to FitTrack</h1>
			
			{/* Updated user status display */}
			<div className="bg-gray-100 p-4 rounded-md mb-4">
				<p className="text-sm">
					{session.user ? `Signed in as: ${session.user.email}` : 'Not signed in'}
				</p>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Today&apos;s Goal
						</CardTitle>
						<CalendarIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">5 / 7</div>
						<p className="text-xs text-muted-foreground">
							Complete 7 day streak
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Workouts This Week
						</CardTitle>
						<ActivityIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">4</div>
						<p className="text-xs text-muted-foreground">
							+1 from last week
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Strength Progress
						</CardTitle>
						<TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">+2.5%</div>
						<p className="text-xs text-muted-foreground">
							From last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Calories</CardTitle>
						<HeartIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">1,892</div>
						<p className="text-xs text-muted-foreground">
							308 calories remaining
						</p>
					</CardContent>
				</Card>
			</div>
			<div className="space-y-4">
				<Button asChild className="w-full">
					<Link href="/workouts">Log Workout</Link>
				</Button>
				<Button asChild variant="outline" className="w-full">
					<Link href="/nutrition">Log Meal</Link>
				</Button>
				<div className="mt-4">
					<Button onClick={handleSignOut} variant="secondary" className="w-full">
						Sign Out
					</Button>
				</div>
			</div>
		</div>
	)
}