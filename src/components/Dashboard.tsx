"use client"

import { motion, useAnimation } from 'framer-motion'
import { useEffect, useContext } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dumbbell, TrendingUp, LogOut, ChevronRight } from 'lucide-react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UserContext } from '@/app/UserContext'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Dashboard() {
	const { session } = useContext(UserContext)
	const router = useRouter()
	const buttonControls = useAnimation()

	useEffect(() => {
		if (session) {
			buttonControls.start({
				x: [0, 5, 0, -5, 0],
				transition: {
					duration: 2,
					repeat: Infinity,
					ease: "easeInOut"
				}
			})
		}
	}, [buttonControls, session])

	const handleSignOut = async () => {
		const supabase = createClientComponentClient()
		try {
			await supabase.auth.signOut()
			router.push('/signin') // Redirect to home page after sign out
		} catch (error) {
			console.error('Error signing out:', error)
		}
	}

	const MotionCard = motion(Card)
	const MotionButton = motion(Button)

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2
			}
		}
	}

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				type: "spring",
				stiffness: 100
			}
		}
	}

	if (!session) {
		return <div>Please sign in to access the dashboard</div>
	}

	return (
		<div className="container mx-auto px-4 py-8 h-full flex flex-col justify-between bg-gradient-to-b from-blue-50 to-white">
			<motion.div 
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-center mb-12"
			>
				<h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to FitTrack</h1>
				<p className="text-xl text-gray-600">Hello there</p>
			</motion.div>

			{/* User status display */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="bg-gray-100 p-4 rounded-md mb-8"
			>
			</motion.div>

			<motion.div 
				className="space-y-8 mb-12"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				<MotionCard variants={itemVariants} className="overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white">
					<CardContent className="p-8 flex flex-col items-center text-center">
						<motion.div 
							className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6"
							whileHover={{ scale: 1.1, rotate: 360 }}
							transition={{ duration: 0.5 }}
						>
							<Dumbbell className="h-12 w-12 text-blue-500" />
						</motion.div>
						<h2 className="text-3xl font-bold mb-4">Start Your Fitness Journey</h2>
						<p className="text-lg mb-6">Ready to crush a workout? Let&apos;s get moving!</p>
						<MotionButton
							animate={buttonControls}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							asChild
							className="bg-white text-blue-500 hover:bg-blue-100 text-lg py-3 px-6"
						>
							<Link href="/workouts" className="flex items-center">
								Begin Workout <ChevronRight className="ml-2 h-5 w-5" />
							</Link>
						</MotionButton>
					</CardContent>
				</MotionCard>

				<MotionCard variants={itemVariants} className="overflow-hidden bg-gradient-to-r from-green-400 to-teal-500 text-white">
					<CardContent className="p-6 flex items-center space-x-4">
						<div className="flex-shrink-0 w-16 h-16 bg-white rounded-full flex items-center justify-center">
							<TrendingUp className="h-8 w-8 text-green-500" />
						</div>
						<div className="flex-grow">
							<h2 className="text-2xl font-semibold mb-1">Track Your Progress</h2>
							<p className="text-lg mb-4">Watch your fitness journey unfold over time.</p>
							<MotionButton
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								asChild
								className="bg-white text-green-500 hover:bg-green-100"
							>
								<Link href="/progress" className="flex items-center">
									View Progress <ChevronRight className="ml-2 h-4 w-4" />
								</Link>
							</MotionButton>
						</div>
					</CardContent>
				</MotionCard>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.4 }}
				className="mt-auto"
			>
				<Button
					onClick={handleSignOut}
					variant="ghost"
					className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-100"
				>
					<LogOut className="mr-2 h-4 w-4" />
					Sign Out
				</Button>
			</motion.div>
		</div>
	)
}