'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Dumbbell, Plus, Check, Camera, Upload, Smile, Meh, Frown, ChevronRight, Star, Zap , ChevronLeft , Badge, Pencil, LucideIcon, ThumbsDown, ThumbsUp, Minus, AlertCircle, Trash2, Mountain, Gauge, Target, Activity } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Confetti from 'react-confetti'
import Link from 'next/link'
import { Database } from '@/lib/database.types'
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Barbell, 
  Heartbeat,
  PersonSimpleWalk,
  Pulse,
  Brain
} from "@phosphor-icons/react"
import { checkAchievementsAfterWorkout } from '@/lib/utils/checkAchievements'

interface Set {
  weight?: number | null;
  reps?: number | null;
  duration?: number | null;
  isDropSet: boolean;
  isSetOfTheDay: boolean;
  dropsetWeight?: string;
  dropsetReps?: string;
}

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  muscle_group: string;
  image_url?: string;
  exercise_type: 'weights' | 'bodyweight' | 'time';
}

interface Workout {
  muscleGroups: string[];
  exercises: Exercise[];
  feeling: 'great' | 'okay' | 'bad';
  userWeight?: number;
}

const muscleGroups = [
  { 
    name: 'Chest', 
    icon: '/muscleGroups/chest.png'
  },
  { 
    name: 'Back', 
    icon: '/muscleGroups/back.png'
  },
  { 
    name: 'Legs', 
    icon: '/muscleGroups/legs.png'
  },
  { 
    name: 'Core', 
    icon: '/muscleGroups/core.png'
  },
  { 
    name: 'Tricep', 
    icon: '/muscleGroups/tricep.png'
  },
  { 
    name: 'Bicep', 
    icon: '/muscleGroups/bicep.png'
  },
  { 
    name: 'Shoulder', 
    icon: '/muscleGroups/shoulder.png'
  }
];

export default function NewWorkoutPage() {
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(0)
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [currentExercise, setCurrentExercise] = useState<Exercise>({ id: '', name: '', sets: [{ isDropSet: false, isSetOfTheDay: false }], muscle_group: '', exercise_type: 'weights' })
  const [isFinished, setIsFinished] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [session, setSession] = useState<any>(null)
  const supabase = createClientComponentClient<Database>()
  const buttonControls = useAnimation()
  const progressControls = useAnimation()
  const [showContinueModal, setShowContinueModal] = useState(false)
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null)
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');
  const [setErrors, setSetErrors] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [showSOTDWarning, setShowSOTDWarning] = useState(false);

  const totalSteps = 5 // Total number of steps in the workout process

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [suggestedExercises, setSuggestedExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }
    fetchSession()
  }, [supabase])

  useEffect(() => {
    const checkSavedWorkout = () => {
      const savedWorkout = localStorage.getItem('workoutProgress')
      const savedImage = localStorage.getItem('workoutImage')
      const savedStep = localStorage.getItem('workoutStep')
      
      // Check if there's meaningful data saved
      if (savedWorkout && JSON.parse(savedWorkout).exercises.length > 0) {
        setShowContinueModal(true)
      } else {
        // If no meaningful data, clear any residual data and start a new workout
        localStorage.removeItem('workoutProgress')
        localStorage.removeItem('workoutImage')
        localStorage.removeItem('workoutStep')
        setWorkout({ muscleGroups: [], exercises: [], feeling: 'okay' })
        setStep(1)
      }
    }

    checkSavedWorkout()
  }, [])

  useEffect(() => {
    if (workout) {
      localStorage.setItem('workoutProgress', JSON.stringify(workout))
      localStorage.setItem('workoutStep', step.toString())
      updateProgress()
    }
  }, [workout, step])

  useEffect(() => {
    updateProgress()
  }, [step])

  const updateProgress = () => {
    const newProgress = ((step - 1) / (totalSteps - 1)) * 100
    setProgress(Math.min(newProgress, 100))
  }

  const goToNextStep = () => {
    setStep(prevStep => Math.min(prevStep + 1, totalSteps))
  }

  const goToPreviousStep = () => {
    setStep(prevStep => Math.max(prevStep - 1, 1))
  }

  useEffect(() => {
    buttonControls.start({
      x: [0, 2, 0, -2, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })

    progressControls.start({
      width: `${progress}%`,
      transition: { duration: 0.5, ease: "easeInOut" }
    })
  }, [buttonControls, progressControls, progress])

  const toggleMuscleGroup = async (group: string) => {
    setWorkout(prev => {
      if (!prev) return { muscleGroups: [group], exercises: [], feeling: 'okay' };
      const newMuscleGroups = prev.muscleGroups.includes(group)
        ? prev.muscleGroups.filter(g => g !== group)
        : [...prev.muscleGroups, group];
      return { ...prev, muscleGroups: newMuscleGroups };
    });

    if (!workout?.muscleGroups.includes(group)) {
      const exercises = await fetchExercises(group);
      setSuggestedExercises(prevExercises => [...prevExercises, ...exercises]);
    } else {
      setSuggestedExercises(prevExercises => 
        prevExercises.filter(exercise => exercise.muscle_group !== group)
      );
    }
  }

  const handleExerciseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentExercise(prev => ({ ...prev, name: e.target.value }))
  }

  const handleSetChange = (index: number, field: keyof Set, value: string | boolean) => {
    setCurrentExercise(prev => {
      const newSets = [...prev.sets];
      if (field === 'duration' || field === 'weight' || field === 'reps') {
        newSets[index] = { ...newSets[index], [field]: parseFloat(value as string) || null };
      } else {
        newSets[index] = { ...newSets[index], [field]: value };
      }
      if (field === 'isDropSet' && value === true) {
        newSets[index].dropsetWeight = '';
        newSets[index].dropsetReps = '';
      }
      if (field === 'isSetOfTheDay' && value === true) {
        newSets.forEach((set, i) => {
          if (i !== index) set.isSetOfTheDay = false
        })
      }
      return { ...prev, sets: newSets }
    })
    // Clear error when user starts typing
    setSetErrors(prev => ({ ...prev, [index]: '' }));
  }

  const removeSet = (index: number) => {
    setCurrentExercise(prev => ({
      ...prev,
      sets: prev.sets.filter((_, i) => i !== index)
    }));
    // Remove error for the deleted set
    setSetErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  }

  const validateSets = (): boolean => {
    const newErrors: { [key: number]: string } = {};
    let isValid = true;

    currentExercise.sets.forEach((set, index) => {
      if (currentExercise.exercise_type === 'weights' && (!set.weight || !set.reps)) {
        newErrors[index] = 'Weight and reps are required for weight exercises.';
        isValid = false;
      } else if (currentExercise.exercise_type === 'bodyweight' && !set.reps) {
        newErrors[index] = 'Reps are required for bodyweight exercises.';
        isValid = false;
      } else if (currentExercise.exercise_type === 'time' && !set.duration) {
        newErrors[index] = 'Duration is required for time-based exercises.';
        isValid = false;
      }
    });

    setSetErrors(newErrors);
    return isValid;
  }

  const addSet = (isDropSet: boolean = false) => {
    setCurrentExercise(prev => ({
      ...prev,
      sets: [...prev.sets, { isDropSet, isSetOfTheDay: false }]
    }))
  }

  const saveExercise = () => {
    if (!validateSets()) {
      return; // Don't save if validation fails
    }

    if (currentExercise.name && currentExercise.sets.length > 0) {
      setWorkout(prev => {
        if (!prev) return null;
        return {
          ...prev,
          exercises: [...prev.exercises, {
            ...currentExercise,
            exercise_id: currentExercise.id
          }]
        };
      });

      setAvailableExercises(prev => prev.filter(ex => ex.id !== currentExercise.id));
      setCurrentExercise({ id: '', name: '', sets: [{ isDropSet: false, isSetOfTheDay: false }], muscle_group: '', exercise_type: 'weights' });
      setSelectedExerciseId('');
      setSetErrors({});
    }
  }

  const finishExercises = async () => {
    const hasSetOfTheDay = workout?.exercises.some(exercise =>
      exercise.sets.some(set => set.isSetOfTheDay)
    );

    if (!hasSetOfTheDay) {
      setShowSOTDWarning(true);
    } else {
      if (session?.user?.id) {
        await checkAchievementsAfterWorkout(session.user.id);
      }
      goToNextStep();
    }
  };

  const handleContinueWithoutSOTD = () => {
    setShowSOTDWarning(false);
    goToNextStep();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        if (result.startsWith('data:image')) {
          setImagePreview(result)
          setImageError(null)
          localStorage.setItem('workoutImage', result)
        } else {
          setImageError('Invalid image format')
          setImagePreview(null)
          localStorage.removeItem('workoutImage')
        }
      }
      reader.onerror = () => {
        setImageError('Error reading file')
        setImagePreview(null)
        localStorage.removeItem('workoutImage')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTakePhoto = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click()
    }
  }

  const finishWorkout = async () => {
    if (!session?.user) {
      alert('You must be logged in to save a workout.')
      return
    }

    setIsSubmitting(true)

    const supabase = createClientComponentClient<Database>()

    try {
      let image_url = null
      if (image) {
        try {
          const fileExt = image.name.split('.').pop()
          const fileName = `${Math.random()}.${fileExt}`
          const { data, error } = await supabase.storage
            .from('users-workout-img')
            .upload(fileName, image, {
              cacheControl: '3600',
              upsert: false
            })
        
          if (error) {
            console.error('Supabase storage error:', error)
            throw error
          }
          image_url = data.path
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError)
          confirm('Image upload failed. The workout will be saved without an image.')
        }
      }

      const setOfTheDay = workout?.exercises.flatMap(ex => 
        ex.sets.map(set => ({ 
          ...set, 
          exerciseName: ex.name, 
          exerciseType: ex.exercise_type 
        }))
      ).find(set => set.isSetOfTheDay);

      let sotd = '';
      if (setOfTheDay) {
        const { exerciseName, exerciseType } = setOfTheDay;
        
        if (exerciseType === 'weights') {
          sotd = `${exerciseName}: ${setOfTheDay.weight}kg x ${setOfTheDay.reps}`;
        } else if (exerciseType === 'bodyweight') {
          sotd = `${exerciseName}: ${setOfTheDay.reps} reps`;
        } else if (exerciseType === 'time') {
          sotd = `${exerciseName}: ${setOfTheDay.duration} seconds`;
        }
      }

      // Transform exercises data to properly handle dropsets
      const transformedExercises = workout?.exercises.map(exercise => ({
        exercise_id: exercise.id,
        name: exercise.name,
        sets: exercise.sets.map((set, index) => {
          // Base set data
          const baseSet = {
            set_number: index + 1,
            weight: set.weight,
            reps: set.reps,
            duration: set.duration,
            is_dropset: set.isDropSet,
            dropset_weight: null,
            dropset_reps: null
          };

          // If it's a dropset, add the dropset information
          if (set.isDropSet && set.dropsetWeight && set.dropsetReps) {
            return {
              ...baseSet,
              dropset_weight: parseFloat(set.dropsetWeight),
              dropset_reps: parseInt(set.dropsetReps)
            };
          }

          return baseSet;
        })
      }));

      // Call the stored procedure with transformed data
      const { error: transactionError } = await supabase.rpc('create_full_workout', {
        user_id: session.user.id,
        workout_date: new Date().toISOString().split('T')[0],
        muscle_group: workout?.muscleGroups.join(', '),
        feeling: workout?.feeling,
        sotd,
        image_url,
        user_weight: workout?.userWeight || null,
        exercises: transformedExercises
      })

      if (transactionError) throw transactionError

      // Set progress to 100% on successful submission
      setProgress(100)
      setIsFinished(true)
      
      // Clear localStorage after successful submission
      localStorage.removeItem('workoutProgress')
      localStorage.removeItem('workoutImage')
      localStorage.removeItem('workoutStep')
      
      // Reset other states
      setWorkout(null)
      setCurrentExercise({ id: '', name: '', sets: [{ isDropSet: false, isSetOfTheDay: false }], muscle_group: '', exercise_type: 'weights' })
      setImage(null)
      setImagePreview(null)
      setImageError(null)

    } catch (error) {
      console.error('Error submitting workout:', error)
      alert('Failed to log workout. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const FeelingEmoji = ({ feeling }: { feeling: 'great' | 'okay' | 'bad' }) => {
    switch (feeling) {
      case 'great':
        return <Smile className="h-8 w-8 text-green-500" />
      case 'okay':
        return <Meh className="h-8 w-8 text-yellow-500" />
      case 'bad':
        return <Frown className="h-8 w-8 text-red-500" />
    }
  }

  const renderSavedExercises = () => {
    return workout?.exercises.map((exercise, index) => (
      <Card key={index} className="mb-4 relative">
        <CardHeader>
          <CardTitle>{exercise.name}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => setEditingExerciseIndex(index)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {editingExerciseIndex === index ? (
            <EditExerciseForm
              exercise={exercise}
              onSave={(updatedExercise) => {
                setWorkout(prev => {
                  if (!prev) return null;
                  const newExercises = [...prev.exercises];
                  newExercises[index] = updatedExercise;
                  return { ...prev, exercises: newExercises };
                });
                setEditingExerciseIndex(null);
              }}
              onCancel={() => setEditingExerciseIndex(null)}
            />
          ) : (
            exercise.sets.map((set, setIndex) => (
              <div key={setIndex} className="flex justify-between items-center mb-2">
                <span>Set {setIndex + 1}:</span>
                {exercise.exercise_type === 'weights' && (
                  <span>{set.weight} kg x {set.reps} reps</span>
                )}
                {exercise.exercise_type === 'bodyweight' && (
                  <span>{set.reps} reps</span>
                )}
                {exercise.exercise_type === 'time' && (
                  <span>{set.duration} seconds</span>
                )}
                {set.isDropSet && <Badge>Dropset</Badge>}
                {set.isSetOfTheDay && <Badge>Set of the Day</Badge>}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    ))
  }

  const renderSetInputs = (set: Set, index: number) => {
    return (
      <div className="flex flex-col space-y-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold">Set {index + 1}</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeSet(index)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {currentExercise.exercise_type === 'weights' && (
            <>
              <div className="flex-1 min-w-[120px]">
                <Label htmlFor={`weight-${index}`}>Weight</Label>
                <Input
                  id={`weight-${index}`}
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  placeholder="Weight"
                  value={set.weight || ''}
                  onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <Label htmlFor={`reps-${index}`}>Reps</Label>
                <Input
                  id={`reps-${index}`}
                  type="number"
                  inputMode="numeric"
                  placeholder="Reps"
                  value={set.reps || ''}
                  onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                  className="w-full"
                />
              </div>
            </>
          )}
          {currentExercise.exercise_type === 'bodyweight' && (
            <div className="flex-1 min-w-[120px]">
              <Label htmlFor={`reps-${index}`}>Reps</Label>
              <Input
                id={`reps-${index}`}
                type="number"
                inputMode="numeric"
                placeholder="Reps"
                value={set.reps || ''}
                onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                className="w-full"
              />
            </div>
          )}
          {currentExercise.exercise_type === 'time' && (
            <div className="flex-1 min-w-[120px]">
              <Label htmlFor={`duration-${index}`}>Duration (seconds)</Label>
              <Input
                id={`duration-${index}`}
                type="number"
                inputMode="numeric"
                placeholder="Duration (seconds)"
                value={set.duration || ''}
                onChange={(e) => handleSetChange(index, 'duration', e.target.value)}
                className="w-full"
              />
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`dropset-${index}`}
              checked={set.isDropSet}
              onCheckedChange={(checked) => handleSetChange(index, 'isDropSet', checked as boolean)}
            />
            <Label htmlFor={`dropset-${index}`}>Dropset</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`sotd-${index}`}
              checked={set.isSetOfTheDay}
              onCheckedChange={(checked) => handleSetChange(index, 'isSetOfTheDay', checked as boolean)}
            />
            <Label htmlFor={`sotd-${index}`}>
              <Star className="h-4 w-4 text-yellow-500" />
            </Label>
          </div>
        </div>
        {set.isDropSet && (
          <div className="flex flex-wrap gap-2 items-center mt-2">
            <div className="flex-1 min-w-[120px]">
              <Label htmlFor={`dropset-weight-${index}`}>Dropset Weight</Label>
              <Input
                id={`dropset-weight-${index}`}
                type="number"
                inputMode="decimal"
                step="0.1"
                placeholder="Dropset Weight"
                value={set.dropsetWeight || ''}
                onChange={(e) => handleSetChange(index, 'dropsetWeight', e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <Label htmlFor={`dropset-reps-${index}`}>Dropset Reps</Label>
              <Input
                id={`dropset-reps-${index}`}
                type="number"
                inputMode="numeric"
                placeholder="Dropset Reps"
                value={set.dropsetReps || ''}
                onChange={(e) => handleSetChange(index, 'dropsetReps', e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        )}
        {setErrors[index] && (
          <Alert variant="destructive" className="mt-2 w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{setErrors[index]}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  const renderStep = () => {
    const BackButton = () => (
      <Button
        variant="outline"
        size="sm"
        onClick={goToPreviousStep}
        className="mb-4"
        disabled={step === 1}
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Back
      </Button>
    )

    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Choose Muscle Groups</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {muscleGroups.map((group) => (
                  <Button
                    key={group.name}
                    onClick={() => toggleMuscleGroup(group.name)}
                    variant={workout?.muscleGroups.includes(group.name) ? "default" : "outline"}
                    className={`h-28 flex flex-col items-center justify-center gap-3 ${
                      workout?.muscleGroups.includes(group.name) ? 'bg-blue-500 text-white' : ''
                    }`}
                  >
                    <Image 
                      src={group.icon}
                      alt={`${group.name} icon`}
                      width={48}
                      height={48}
                      className="mb-1"
                    />
                    {group.name}
                  </Button>
                ))}
              </div>
              <motion.div animate={buttonControls}>
                <Button 
                  onClick={() => goToNextStep()} 
                  className="w-full mt-4"
                  disabled={workout?.muscleGroups.length === 0}
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        )
      case 2:
        return (
          <div className="space-y-6">
            <Card className="relative">
              <BackButton />
              <CardHeader>
                <CardTitle>Add New Exercise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select onValueChange={handleExerciseSelect} value={selectedExerciseId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an exercise" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[300px]">
                      {workout?.muscleGroups.map((group, index) => (
                        <div key={group}>
                          {index > 0 && <Separator className="my-2" />}
                          <SelectItem 
                            value={`group-${group}`} 
                            disabled 
                            className="font-semibold text-primary"
                          >
                            {group}
                          </SelectItem>
                          {availableExercises
                            .filter(exercise => exercise.muscle_group === group)
                            .map(exercise => (
                              <SelectItem 
                                key={exercise.id} 
                                value={exercise.id} 
                                className="pl-4 cursor-pointer hover:bg-gray-100 data-[state=checked]:bg-gray-200 transition-colors"
                              >
                                {exercise.name}
                              </SelectItem>
                            ))}
                        </div>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                
                {currentExercise.name && (
                  <>
                    <Input
                      placeholder="Exercise name"
                      value={currentExercise.name}
                      onChange={handleExerciseNameChange}
                      disabled
                    />
                    <AnimatePresence>
                      {currentExercise.sets.map((set, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="flex space-x-2 items-center"
                        >
                          {renderSetInputs(set, index)}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div className="flex space-x-2">
                      <Button onClick={() => addSet()} variant="outline" className="w-1/2">
                        <Plus className="mr-2 h-4 w-4" /> Add Set
                      </Button>
                      <Button onClick={() => addSet(true)} variant="outline" className="w-1/2">
                        <Zap className="mr-2 h-4 w-4" /> Add Dropset
                      </Button>
                    </div>
                    <Button onClick={saveExercise} className="w-full bg-green-500 hover:bg-green-600 text-white">
                      <Check className="mr-2 h-4 w-4" /> Save Exercise
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {workout?.exercises && workout.exercises.length > 0 && (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-center mb-3">Exercise Tally</h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    {workout.muscleGroups.map(group => {
                      const count = workout.exercises.filter(ex => ex.muscle_group === group).length;
                      const muscleGroupIcon = muscleGroups.find(mg => mg.name === group)?.icon;
                      const Icon = muscleGroupIcon || Dumbbell;
                      
                      return (
                        <div 
                          key={group}
                          className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-100"
                        >
                          <Image 
                            src={muscleGroupIcon || '/muscleGroups/default.png'}
                            alt={`${group} icon`}
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                          <span className="font-medium text-gray-700">{group}:</span>
                          <span className="text-lg font-bold text-primary">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Current Exercises</h3>
                  {renderSavedExercises()}
                </div>
              </>
            )}

            {(workout?.exercises?.length ?? 0) > 0 && (
              <Button onClick={finishExercises} className="w-full">
                Finish Exercises <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )
      case 3:
        return (
          <Card className="relative">
            <BackButton />
            <CardHeader>
              <CardTitle>Workout Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-60 overflow-y-auto">
                {workout?.exercises.map((exercise, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="mb-2 p-2 bg-gray-100 rounded-lg"
                  >
                    <h3 className="font-bold text-lg flex items-center">
                      <Dumbbell className="mr-2 h-5 w-5 text-gray-600" />
                      {exercise.name}
                    </h3>
                    <ul className="list-disc pl-5 text-sm">
                      {exercise.sets.map((set, setIndex) => (
                        <li key={setIndex} className="flex items-center space-x-2">
                          {exercise.exercise_type === 'weights' && (
                            <span>{set.weight}kg x {set.reps}</span>
                          )}
                          {exercise.exercise_type === 'bodyweight' && (
                            <span>{set.reps} reps</span>
                          )}
                          {exercise.exercise_type === 'time' && (
                            <span>{set.duration} seconds</span>
                          )}
                          {set.isDropSet && (
                            <span className="text-blue-500">
                              → {set.dropsetWeight}kg x {set.dropsetReps} (Dropset)
                            </span>
                          )}
                          {set.isSetOfTheDay && <Star className="h-4 w-4 text-yellow-500" />}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
              <div className="border-t pt-4 mt-6">
                <div className="space-y-4 flex flex-col items-center text-center">
                  <h3 className="text-lg font-medium">Have you tracked your weight today?</h3>
                  <div className="flex gap-4">
                    <Button 
                      variant={showWeightInput ? "default" : "outline"}
                      onClick={() => setShowWeightInput(true)}
                      className={`w-24 ${
                        showWeightInput 
                          ? "bg-green-500 hover:bg-green-600 text-white border-green-600" 
                          : "hover:border-green-500 hover:text-green-500"
                      }`}
                    >
                      Yes
                    </Button>
                    <Button 
                      variant={!showWeightInput ? "default" : "outline"}
                      onClick={() => {
                        setShowWeightInput(false);
                        setWorkout(prev => prev ? { ...prev, userWeight: undefined } : null);
                      }}
                      className={`w-24 ${
                        !showWeightInput 
                          ? "bg-red-500 hover:bg-red-600 text-white border-red-600" 
                          : "hover:border-red-500 hover:text-red-500"
                      }`}
                    >
                      No
                    </Button>
                  </div>

                  {showWeightInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 w-full max-w-[300px]"
                    >
                      <Label htmlFor="weight-input" className="flex items-center justify-center gap-2">
                        <Gauge className="h-4 w-4" />
                        Enter your weight
                      </Label>
                      <div className="flex items-center justify-center gap-2">
                        <Input
                          id="weight-input"
                          type="number"
                          step="0.1"
                          inputMode="decimal"
                          placeholder="Enter weight"
                          value={workout?.userWeight || ''}
                          onChange={(e) => setWorkout(prev => 
                            prev ? { 
                              ...prev, 
                              userWeight: e.target.value ? parseFloat(e.target.value) : undefined 
                            } : null
                          )}
                          className="max-w-[200px] text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-sm text-muted-foreground">kg</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
              <Button onClick={() => goToNextStep()} className="w-full">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )
      case 4:
        return (
          <Card className="relative">
            <BackButton />
            <CardContent className="p-6">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-6 text-center text-primary"
              >
                How was your workout today?
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { type: 'bad', icon: ThumbsDown, label: 'Challenging Day', description: 'Weights feeling heavy, struggled with sets', color: 'red' },
                  { type: 'okay', icon: Meh, label: 'Steady Session', description: 'Weights moving consistently, maintained performance', color: 'primary' },
                  { type: 'great', icon: ThumbsUp, label: 'Energized Workout', description: 'Feeling strong, possibly hit new personal bests', color: 'green' },
                ].map((feeling) => (
                  <motion.div
                    key={feeling.type}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-300 h-full flex flex-col ${
                        workout?.feeling === feeling.type
                          ? `ring-2 ring-${feeling.color}-500 shadow-lg`
                          : "hover:shadow-md"
                      }`}
                      onClick={() => setWorkout(prev => prev ? { ...prev, feeling: feeling.type as 'bad' | 'okay' | 'great' } : null)}
                    >
                      <CardContent className="p-6 flex flex-col items-center text-center flex-grow">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="mb-4"
                        >
                          <feeling.icon
                            className={`h-16 w-16 ${
                              workout?.feeling === feeling.type ? `text-${feeling.color}-500` : "text-muted-foreground"
                            }`}
                          />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2">{feeling.label}</h3>
                        <p className="text-muted-foreground flex-grow">{feeling.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex justify-center"
              >
                <Button
                  size="lg"
                  disabled={!workout?.feeling}
                  onClick={() => goToNextStep()}
                  className="px-8 py-2 text-lg"
                >
                  Continue
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        )
      case 5:
        return (
          <Card className="relative">
            <BackButton />
            <CardHeader>
              <CardTitle>Workout Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                {imagePreview ? (
                  <div className="relative w-full h-64">
                    {imageError ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                        <p className="text-red-500">{imageError}</p>
                      </div>
                    ) : (
                      <Image 
                        src={imagePreview} 
                        alt="Workout preview" 
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                        onError={() => setImageError('Error loading image')}
                      />
                    )}
                    <Button
                      onClick={() => {
                        setImage(null)
                        setImagePreview(null)
                        setImageError(null)
                        localStorage.removeItem('workoutImage')
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex space-x-4">
                      <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                        <Upload className="mr-2 h-4 w-4" /> Upload Photo
                      </Button>
                      <Button onClick={handleTakePhoto} variant="outline">
                        <Camera className="mr-2 h-4 w-4" /> Take Photo
                      </Button>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageUpload}
                      className="hidden"
                      ref={cameraInputRef}
                    />
                  </>
                )}
              </div>
              <Button 
                onClick={finishWorkout} 
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Dumbbell className="h-4 w-4" />
                    </motion.div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Dumbbell className="mr-2 h-4 w-4" /> Finish Workout
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  const handleContinueWorkout = () => {
    setShowContinueModal(false)
    // Load saved workout data
    const savedWorkout = localStorage.getItem('workoutProgress')
    const savedImage = localStorage.getItem('workoutImage')
    const savedStep = localStorage.getItem('workoutStep')
    if (savedWorkout) {
      setWorkout(JSON.parse(savedWorkout))
    }
    if (savedImage) {
      setImagePreview(savedImage)
    }
    if (savedStep) {
      setStep(parseInt(savedStep))
    }
  }

  const handleStartNewWorkout = () => {
    setShowContinueModal(false)
    // Clear saved data
    localStorage.removeItem('workoutProgress')
    localStorage.removeItem('workoutImage')
    localStorage.removeItem('workoutStep')
    // Initialize new workout
    setWorkout({ muscleGroups: [], exercises: [], feeling: 'okay' })
    setStep(1)
  }

  const EditExerciseForm = ({ exercise, onSave, onCancel }: { exercise: Exercise; onSave: (exercise: Exercise) => void; onCancel: () => void }) => {
    const [editedExercise, setEditedExercise] = useState(exercise);
    const [availableExercisesForEdit, setAvailableExercisesForEdit] = useState<Exercise[]>([]);

    useEffect(() => {
      const fetchExercisesForEdit = async () => {
        try {
          // Fetch exercises specifically for this muscle group
          const response = await fetch(`/api/exercises?muscleGroup=${encodeURIComponent(exercise.muscle_group)}`);
          if (!response.ok) throw new Error('Failed to fetch exercises');
          
          const exercises = await response.json();
          
          // Filter exercises to only include those matching the current muscle group
          const filteredExercises = exercises.filter((ex: Exercise) => 
            ex.muscle_group.toLowerCase() === exercise.muscle_group.toLowerCase()
          );
          
          setAvailableExercisesForEdit(filteredExercises);
        } catch (error) {
          console.error('Error fetching exercises:', error);
        }
      };

      fetchExercisesForEdit();
    }, [exercise.muscle_group]);

    const handleSetChange = (index: number, field: keyof Set, value: string | boolean) => {
      const newSets = [...editedExercise.sets];
      if (field === 'duration' || field === 'weight' || field === 'reps') {
        newSets[index] = { ...newSets[index], [field]: parseFloat(value as string) || null };
      } else {
        newSets[index] = { ...newSets[index], [field]: value };
      }
      setEditedExercise({ ...editedExercise, sets: newSets });
    };

    const handleExerciseChange = (exerciseId: string) => {
      const selectedExercise = availableExercisesForEdit.find(ex => ex.id === exerciseId);
      if (selectedExercise) {
        setEditedExercise(prev => ({
          ...prev,
          id: selectedExercise.id,
          name: selectedExercise.name,
          exercise_type: selectedExercise.exercise_type,
          muscle_group: selectedExercise.muscle_group // Maintain the muscle group
        }));
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Label>Current Muscle Group:</Label>
          <span className="font-medium">{exercise.muscle_group}</span>
        </div>
        
        <Select 
          value={editedExercise.id} 
          onValueChange={handleExerciseChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Select ${exercise.muscle_group} Exercise`} />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-[200px]">
              {availableExercisesForEdit.map(ex => (
                <SelectItem key={ex.id} value={ex.id}>
                  {ex.name}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>

        {editedExercise.sets.map((set, index) => (
          <div key={index} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {editedExercise.exercise_type === 'weights' && (
                <>
                  <div className="flex-1 min-w-[120px]">
                    <Label htmlFor={`edit-weight-${index}`}>Weight</Label>
                    <Input
                      id={`edit-weight-${index}`}
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      placeholder="Weight"
                      value={set.weight || ''}
                      onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <Label htmlFor={`edit-reps-${index}`}>Reps</Label>
                    <Input
                      id={`edit-reps-${index}`}
                      type="number"
                      inputMode="numeric"
                      placeholder="Reps"
                      value={set.reps || ''}
                      onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </>
              )}
              {editedExercise.exercise_type === 'bodyweight' && (
                <div className="flex-1 min-w-[120px]">
                  <Label htmlFor={`edit-reps-${index}`}>Reps</Label>
                  <Input
                    id={`edit-reps-${index}`}
                    type="number"
                    inputMode="numeric"
                    placeholder="Reps"
                    value={set.reps || ''}
                    onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                    className="w-full"
                  />
                </div>
              )}
              {editedExercise.exercise_type === 'time' && (
                <div className="flex-1 min-w-[120px]">
                  <Label htmlFor={`edit-duration-${index}`}>Duration (seconds)</Label>
                  <Input
                    id={`edit-duration-${index}`}
                    type="number"
                    inputMode="numeric"
                    placeholder="Duration (seconds)"
                    value={set.duration || ''}
                    onChange={(e) => handleSetChange(index, 'duration', e.target.value)}
                    className="w-full"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`edit-dropset-${index}`}
                  checked={set.isDropSet}
                  onCheckedChange={(checked) => handleSetChange(index, 'isDropSet', checked as boolean)}
                />
                <Label htmlFor={`edit-dropset-${index}`}>Dropset</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`edit-sotd-${index}`}
                  checked={set.isSetOfTheDay}
                  onCheckedChange={(checked) => handleSetChange(index, 'isSetOfTheDay', checked as boolean)}
                />
                <Label htmlFor={`edit-sotd-${index}`}>
                  <Star className="h-4 w-4 text-yellow-500" />
                </Label>
              </div>
            </div>
            {set.isDropSet && (
              <div className="flex flex-wrap gap-2">
                <div className="flex-1 min-w-[120px]">
                  <Label htmlFor={`edit-dropset-weight-${index}`}>Dropset Weight</Label>
                  <Input
                    id={`edit-dropset-weight-${index}`}
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    placeholder="Dropset Weight"
                    value={set.dropsetWeight || ''}
                    onChange={(e) => handleSetChange(index, 'dropsetWeight', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <Label htmlFor={`edit-dropset-reps-${index}`}>Dropset Reps</Label>
                  <Input
                    id={`edit-dropset-reps-${index}`}
                    type="number"
                    inputMode="numeric"
                    placeholder="Dropset Reps"
                    value={set.dropsetReps || ''}
                    onChange={(e) => handleSetChange(index, 'dropsetReps', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
        <div className="flex space-x-2">
          <Button onClick={() => onSave(editedExercise)}>Save</Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    );
  };

  const handleExerciseSelect = (exerciseId: string) => {
    const selectedExercise = availableExercises.find(ex => ex.id === exerciseId);
    if (selectedExercise) {
      setCurrentExercise({
        id: selectedExercise.id,
        name: selectedExercise.name,
        sets: [{ isDropSet: false, isSetOfTheDay: false }],
        muscle_group: selectedExercise.muscle_group,
        exercise_type: selectedExercise.exercise_type
      });
      setSelectedExerciseId(exerciseId);
    }
  };

  useEffect(() => {
    if (selectedMuscleGroup) {
      fetchExercises(selectedMuscleGroup);
    }
  }, [selectedMuscleGroup]);

  const fetchExercises = async (muscleGroup: string): Promise<Exercise[]> => {
    try {
      const response = await fetch(`/api/exercises?muscleGroup=${encodeURIComponent(muscleGroup)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
      return [];
    }
  };

  useEffect(() => {
    if (workout?.muscleGroups.length) {
      fetchExercisesForMuscleGroups(workout.muscleGroups);
    }
  }, [workout?.muscleGroups]);

  const fetchExercisesForMuscleGroups = async (muscleGroups: string[]) => {
    const response = await fetch(`/api/exercises?muscleGroups=${muscleGroups.join(',')}`);
    if (response.ok) {
      const exercises = await response.json();
      // Filter out exercises that are already in the workout
      const availableExercises = exercises.filter(
        (exercise: Exercise) => !workout?.exercises.some(ex => ex.id === exercise.id)
      );
      setAvailableExercises(availableExercises);
    } else {
      console.error('Failed to fetch exercises');
    }
  };

  const renderMuscleGroupIcon = (group: string) => {
    const muscleGroup = muscleGroups.find(mg => mg.name === group);
    if (!muscleGroup) return null;

    return (
      <Image 
        src={muscleGroup.icon}
        alt={`${muscleGroup.name} icon`}
        width={24}
        height={24}
        className="object-contain"
      />
    );
  };

  const renderMuscleTally = () => {
    return (
      <div className="flex flex-wrap gap-2">
        {workout?.muscleGroups.map(group => {
          const count = workout.exercises.filter(ex => ex.muscle_group === group).length;
          const muscleGroup = muscleGroups.find(mg => mg.name === group);
          
          return (
            <div 
              key={group}
              className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md shadow-sm border border-gray-100"
            >
              <Image 
                src={muscleGroup?.icon || '/muscleGroups/default.png'}
                alt={`${group} icon`}
                width={16}
                height={16}
                className="object-contain"
              />
              <span className="text-sm font-medium text-gray-700">{group}:</span>
              <span className="text-sm font-bold text-primary">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-4rem)] overflow-auto pb-20">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Log Your Workout
      </h1>
      <div className="mb-6">
        <Progress value={progress} className="w-full h-2" />
      </div>
      {!isFinished ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center h-full"
        >
          <Confetti />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Workout Complete!</h2>
          <p className="text-xl text-center mb-8 text-gray-600">Great job on your workout. Keep up the good work!</p>
          <motion.div animate={buttonControls}>
            <Button asChild className="w-full max-w-md bg-blue-500 hover:bg-blue-600 text-white">
              <Link href="/progress">View Your Progress</Link>
            </Button>
          </motion.div>
        </motion.div>
      )}

<Dialog open={showContinueModal} onOpenChange={setShowContinueModal}>
  <DialogContent className="bg-white text-black border border-gray-300 p-6 rounded-lg shadow-lg">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold text-gray-900">Continue Previous Workout?</DialogTitle>
      <DialogDescription className="text-gray-600 mt-2">
        You have a saved workout in progress. Would you like to continue or start a new one?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="mt-6 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleStartNewWorkout}
        className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100"
      >
        Start New Workout
      </Button>
      <Button
        type="button"
        onClick={handleContinueWorkout}
        className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white"
      >
        Continue Workout
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

<Dialog open={showSOTDWarning} onOpenChange={setShowSOTDWarning}>
  <DialogContent className="bg-white text-black border border-gray-300 p-6 rounded-lg shadow-lg">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
        <Star className="h-6 w-6 text-yellow-500 mr-2" />
        No Set of the Day Selected
      </DialogTitle>
      <DialogDescription className="text-gray-600 mt-2">
        You haven&apos;t selected a &quot;Set of the Day&quot;. Would you like to continue without selecting one, or go back and choose one now?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="mt-6 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => setShowSOTDWarning(false)}
        className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100"
      >
        Go Back
      </Button>
      <Button
        type="button"
        onClick={handleContinueWithoutSOTD}
        className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white"
      >
        Continue Without
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  )
}
