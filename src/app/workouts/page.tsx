'use client'

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dumbbell, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function WorkoutsLandingPage() {
  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
      <motion.h1 
        className="text-4xl font-bold text-primary mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Ready to crush your workout?
      </motion.h1>
      <div className="w-full max-w-md space-y-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button asChild className="w-full h-16 text-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Link href="/workouts/new">
              <Dumbbell className="mr-2 h-6 w-6" /> Start New Workout
            </Link>
          </Button>
        </motion.div>
        <Card>
          <CardContent className="p-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild variant="outline" className="w-full">
                <Link href="/workouts/log-past">
                  <Calendar className="mr-2 h-4 w-4" /> Log Past Workout
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}