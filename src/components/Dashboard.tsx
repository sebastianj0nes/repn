"use client"

import { useState, useEffect, useContext, createElement } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, ChartBar, TrendingUp, LogOut, Plus, Zap, Moon, Utensils, Battery, Flame, Target } from "lucide-react"
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
  const [randomTipIndex] = useState(() => Math.floor(Math.random() * workoutTips.length))

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

  if (!session) {
    return <div>Please sign in to access the dashboard</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 mb-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-6 text-center bg-clip-text bg-gradient-to-r from-primary to-secondary"
      >
        {greeting}!
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card className={`bg-gradient-to-br ${colorClasses[colorIndex]} text-white`}>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">Ready to crush your workout?</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href="/workouts/new">
              <motion.div animate={buttonControls}>
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-white text-primary hover:bg-primary hover:text-white"
                >
                  <Plus className="mr-2 h-6 w-6" />
                  Start New Workout
                </Button>
              </motion.div>
            </Link>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <AnimatePresence>
          {["progress", "stats"].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.4 + index * 0.2 }}
            >
              <Link href={`/${item}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  <CardHeader>
                    <CardTitle className="flex items-center text-primary group-hover:text-secondary transition-colors duration-300">
                      {item === "progress" ? (
                        <TrendingUp className="mr-2 h-5 w-5" />
                      ) : (
                        <ChartBar className="mr-2 h-5 w-5" />
                      )}
                      {item === "progress" ? "Check Progress" : "See Stats"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {item === "progress"
                        ? "Track your fitness journey and see how far you've come."
                        : "Dive into your performance metrics and personal records."}
                    </p>
                  </CardContent>
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Card>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center mb-8"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={randomTipIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              <CardContent className="flex items-center space-x-2">
                {createElement(workoutTips[randomTipIndex].icon, { className: "h-6 w-6" })}
                <span className="text-lg font-semibold">{workoutTips[randomTipIndex].tip}</span>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex justify-center items-center space-x-4"
      >
        <Button 
          variant="outline" 
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-300"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
       
      </motion.div>

      <div className="text-center py-10 ">
      <Link 
          href="/privacy-policy" 
          className="text-xs p-4 text-muted-foreground hover:underline"
        >
          Privacy Policy
        </Link>
        <Link 
          href="/terms" 
          className="text-xs text-muted-foreground hover:underline"
        >
          Terms Of Use
        </Link>
      </div>

      {/* Space for BottomNav component */}
      <div className="h-16"></div>
    </div>
  )
}
