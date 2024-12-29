'use client'

import { useState, useRef, useContext, useEffect } from 'react'
import { UserContext } from '@/app/UserContext'
import { motion, AnimatePresence } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { format, isSameDay, isFuture, startOfDay } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import Confetti from 'react-confetti'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { checkAchievementsAfterWorkout } from '@/lib/utils/checkAchievements';

// Lucide Icons
import { 
  CalendarIcon,
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Star, 
  Trash2, 
  Timer,
  Activity,
  Target,
  Dumbbell,
  Smile,
  Meh,
  Frown,
  Upload,
  Camera,
  Pencil
} from 'lucide-react'

// Phosphor Icons
import { 
  Barbell, 
  PersonSimpleWalk 
} from '@phosphor-icons/react'

// UI Components
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface Set {
  weight?: string;
  reps?: string;
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
  exercise_type: 'weights' | 'bodyweight' | 'time';
  image_url?: string;
}

interface Workout {
  date: Date;
  muscleGroups: string[];
  exercises: Exercise[];
  feeling: 'great' | 'okay' | 'bad';
  userWeight?: number;
}

const muscleGroups = [
  { name: 'Chest', icon: '/muscleGroups/chest.png' },
  { name: 'Back', icon: '/muscleGroups/back.png' },
  { name: 'Legs', icon: '/muscleGroups/legs.png' },
  { name: 'Core', icon: '/muscleGroups/core.png' },
  { name: 'Tricep', icon: '/muscleGroups/tricep.png' },
  { name: 'Bicep', icon: '/muscleGroups/bicep.png' },
  { name: 'Shoulder', icon: '/muscleGroups/shoulder.png' }
];

export default function LogPastWorkoutPage() {
  const supabase = createClientComponentClient()
  const session  = useContext(UserContext)
  const [step, setStep] = useState(1)
  const [workout, setWorkout] = useState<Workout>({ 
    date: undefined as unknown as Date,
    muscleGroups: [], 
    exercises: [], 
    feeling: 'okay' 
  })
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    id: '',
    name: '',
    sets: [{ weight: '', reps: '', isDropSet: false, isSetOfTheDay: false }],
    muscle_group: '',
    exercise_type: 'weights'
  })
  const [isFinished, setIsFinished] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [daysWithWorkouts, setDaysWithWorkouts] = useState<string[]>([])
  const [personalBest, setPersonalBest] = useState<string | null>(null)
  const [showWeightInput, setShowWeightInput] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const [showSotdReminder, setShowSotdReminder] = useState(false)
  const [isSkippingSotd, setIsSkippingSotd] = useState(false)

  const checkWorkoutExists = async (date: Date) => {
    const { data, error } = await supabase
      .from('workouts')
      .select('id')
      .eq('date', format(date, 'yyyy-MM-dd'))
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking workout:', error)
    }

    return !!data
  }

  const handleDateChange = async (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const hasWorkout = await checkWorkoutExists(selectedDate)
      if (hasWorkout) {
        alert('A workout already exists for this date')
        return
      }
      setWorkout(prev => ({ ...prev, date: selectedDate }))
      setDate(selectedDate)
      setIsCalendarOpen(false)
    }
  }

  const isDateInFuture = (date: Date) => {
    return isFuture(startOfDay(date))
  }

  const handleMuscleGroupChange = (value: string) => {
    setWorkout(prev => {
      const muscleGroups = prev.muscleGroups.includes(value)
        ? prev.muscleGroups.filter(group => group !== value)
        : [...prev.muscleGroups, value]
      return { ...prev, muscleGroups }
    })
  }

  const handleExerciseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentExercise(prev => ({ ...prev, name: e.target.value }))
  }

  const handleSetChange = (index: number, field: keyof Set, value: string | boolean) => {
    setCurrentExercise(prev => {
      const newSets = [...prev.sets]
      newSets[index] = { ...newSets[index], [field]: value }
      if (field === 'isSetOfTheDay' && value === true) {
        newSets.forEach((set, i) => {
          if (i !== index) set.isSetOfTheDay = false
        })
      }
      return { ...prev, sets: newSets }
    })
  }

  const addSet = () => {
    const newSet: Set = {
      weight: '',
      reps: '',
      duration: null,
      isDropSet: false,
      isSetOfTheDay: false,
      dropsetWeight: '',
      dropsetReps: ''
    };
    
    setCurrentExercise(prev => ({
      ...prev,
      sets: [...prev.sets, newSet]
    }));
  };

  const saveExercise = () => {
    if (isExerciseValid(currentExercise)) {
      setWorkout(prev => ({
        ...prev,
        exercises: [...prev.exercises, currentExercise]
      }));
      setCurrentExercise({
        id: '',
        name: '',
        sets: [{ weight: '', reps: '', isDropSet: false, isSetOfTheDay: false }],
        muscle_group: '',
        exercise_type: 'weights'
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Image upload triggered"); // Debug log
    
    const file = e.target.files?.[0];
    console.log("Selected file:", file); // Debug log
    
    if (!file) {
      console.log("No file selected"); // Debug log
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('File must be an image');
      alert('Please select an image file');
      return;
    }

    // Validate file size (e.g., 5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      console.error('File too large');
      alert('Image must be less than 5MB');
      return;
    }

    try {
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadstart = () => {
        console.log("Started reading file"); // Debug log
      };
      
      reader.onerror = () => {
        console.error("Error reading file:", reader.error); // Debug log
        alert('Error reading file');
      };
      
      reader.onloadend = () => {
        console.log("Finished reading file"); // Debug log
        if (reader.result) {
          setImagePreview(reader.result as string);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error handling file:", error); // Debug log
      alert('Error handling file');
    }
  };

  const handleTakePhoto = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click()
    }
  }

  const isWorkoutValid = () => {
    return (
      workout.date &&
      workout.muscleGroups.length > 0 &&
      workout.exercises.length > 0 &&
      workout.exercises.every(exercise => 
        exercise.name && exercise.sets.some(set => {
          if (exercise.exercise_type === 'time') return Boolean(set.duration);
          if (exercise.exercise_type === 'bodyweight') return Boolean(set.reps);
          return Boolean(set.weight) && Boolean(set.reps);
        })
      ) &&
      workout.feeling
    )
  }

  const finishWorkout = async () => {
    if (!session?.session?.user) {
      alert('You must be logged in to save a workout.')
      return
    }

    setIsSubmitting(true)

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

      const setOfTheDay = workout.exercises.flatMap(ex => 
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
      const transformedExercises = workout.exercises.map(exercise => {
        // Calculate max weight and total volume here instead of in the procedure
        const maxWeight = Math.max(
          ...exercise.sets
            .map(set => [Number(set.weight) || 0, Number(set.dropsetWeight) || 0])
            .flat()
        );

        const totalVolume = exercise.sets.reduce((total, set) => {
          const mainVolume = (Number(set.weight) || 0) * (Number(set.reps) || 0);
          const dropsetVolume = set.isDropSet 
            ? (Number(set.dropsetWeight) || 0) * (Number(set.dropsetReps) || 0)
            : 0;
          return total + mainVolume + dropsetVolume;
        }, 0);

        return {
          exercise_id: exercise.id,
          name: exercise.name,
          max_weight: maxWeight,
          total_volume: totalVolume,
          total_sets: exercise.sets.length,
          sets: exercise.sets.map((set, index) => ({
            set_number: index + 1,
            weight: set.weight ? Number(set.weight) : null,
            reps: set.reps ? Number(set.reps) : null,
            duration: set.duration ? Number(set.duration) : null,
            is_dropset: set.isDropSet,
            dropset_weight: set.dropsetWeight ? Number(set.dropsetWeight) : null,
            dropset_reps: set.dropsetReps ? Number(set.dropsetReps) : null
          }))
        };
      });

      const { error: procedureError } = await supabase.rpc('create_full_past_workout', {
        user_id: session.session.user.id,
        workout_date: format(workout.date, 'yyyy-MM-dd'),
        muscle_group: workout.muscleGroups.join(', '),
        feeling: workout.feeling,
        sotd,
        image_url,
        user_weight: workout.userWeight || null,
        exercises: transformedExercises
      })

      if (procedureError) throw procedureError

      // Check achievements after successful workout log
      if (session.session.user.id) {
        await checkAchievementsAfterWorkout(session.session.user.id);
      }

      setIsFinished(true)
      router.push('/workouts')
      
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

  useEffect(() => {
    if (workout?.muscleGroups.length) {
      fetchExercisesForMuscleGroups(workout.muscleGroups);
    }
  }, [workout?.muscleGroups]);

  const fetchExercisesForMuscleGroups = async (muscleGroups: string[]) => {
    const response = await fetch(`/api/exercises?muscleGroups=${muscleGroups.join(',')}`);
    if (response.ok) {
      const exercises = await response.json();
      const availableExercises = exercises.filter(
        (exercise: Exercise) => !workout?.exercises.some(ex => ex.id === exercise.id)
      );
      setAvailableExercises(availableExercises);
    } else {
      console.error('Failed to fetch exercises');
    }
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

  const renderMuscleGroupIcon = (group: string) => {
    switch (group) {
      case 'Chest':
        return <Image src="/muscleGroups/chest.png" alt="Chest" width={16} height={16} className="object-contain" />;
      case 'Back':
        return <Image src="/muscleGroups/back.png" alt="Back" width={16} height={16} className="object-contain" />;
      case 'Legs':
        return <Image src="/muscleGroups/leg.png" alt="Legs" width={16} height={16} className="object-contain" />;
      case 'Core':
        return <Image src="/muscleGroups/core.png" alt="Core" width={16} height={16} className="object-contain" />;
      case 'Tricep':
        return <Image src="/muscleGroups/tricep.png" alt="Tricep" width={16} height={16} className="object-contain" />;
      case 'Bicep':
        return <Image src="/muscleGroups/bicep.png" alt="Bicep" width={16} height={16} className="object-contain" />;
      case 'Shoulder':
        return <Image src="/muscleGroups/shoulder.png" alt="Shoulder" width={16} height={16} className="object-contain" />;
      default:
        return null;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Log Past Workout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card className="border-2 border-primary">
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="workoutDate" className="text-lg font-semibold">
                      Select Workout Date
                    </Label>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            !date && "text-muted-foreground"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white border rounded-md shadow-md" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={handleDateChange}
                          disabled={(date) => {
                            const formattedDate = format(date, 'yyyy-MM-dd')
                            return (
                              isDateInFuture(date) || 
                              isSameDay(date, new Date()) ||
                              daysWithWorkouts.includes(formattedDate)
                            )
                          }}
                          modifiers={{
                            booked: (date) => {
                              const formattedDate = format(date, 'yyyy-MM-dd')
                              return daysWithWorkouts.includes(formattedDate)
                            }
                          }}
                          modifiersStyles={{
                            booked: {
                              textDecoration: 'line-through',
                              backgroundColor: 'rgb(254, 226, 226)',
                              color: 'rgb(185, 28, 28)'
                            }
                          }}
                          className="rounded-md border"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>

              {date && (
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Select Muscle Groups</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {muscleGroups.map((group) => (
                      <Button
                        key={group.name}
                        onClick={() => handleMuscleGroupChange(group.name)}
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

                  {workout.muscleGroups.length > 0 && (
                    <Button 
                      onClick={() => setStep(2)} 
                      className="w-full mt-4"
                    >
                      Continue to Exercises <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-gray-500" />
                  Log Exercises
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setStep(1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Muscle Group Tally */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <Label className="text-sm font-medium mb-2 block">Selected Muscle Groups</Label>
                {renderMuscleTally()}
              </div>

              {/* Exercise Selection */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Add Exercise</Label>
                <Select
                  onValueChange={(value) => {
                    const selectedExercise = availableExercises.find(ex => ex.id === value);
                    if (selectedExercise) {
                      setCurrentExercise({
                        id: selectedExercise.id,
                        name: selectedExercise.name,
                        sets: [{ weight: '', reps: '', isDropSet: false, isSetOfTheDay: false }],
                        muscle_group: selectedExercise.muscle_group,
                        exercise_type: selectedExercise.exercise_type,
                        image_url: selectedExercise.image_url
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an exercise" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    {workout.muscleGroups.map(group => (
                      <div key={group}>
                        <div className="flex items-center gap-2 px-2 py-1 sticky top-0 bg-white z-10">
                          {renderMuscleGroupIcon(group)}
                          <Label className="text-sm font-semibold text-gray-500">{group}</Label>
                        </div>
                        {availableExercises
                          .filter(exercise => exercise.muscle_group === group)
                          .map(exercise => (
                            <SelectItem 
                              key={exercise.id} 
                              value={exercise.id}
                              className="flex items-center gap-2"
                            >
                              <div className="flex items-center gap-2">
                                {exercise.exercise_type === 'weights' && <Barbell className="h-4 w-4" />}
                                {exercise.exercise_type === 'bodyweight' && <PersonSimpleWalk className="h-4 w-4" />}
                                {exercise.exercise_type === 'time' && <Timer className="h-4 w-4" />}
                                {exercise.name}
                              </div>
                            </SelectItem>
                          ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>

                {/* Current Exercise Input */}
                {currentExercise.name && (
                  <Card className="border-2 border-primary">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {currentExercise.exercise_type === 'weights' && (
                            <Barbell className="h-5 w-5 text-gray-500" />
                          )}
                          {currentExercise.exercise_type === 'bodyweight' && (
                            <PersonSimpleWalk className="h-5 w-5 text-gray-500" />
                          )}
                          {currentExercise.exercise_type === 'time' && (
                            <Timer className="h-5 w-5 text-gray-500" />
                          )}
                          <CardTitle className="text-lg">{currentExercise.name}</CardTitle>
                        </div>
                        {currentExercise.image_url && (
                          <Image
                            src={currentExercise.image_url}
                            alt={currentExercise.name}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                          />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Personal Best Section */}
                      {personalBest && (
                        <Alert className="bg-yellow-50 border-yellow-200">
                          <Target className="h-4 w-4 text-yellow-500" />
                          <AlertTitle className="text-yellow-800">Personal Best</AlertTitle>
                          <AlertDescription className="text-yellow-700">
                            Your best for this exercise: {personalBest}
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Sets */}
                      {currentExercise.sets.map((set, index) => (
                        <motion.div
                          key={index}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 text-center">
                              <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                            </div>
                            
                            {/* Different inputs based on exercise type */}
                            {currentExercise.exercise_type === 'time' ? (
                              <Input
                                type="number"
                                placeholder="Duration (seconds)"
                                value={set.duration || ''}
                                onChange={(e) => handleSetChange(index, 'duration', e.target.value)}
                                className="w-32 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                            ) : (
                              <>
                                {currentExercise.exercise_type === 'weights' ? (
                                  <Input
                                    type="number"
                                    placeholder="Weight"
                                    value={set.weight || ''}
                                    onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                                    className="w-24 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />
                                ) : null}
                                <Input
                                  type="number"
                                  placeholder="Reps"
                                  value={set.reps || ''}
                                  onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                                  className="w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                              </>
                            )}
                            
                            {/* Set of the Day Toggle */}
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`sotd-${index}`}
                                checked={set.isSetOfTheDay}
                                onCheckedChange={(checked) => 
                                  handleSetChange(index, 'isSetOfTheDay', checked as boolean)
                                }
                              />
                              <Label htmlFor={`sotd-${index}`} className="cursor-pointer">
                                <Star className={`h-4 w-4 ${
                                  set.isSetOfTheDay ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'
                                }`} />
                              </Label>
                            </div>

                            {/* Dropset Toggle - Only show for weight exercises */}
                            {currentExercise.exercise_type === 'weights' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSetChange(index, 'isDropSet', !set.isDropSet)}
                              >
                                <ChevronRight className={`h-4 w-4 transition-transform ${
                                  set.isDropSet ? 'rotate-90' : ''
                                }`} />
                              </Button>
                            )}

                            {/* Delete Set Button */}
                            {currentExercise.sets.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSet(index)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          {/* Dropset Input - Only show for weight exercises */}
                          {currentExercise.exercise_type === 'weights' && (
                            <AnimatePresence>
                              {set.isDropSet && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="ml-10 flex items-center gap-2"
                                >
                                  <Input
                                    type="number"
                                    placeholder="Weight"
                                    value={set.dropsetWeight || ''}
                                    onChange={(e) => handleSetChange(index, 'dropsetWeight', e.target.value)}
                                    className="w-24 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Drop Reps"
                                    value={set.dropsetReps || ''}
                                    onChange={(e) => handleSetChange(index, 'dropsetReps', e.target.value)}
                                    className="w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          )}
                        </motion.div>
                      ))}

                      {/* Add Set Button */}
                      <div className="flex gap-2">
                        <Button 
                          onClick={addSet} 
                          variant="outline" 
                          className="w-full"
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add Set
                        </Button>
                      </div>

                      {/* Save Exercise Button */}
                      <Button 
                        onClick={saveExercise} 
                        className="w-full bg-primary"
                        disabled={!isExerciseValid(currentExercise)}
                      >
                        Save Exercise
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Saved Exercises List */}
                {workout.exercises.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold">Saved Exercises</Label>
                    {workout.exercises.map((exercise, index) => (
                      <Card key={index} className="bg-gray-50">
                        <CardContent className="py-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {exercise.exercise_type === 'weights' && <Barbell className="h-4 w-4 text-gray-500" />}
                              {exercise.exercise_type === 'bodyweight' && <PersonSimpleWalk className="h-4 w-4 text-gray-500" />}
                              {exercise.exercise_type === 'time' && <Timer className="h-4 w-4 text-gray-500" />}
                              <div>
                                <h4 className="font-medium">{exercise.name}</h4>
                                <p className="text-sm text-gray-500">
                                  {exercise.sets.length} {exercise.sets.length === 1 ? 'set' : 'sets'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editExercise(index)}
                              >
                                <Pencil className="h-4 w-4 text-gray-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExercise(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Separate Continue Button */}
                {workout.exercises.length > 0 && (
                  <Button 
                    onClick={handleContinue} 
                    className="w-full mt-6"
                  >
                    Continue <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      case 3:
        return (
          <Card className="border-2 border-gray-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center text-gray-700">
                  <Dumbbell className="mr-2 h-5 w-5 text-gray-500" />
                  Past Workout Summary
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Exercises
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Weight Logging Section */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Did you log your weight today?</Label>
                <div className="flex flex-col space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant={showWeightInput ? "default" : "outline"}
                      onClick={() => {
                        setShowWeightInput(true);
                        if (!workout.userWeight) {
                          setWorkout(prev => ({ ...prev, userWeight: undefined }));
                        }
                      }}
                      className={`w-20 ${
                        showWeightInput 
                          ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Yes
                    </Button>
                    <Button
                      variant={!showWeightInput ? "default" : "outline"}
                      onClick={() => {
                        setShowWeightInput(false);
                        setWorkout(prev => ({ ...prev, userWeight: undefined }));
                      }}
                      className={`w-20 ${
                        !showWeightInput 
                          ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      No
                    </Button>
                  </div>
                  
                  {showWeightInput && (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        placeholder="Weight in kg"
                        value={workout.userWeight || ''}
                        onChange={(e) => setWorkout(prev => ({
                          ...prev,
                          userWeight: e.target.value ? Number(e.target.value) : undefined
                        }))}
                        className="w-32 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-sm text-gray-500">kg</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Exercise Summary */}
              <div className="max-h-60 overflow-y-auto">
                {workout.exercises.map((exercise, index) => (
                  <div key={index} className="mb-2 p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      {exercise.exercise_type === 'weights' && <Barbell className="h-4 w-4 text-gray-500" />}
                      {exercise.exercise_type === 'bodyweight' && <PersonSimpleWalk className="h-4 w-4 text-gray-500" />}
                      {exercise.exercise_type === 'time' && <Timer className="h-4 w-4 text-gray-500" />}
                      <h3 className="font-bold">{exercise.name}</h3>
                    </div>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {exercise.sets.map((set, setIndex) => (
                        <li key={setIndex} className="flex items-center gap-2">
                          {exercise.exercise_type === 'time' ? (
                            <span>{set.duration}s</span>
                          ) : exercise.exercise_type === 'bodyweight' ? (
                            <span>{set.reps} reps</span>
                          ) : (
                            <span>
                              {set.weight}kg × {set.reps}
                              {set.isDropSet && (
                                <span className="text-blue-600">
                                  {" → "}{set.dropsetWeight}kg × {set.dropsetReps}
                                </span>
                              )}
                            </span>
                          )}
                          {set.isSetOfTheDay && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <Button onClick={() => setStep(4)} className="w-full bg-gray-600 hover:bg-gray-700 text-white">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )
      case 4:
        return (
          <Card className="border-2 border-gray-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center text-gray-700">
                  <Smile className="mr-2 h-5 w-5 text-gray-500" />
                  How did your workout go?
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setStep(3)}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Summary
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { feeling: 'great' as const, label: 'Great', description: 'Feeling strong and energetic!' },
                  { feeling: 'okay' as const, label: 'Okay', description: 'Average workout, got it done.' },
                  { feeling: 'bad' as const, label: 'Bad', description: 'Not my best day.' }
                ].map(({ feeling, label, description }) => (
                  <motion.button
                    key={feeling}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setWorkout(prev => ({ ...prev, feeling }))}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                      workout.feeling === feeling 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <FeelingEmoji feeling={feeling} />
                    <span className={`font-medium ${
                      workout.feeling === feeling ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {label}
                    </span>
                    <span className={`text-sm text-center ${
                      workout.feeling === feeling ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {description}
                    </span>
                  </motion.button>
                ))}
              </div>
              <Button 
                onClick={() => setStep(5)} 
                className="w-full bg-gray-600 hover:bg-gray-700 text-white"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )
      case 5:
        return (
          <Card className="border-2 border-gray-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center text-gray-700">
                  <Camera className="mr-2 h-5 w-5 text-gray-500" />
                  Workout Photo
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setStep(4)}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Feeling
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                {imagePreview ? (
                  <div className="w-full space-y-4">
                    <div className="relative aspect-video w-full max-w-2xl mx-auto rounded-lg overflow-hidden border-2 border-gray-200">
                      <Image 
                        src={imagePreview} 
                        alt="Workout preview" 
                        className="object-contain" 
                        fill
                        sizes="(max-width: 768px) 100vw, 42rem"
                        priority
                      />
                      <Button
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                          if (cameraInputRef.current) cameraInputRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      Preview of your workout photo
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex space-x-4">
                      <Button 
                        onClick={() => {
                          console.log("Upload button clicked");
                          if (fileInputRef.current) {
                            console.log("FileInput ref exists, clicking...");
                            fileInputRef.current.click();
                          } else {
                            console.error("FileInput ref is null");
                          }
                        }} 
                        variant="outline"
                      >
                        <Upload className="mr-2 h-4 w-4" /> Upload Photo
                      </Button>
                      <Button 
                        onClick={() => {
                          console.log("Camera button clicked");
                          if (cameraInputRef.current) {
                            console.log("CameraInput ref exists, clicking...");
                            cameraInputRef.current.click();
                          } else {
                            console.error("CameraInput ref is null");
                          }
                        }} 
                        variant="outline"
                      >
                        <Camera className="mr-2 h-4 w-4" /> Take Photo
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Adding a photo is optional
                    </p>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-2 mt-6">
                <Button 
                  onClick={finishWorkout} 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={!isWorkoutValid()}
                >
                  <Dumbbell className="mr-2 h-4 w-4" /> 
                  Log Workout
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  useEffect(() => {
    const fetchWorkoutDays = async () => {
      if (!session?.session?.user?.id) return;

      const { data, error } = await supabase
        .from('workouts')
        .select('date')
        .eq('user_id', session.session.user.id)
      
      if (error) {
        console.error('Error fetching workout days:', error)
        return
      }

      const workoutDays = data.map(workout => format(new Date(workout.date), 'yyyy-MM-dd'))
      setDaysWithWorkouts(workoutDays)
    }

    fetchWorkoutDays()
  }, [session])

  const calculateVolume = (sets: Set[]) => {
    return sets.reduce((total, set) => {
      const mainVolume = (Number(set.weight) || 0) * (Number(set.reps) || 0);
      const dropsetVolume = set.isDropSet 
        ? (Number(set.dropsetWeight) || 0) * (Number(set.dropsetReps) || 0)
        : 0;
      return total + mainVolume + dropsetVolume;
    }, 0);
  };

  const isExerciseValid = (exercise: Exercise) => {
    if (!exercise.name || !exercise.sets.length) return false;
    
    return exercise.sets.every(set => {
      switch (exercise.exercise_type) {
        case 'time':
          return Boolean(set.duration);
        case 'bodyweight':
          return Boolean(set.reps);
        case 'weights':
          const hasMainSet = Boolean(set.weight) && Boolean(set.reps);
          if (!hasMainSet) return false;
          if (set.isDropSet) {
            return Boolean(set.dropsetWeight) && Boolean(set.dropsetReps);
          }
          return true;
        default:
          return false;
      }
    });
  };

  const removeSet = (index: number) => {
    setCurrentExercise(prev => ({
      ...prev,
      sets: prev.sets.filter((_, i) => i !== index)
    }));
  };

  const removeExercise = (index: number) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    const fetchPersonalBest = async () => {
      if (!currentExercise.id || !session?.session?.user?.id) return;
      
      const { data, error } = await supabase.rpc('get_exercise_personal_best', {
        p_exercise_id: currentExercise.id,
        p_user_id: session.session.user.id
      });
      
      if (!error && data) {
        setPersonalBest(data);
      }
    };

    fetchPersonalBest();
  }, [currentExercise.id, session?.session?.user?.id]);

  const editExercise = (exerciseIndex: number) => {
    const exerciseToEdit = workout.exercises[exerciseIndex];
    setCurrentExercise(exerciseToEdit);
    // Remove the exercise from the workout list while editing
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, index) => index !== exerciseIndex)
    }));
  };

  const handleContinue = () => {
    const hasSetOfTheDay = workout.exercises.some(ex => 
      ex.sets.some(set => set.isSetOfTheDay)
    );
    
    if (!hasSetOfTheDay && !isSkippingSotd) {
      setShowSotdReminder(true);
      return;
    }
    setStep(3);
  };

  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-4rem)] overflow-auto">
      {/* Hidden file inputs - place these first */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageUpload}
        onClick={(e) => {
          (e.target as HTMLInputElement).value = '';
        }}
      />
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={cameraInputRef}
        onChange={handleImageUpload}
        onClick={(e) => {
          (e.target as HTMLInputElement).value = '';
        }}
      />

      {!isFinished ? (
        <>
          <motion.h1 
            className="text-3xl font-bold text-gray-700 mb-6 flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CalendarIcon className="mr-2 h-8 w-8 text-gray-500" />
            Log Past Workout
          </motion.h1>
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
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center h-full"
        >
          <Confetti/>
          <h2 className="text-3xl font-bold text-gray-700 mb-4">Workout Logged!</h2>
          <p className="text-xl text-center mb-8">Great job recording your past workout. Keep tracking your progress!</p>
          <Button asChild className="w-full max-w-md bg-gray-600 hover:bg-gray-700 text-white">
            <Link href="/progress">View Your Progress</Link>
          </Button>
        </motion.div>
      )}
      <Dialog open={showSotdReminder} onOpenChange={setShowSotdReminder}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              Set of the Day Missing
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-2">
              You haven&apos;t marked any set as your &quot;Set of the Day&quot;. This helps track your personal bests and progress.
              Would you like to go back and mark one?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowSotdReminder(false);
                setIsSkippingSotd(true);
                setStep(3);
              }}
            >
              Continue Without It
            </Button>
            <Button
              onClick={() => setShowSotdReminder(false)}
            >
              Mark Set of the Day
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}