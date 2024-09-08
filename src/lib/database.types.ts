export type Database = {
    public: {
      tables: {
        workouts: {
          Row: {
            id: string
            user_id: string
            date: string
            muscle_group: string
            feeling: string
            sotd: string
          }
          Insert: {
            user_id: string
            date: string
            muscle_group: string
            feeling: string
            sotd: string
          }
          Update: {
            user_id?: string
            date?: string
            muscle_group?: string
            feeling?: string
            sotd?: string
          }
        }
        exercises: {
          Row: {
            id: string
            workout_id: string
            name: string
          }
          Insert: {
            workout_id: string
            name: string
          }
          Update: {
            workout_id?: string
            name?: string
          }
        }
        exercise_sets: {
          Row: {
            id: string
            exercise_id: string
            set_number: number
            weight: number
            reps: number
          }
          Insert: {
            exercise_id: string
            set_number: number
            weight: number
            reps: number
          }
          Update: {
            exercise_id?: string
            set_number?: number
            weight?: number
            reps?: number
          }
        }
      }
    }
  }