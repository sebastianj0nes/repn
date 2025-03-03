'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWorkoutAnalysis } from '@/lib/hooks/useWorkoutAnalysis'
import { 
  Activity,
  Dumbbell,
  Calendar,
  Award,
  InfoIcon,
  LineChart,
  BarChart,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  RotateCcw,
  Target,
  ChevronDown,
  ChevronUp,
  Trophy,
  AlertOctagon,
  AlertCircle
} from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { format, subDays } from 'date-fns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProgressChart } from "@/components/ProgressChart"
import { StatsCard } from "@/components/StatsCard"
import { VolumeDistributionChart } from "@/components/workout/VolumeDistributionChart"
import { RecoveryPatternChart } from "@/components/workout/RecoveryPatternChart"
import { ExerciseImpactCard } from "@/components/workout/ExerciseImpactCard"
import { 
  detectPlateau, 
  calculateOptimalSets, 
  calculateStrengthProgressionTimeline, 
  getAlternativeExercises, 
  MUSCLE_GROUPS 
} from '@/lib/utils/workoutAnalysis'
import Image from 'next/image'
import { 
  backExercises, 
  chestExercises, 
  shoulderExercises, 
  bicepExercises,
  tricepExercises,
  coreExercises,
  legExercises
} from '@/lib/utils/exerciseImages'
import { ImpactSection } from "@/components/workout/ImpactSection"
import { PlateauAlert } from "./PlateauAlert"
import { getPrioritizedPlateaus } from '@/lib/utils/workoutAnalysis'
import { cn } from "@/lib/utils"
import { LoadingCard } from '@/components/ui/loading-card'

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
        <p className="text-sm text-center">{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const getExerciseGifPath = (exerciseName: string): string | undefined => {
  const allExercises = {
    ...backExercises,
    ...chestExercises,
    ...shoulderExercises,
    ...bicepExercises,
    ...tricepExercises,
    ...coreExercises,
    ...legExercises
  };
  
  return allExercises[exerciseName as keyof typeof allExercises];
};

export function InsightsPanel() {
  const { data: analysis, isLoading } = useWorkoutAnalysis()
  const [selectedExercise, setSelectedExercise] = useState<string>('')
  const [selectedInsight, setSelectedInsight] = useState<string>('progressive')
  const [isOpen, setIsOpen] = useState(false)
  const [showAllPlateaus, setShowAllPlateaus] = useState(false)
  const [showAllCritical, setShowAllCritical] = useState(false)
  const [showAllMedium, setShowAllMedium] = useState(false)

  if (isLoading || !analysis) return <LoadingCard />

  // Get top exercises by volume progress
  const topExercises = Object.entries(analysis.progressStats.exerciseProgress)
    .sort(([, a], [, b]) => b.volumeProgress - a.volumeProgress)
    .slice(0, 5)
    .map(([name]) => name);

  // Get exercises that need attention (plateaued or decreasing)
  const needsAttention = Object.entries(analysis.progressStats.exerciseProgress)
    .filter(([, data]) => data.volumeProgress < 0 || data.trend === 'neutral')
    .slice(0, 3)
    .map(([name]) => name);

  // Calculate recovery patterns
  const muscleGroupRecovery = analysis.workouts.reduce((acc, workout) => {
    const date = new Date(workout.date);
    const muscleGroups = workout.muscle_group.split(',').map(g => g.trim());
    
    muscleGroups.forEach(group => {
      if (!acc[group]) acc[group] = [];
      acc[group].push(date);
    });
    
    return acc;
  }, {} as Record<string, Date[]>);

  // Add these logs before the plateauedExercises calculation
  console.log('Exercise Progress:', analysis.progressStats.exerciseProgress);
  console.log('Exercise Types:', analysis.exerciseTypes);

  const plateauedExercises = getPrioritizedPlateaus(
    analysis.progressStats.exerciseProgress,
    analysis.exerciseTypes
  );

  console.log('Plateaued Exercises Result:', plateauedExercises);

  // Get unique muscle groups for the preview
  const uniqueMuscleGroups = Array.from(new Set(analysis.workouts.flatMap(w => 
    w.muscle_group.split(',').map(g => g.trim())
  )));

  // Calculate meaningful stats
  const issueCount = getPrioritizedPlateaus(
    analysis.progressStats.exerciseProgress,
    analysis.exerciseTypes
  ).length

  // Calculate most improved exercise
  const mostImproved = Object.entries(analysis.progressStats.exerciseProgress)
    .sort(([, a], [, b]) => b.volumeProgress - a.volumeProgress)[0];
  
  return (
    <Card className="overflow-hidden border-none shadow-sm bg-gradient-to-br from-slate-50 to-white">
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : '56px' }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        {/* Header Section */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between p-3 cursor-pointer hover:bg-black/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <h2 className="font-medium text-sm">Workout Insights</h2>
          </div>
          <ChevronDown 
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-300",
              isOpen && "transform rotate-180"
            )} 
          />
        </div>

        {/* Content Section with improved tab layout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="border-t"
        >
          <div className="p-4">
            <Tabs defaultValue="progressive" onValueChange={setSelectedInsight}>
              <TabsList className="grid w-full grid-cols-3 h-9 mb-4">
                <TabsTrigger 
                  value="progressive" 
                  className="flex items-center gap-1.5 px-2 text-xs sm:text-sm"
                >
                  <LineChart className="h-3.5 w-3.5" />
                  <span className="truncate">Overload</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="volume" 
                  className="flex items-center gap-1.5 px-2 text-xs sm:text-sm"
                >
                  <BarChart className="h-3.5 w-3.5" />
                  <span className="truncate">Volume</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="selection" 
                  className="flex items-center gap-1.5 px-2 text-xs sm:text-sm"
                >
                  <Dumbbell className="h-3.5 w-3.5" />
                  <span className="truncate">Impact</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="progressive" className="space-y-4">
                <Card className="border-2 border-red-500/20">
                  <CardHeader className="px-4 py-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="h-5 w-5 text-red-500" />
                      <span className="truncate">Exercise Progress & Recommendations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    {plateauedExercises.length > 0 ? (
                      <div className="space-y-4">
                        {/* Critical Issues Section */}
                        {(() => {
                          const criticalIssues = plateauedExercises.filter(p => p.status.severity === 'critical')
                          if (criticalIssues.length === 0) return null
                          
                          return (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertOctagon className="h-4 w-4 text-red-500 flex-shrink-0" />
                                <h4 className="text-sm font-medium text-red-700 truncate">
                                  Critical Issues ({criticalIssues.length})
                                </h4>
                              </div>
                              <div className="space-y-3 w-full">
                                {criticalIssues.slice(0, 3).map((plateau) => (
                                  <div key={plateau.exerciseName} className="w-full">
                                    <PlateauAlert
                                      status={plateau.status}
                                      exerciseName={plateau.exerciseName}
                                      exerciseGif={getExerciseGifPath(plateau.exerciseName)}
                                      muscleGroup={analysis.exerciseLibrary[plateau.exerciseName]?.muscle_group || 'Other'}
                                      priority="high"
                                      exerciseData={analysis.progressStats.exerciseProgress[plateau.exerciseName]}
                                    />
                                  </div>
                                ))}
                                {criticalIssues.length > 3 && (
                                  <Button 
                                    variant="outline" 
                                    className="w-full text-sm border-red-200 text-red-700 hover:bg-red-50"
                                    onClick={() => setShowAllCritical(prev => !prev)}
                                  >
                                    <span>
                                      {showAllCritical ? 'Show Less' : `${criticalIssues.length - 3} More Critical Issues`}
                                    </span>
                                    {showAllCritical ? 
                                      <ChevronUp className="h-4 w-4 ml-2" /> : 
                                      <ChevronDown className="h-4 w-4 ml-2" />
                                    }
                                  </Button>
                                )}
                                {showAllCritical && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-3"
                                  >
                                    {criticalIssues.slice(3).map((plateau) => (
                                      <PlateauAlert
                                        key={plateau.exerciseName}
                                        status={plateau.status}
                                        exerciseName={plateau.exerciseName}
                                        exerciseGif={getExerciseGifPath(plateau.exerciseName)}
                                        muscleGroup={analysis.exerciseLibrary[plateau.exerciseName]?.muscle_group || 'Other'}
                                        priority="high"
                                        exerciseData={analysis.progressStats.exerciseProgress[plateau.exerciseName]}
                                      />
                                    ))}
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          )
                        })()}

                        {/* Moderate Issues Section */}
                        {(() => {
                          const moderateIssues = plateauedExercises.filter(p => p.status.severity === 'concern')
                          if (moderateIssues.length === 0) return null
                          
                          return (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                                <h4 className="text-sm font-medium text-yellow-700 truncate">
                                  Moderate Issues ({moderateIssues.length})
                                </h4>
                              </div>
                              <div className="space-y-3 w-full">
                                {moderateIssues.slice(0, 3).map((plateau) => (
                                  <div key={plateau.exerciseName} className="w-full">
                                    <PlateauAlert
                                      status={plateau.status}
                                      exerciseName={plateau.exerciseName}
                                      exerciseGif={getExerciseGifPath(plateau.exerciseName)}
                                      muscleGroup={analysis.exerciseLibrary[plateau.exerciseName]?.muscle_group || 'Other'}
                                      priority="medium"
                                      exerciseData={analysis.progressStats.exerciseProgress[plateau.exerciseName]}
                                    />
                                  </div>
                                ))}
                                {moderateIssues.length > 3 && (
                                  <Button 
                                    variant="outline" 
                                    className="w-full text-sm border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                                    onClick={() => setShowAllMedium(prev => !prev)}
                                  >
                                    <span>
                                      {showAllMedium ? 'Show Less' : `${moderateIssues.length - 3} More Moderate Issues`}
                                    </span>
                                    {showAllMedium ? 
                                      <ChevronUp className="h-4 w-4 ml-2" /> : 
                                      <ChevronDown className="h-4 w-4 ml-2" />
                                    }
                                  </Button>
                                )}
                                {showAllMedium && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-3"
                                  >
                                    {moderateIssues.slice(3).map((plateau) => (
                                      <PlateauAlert
                                        key={plateau.exerciseName}
                                        status={plateau.status}
                                        exerciseName={plateau.exerciseName}
                                        exerciseGif={getExerciseGifPath(plateau.exerciseName)}
                                        muscleGroup={analysis.exerciseLibrary[plateau.exerciseName]?.muscle_group || 'Other'}
                                        priority="medium"
                                        exerciseData={analysis.progressStats.exerciseProgress[plateau.exerciseName]}
                                      />
                                    ))}
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        <Trophy className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <p>Great work! All exercises are showing good progress.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="volume" className="space-y-6">
                <Card className="border-2 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-purple-500" />
                        <span>Muscle Group Balance</span>
                      </div>
                      <InfoTooltip content="See how your training volume is distributed across muscle groups" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <VolumeDistributionChart workouts={analysis.workouts} />
                    
                    <div className="mt-6">
                      <div className="grid grid-cols-1 gap-3">
                        
                        
                        {/* Underworked muscle groups */}
                        {Object.entries(muscleGroupRecovery)
                          .filter(([, dates]) => (dates.length / analysis.workouts.length) * 100 < 10)
                          .slice(0, 2)
                          .map(([group]) => (
                            <div key={group} className="p-3 rounded-lg bg-red-50">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                                  <span className="font-medium text-red-800">Needs More Volume</span>
                                </div>
                                <Badge variant="outline" className="bg-white">
                                  {group}
                                </Badge>
                              </div>
                            </div>
                          ))}
                          
                        {/* Recommendation */}
                        <div className="p-3 rounded-lg bg-blue-50">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Pro tip:</span> Aim for balanced training across all muscle groups, with slightly higher volume for lagging areas.
                          </p>
                        </div>
                      </div>
                    </div>

                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-500" />
                        <span>Recovery Patterns</span>
                      </div>
                      <InfoTooltip content="Analyze your recovery time between muscle groups" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RecoveryPatternChart workouts={analysis.workouts} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="selection" className="space-y-6">
                    <ImpactSection exercises={Object.entries(analysis.progressStats.exerciseProgress).map(([name, data]) => ({
                      name,
                      data
                    }))} />
              </TabsContent>
            </Tabs>
        </div>
        </motion.div>
      </motion.div>
    </Card>
  )
} 