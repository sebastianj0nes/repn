"use client"

import { useState, useEffect, useContext, createElement } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, ChartBar, TrendingUp, LogOut, Plus, Zap, Moon, Utensils, Battery, Flame, Target, ChevronRight, Info, ChartBarIcon, ListIcon } from "lucide-react"
import { UserContext } from '@/app/UserContext'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const colorClasses = [
  "from-blue-400 to-purple-500",
  "from-green-400 to-cyan-500",
  "from-yellow-400 to-orange-500",
  "from-pink-400 to-red-500",
]

const workoutTips = [
  {
    tip: "Stay hydrated during your workouts!",
    icon: Zap,
  },
  {
    tip: "Aim for 7-9 hours of sleep to maximize muscle recovery and growth",
    icon: Moon,
  },
  {
    tip: "Track your protein intake - aim for 1.6-2.2g per kg of body weight",
    icon: Utensils,
  },
  {
    tip: "Don't skip your rest days - they're crucial for muscle recovery",
    icon: Battery,
  },
  {
    tip: "Remember to warm up properly to prevent injuries",
    icon: Flame,
  },
  {
    tip: "Focus on proper form over heavy weights",
    icon: Target,
  }
]

export default function Dashboard() {
  const [greeting, setGreeting] = useState("")
  const [colorIndex, setColorIndex] = useState(0)
  const { session } = useContext(UserContext)
  const router = useRouter()
  const buttonControls = useAnimation()
  const [randomTipIndex, setRandomTipIndex] = useState(() => 
    Math.floor(Math.random() * workoutTips.length)
  )

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")

    const intervalId = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % colorClasses.length)
    }, 5000)

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

    return () => {
      clearInterval(intervalId)
    }
  }, [buttonControls, session])

  const handleSignOut = async () => {
    const supabase = createClientComponentClient()
    try {
      await supabase.auth.signOut()
      router.push('/signin')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleNextTip = () => {
    setRandomTipIndex((prevIndex) => 
      (prevIndex + 1) % workoutTips.length
    )
  }

  if (!session) {
    return <div>Please sign in to access the dashboard</div>
  }

  return (
    <div className="container mx-auto px-4 py-6 mb-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center text-primary mt-2"
      >
        Repn
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-semibold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
      >
        {greeting}!
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2, delay: 0.3 }}
        className="mb-6"
      >
        <Card className={`bg-gradient-to-br ${colorClasses[colorIndex]} text-white overflow-hidden`}>
          <CardContent className="p-6">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                transition: { duration: 2, repeat: Infinity }
              }}
              className="text-center mb-4"
            >
              <Dumbbell className="h-12 w-12 mx-auto mb-2" />
              <h2 className="text-xl font-bold">Ready to crush your workout?</h2>
            </motion.div>
            <div className="flex justify-center">
              <Link href="/workouts/new">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-6 rounded-full shadow-lg bg-white text-primary hover:bg-primary hover:text-white"
                  >
                    <Plus className="mr-2 h-6 w-6" />
                    Start New Workout
                  </Button>
                </motion.div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/progress">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <ChartBarIcon className="h-8 w-8 mb-2 text-primary" />
                <h3 className="font-semibold">Progress</h3>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/stats">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <ListIcon className="h-8 w-8 mb-2 text-primary" />
                <h3 className="font-semibold">Stats</h3>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-6"
      >
        <Link href="/exercises">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <Dumbbell className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold">Exercises</h3>
            </CardContent>
          </Card>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, delay: 0.4 }}
        className="mb-6"
      >
        <Link href="/tips">
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-primary" />
                <span className="font-medium">View Training Tips</span>
              </div>
              <ChevronRight className="h-5 w-5 text-primary" />
            </CardContent>
          </Card>
        </Link>

      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-20"
      >
        <Card className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 overflow-hidden relative">
          <motion.div
            animate={{
              x: [-4, 4, -4],
              transition: { duration: 4, repeat: Infinity }
            }}
            className="p-4"
          >
            <CardContent className="flex items-start sm:items-center gap-4 p-2">
              {createElement(workoutTips[randomTipIndex].icon, { 
                className: "h-8 w-8 sm:h-6 sm:w-6 text-primary flex-shrink-0" 
              })}
              <p className="text-sm font-medium flex-1">{workoutTips[randomTipIndex].tip}</p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextTip}
                className="absolute bottom-2 right-2 p-2 rounded-full hover:bg-primary/10 transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-primary" />
              </motion.button>
            </CardContent>
          </motion.div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-auto flex flex-col items-center space-y-6"
      >
        <Button 
          variant="ghost" 
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>

        <div className="flex justify-center space-x-4">
          <Link href="/privacy-policy" className="text-xs text-muted-foreground hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-xs text-muted-foreground hover:underline">
            Terms Of Use
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
