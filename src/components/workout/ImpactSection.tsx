'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExerciseImpactCard } from "./ExerciseImpactCard"
import { Target, Info, Dumbbell, TrendingUp, Star, Award, Zap, ArrowUpRight, ChevronRight, InfoIcon } from "lucide-react"
import { getExerciseDetails } from "@/lib/data/exercises"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"

// Helper component for info tooltips
const InfoTooltip = ({ content }: { content: string | React.ReactNode }) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-6 w-6 p-0 hover:bg-black/5 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <InfoIcon className="h-4 w-4 opacity-70" />
        </Button>
      </TooltipTrigger>
      <TooltipContent 
        side="top" 
        align="center"
        className="max-w-[250px] p-3 bg-white shadow-lg"
      >
        {content}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

interface ImpactSectionProps {
  exercises: Array<{
    name: string;
    data: {
      maxWeight: number;
      volumeProgress: number;
      trend: 'increasing' | 'decreasing' | 'neutral';
      maxReps?: number;
    };
  }>;
}

export function ImpactSection({ exercises }: ImpactSectionProps) {
  const getMuscleGroup = (exerciseName: string) => {
    const details = getExerciseDetails(exerciseName)
    return 'muscle_group' in details ? details.muscle_group : 'Unknown'
  }

  // Calculate exercise selection score based on compound movements and exercise variety
  const calculateSelectionScore = () => {
    const hasCompoundMovements = exercises.some(ex => {
      const details = getExerciseDetails(ex.name)
      return details.tier === 'A*'
    })
    
    // Get unique muscle groups covered
    const muscleGroups = new Set(exercises.map(ex => getMuscleGroup(ex.name)))
    const muscleGroupCoverage = (muscleGroups.size / 7) * 100 // 7 is total possible muscle groups
    
    // Calculate tier distribution
    const tierCounts = exercises.reduce((acc, ex) => {
      const tier = getExerciseDetails(ex.name).tier
      acc[tier] = (acc[tier] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const tierScore = ((tierCounts['A*'] || 0) * 3 + (tierCounts['A'] || 0) * 2 + (tierCounts['B'] || 0)) / exercises.length * 33.33

    return Math.round((hasCompoundMovements ? 100 : 60) * (muscleGroupCoverage / 100) * (tierScore / 100))
  }

  // Get top progressing exercises
  const topProgressors = exercises
    .filter(ex => ex.data.volumeProgress > 0)
    .sort((a, b) => b.data.volumeProgress - a.data.volumeProgress)
    .slice(0, 3)

  const selectionScore = calculateSelectionScore()

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-500" />
              <span>Exercise Selection Impact</span>
            </div>
            <InfoTooltip content={
              <div>
                <p className="font-medium mb-2">How Your Score is Calculated</p>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 font-medium">•</span>
                    <span>Compound Movements: Having A* tier exercises like Deadlifts and Squats significantly boosts your score</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 font-medium">•</span>
                    <span>Muscle Coverage: Your score improves as you target more muscle groups in your workout</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 font-medium">•</span>
                    <span>Exercise Quality: A higher proportion of A* and A tier exercises leads to a better score</span>
                  </li>
                </ul>
                <p className="text-xs text-slate-500 mt-2 italic">Aim for a balanced selection of effective exercises across muscle groups</p>
              </div>
            } />
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Exercise Selection Score */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Exercise Selection Score
            </h3>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative flex items-center gap-6">
              <div className="w-36 h-36">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="relative w-full h-full"
                >
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="66"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="10"
                      className="opacity-25"
                    />
                    <motion.circle
                      cx="72"
                      cy="72"
                      r="66"
                      fill="none"
                      stroke={selectionScore >= 80 ? "#22c55e" : selectionScore >= 60 ? "#3b82f6" : "#ef4444"}
                      strokeWidth="10"
                      strokeDasharray={`${2 * Math.PI * 66}`}
                      strokeDashoffset={2 * Math.PI * 66 * (1 - selectionScore / 100)}
                      initial={{ strokeDashoffset: 2 * Math.PI * 66 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 66 * (1 - selectionScore / 100) }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                      className="drop-shadow"
                    />
                  </svg>
                </motion.div>
              </div>
              <motion.div 
                className="bg-white rounded-xl px-4 py-3 shadow-sm border flex flex-col items-center min-w-[80px]"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <span className="text-3xl font-bold">{selectionScore}</span>
                <span className="text-xs text-slate-500 mt-0.5">Score</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            Recommendations
          </h3>
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            {exercises.length > 0 ? (
              <>
                {/* Show if no A* exercises */}
                {!exercises.some(ex => {
                  const details = getExerciseDetails(ex.name);
                  return details && details.tier === 'A*';
                }) && (
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-indigo-500 mt-1" />
                    <div>
                      <p className="font-medium">Add Compound Exercises</p>
                      <p className="text-sm text-slate-600">
                        Include A* tier exercises like Deadlifts, Squats, or Bench Press for maximum muscle growth.
                      </p>
                    </div>
                  </div>
                )}

                {/* Show if less than 6 muscle groups covered */}
                {new Set(exercises.map(ex => getMuscleGroup(ex.name))).size < 6 && (
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-indigo-500 mt-1" />
                    <div>
                      <p className="font-medium">Enhance Muscle Group Coverage</p>
                      <p className="text-sm text-slate-600">Include exercises for more muscle groups to achieve optimal balanced development.</p>
                    </div>
                  </div>
                )}

                {/* Show if B-tier exercises are present */}
                {exercises.some(ex => {
                  const details = getExerciseDetails(ex.name);
                  return details && details.tier === 'B';
                }) && (
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-indigo-500 mt-1" />
                    <div>
                      <p className="font-medium">Upgrade Exercise Selection</p>
                      <p className="text-sm text-slate-600">Consider replacing B-tier exercises with A or A* alternatives for better results.</p>
                    </div>
                  </div>
                )}

                {/* Show if score is less than 100 */}
                {selectionScore < 100 && (
                  <div className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-yellow-500 mt-1" />
                    <div>
                      <p className="font-medium">{selectionScore >= 80 ? "Almost Perfect!" : "Room for Improvement"}</p>
                      <p className="text-sm text-slate-600">
                        {selectionScore >= 80 
                          ? "You're doing great! Follow the suggestions above to achieve a perfect score."
                          : "Follow the recommendations above to optimize your workout efficiency."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Perfect score message */}
                {selectionScore === 100 && (
                  <div className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-yellow-500 mt-1" />
                    <div>
                      <p className="font-medium">Perfect Exercise Selection! 🏆</p>
                      <p className="text-sm text-slate-600">You&apos;ve achieved an optimal balance of exercises. Keep up this excellent work!</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-start gap-2">
                <ChevronRight className="h-4 w-4 text-indigo-500 mt-1" />
                <div>
                  <p className="font-medium">Start Your Workout Journey</p>
                  <p className="text-sm text-slate-600">Begin by adding some exercises to your workout routine.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Progressing Exercises */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-500" />
            Fastest Progressing Exercises
          </h3>
          <div className="space-y-3">
            {topProgressors.map((exercise, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="h-8 w-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-sm text-slate-500">
                      {getMuscleGroup(exercise.name)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-medium">
                    +{exercise.data.volumeProgress.toFixed(1)}%
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                </div>
              </div>
            ))}
            {topProgressors.length === 0 && (
              <p className="text-sm text-slate-500 italic text-center py-4">
                Keep training consistently to see your progress trends!
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 