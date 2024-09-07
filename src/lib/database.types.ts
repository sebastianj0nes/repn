export interface Database {
    public: {
      Tables: {
        workouts: {
          Row: {
            id: string
            user_id: string
            date: string
            muscle_group: string
            feeling: string
            sotd: string
            image_url: string | null
            created_at: string
            image_path: string | null
          }
          Insert: {
            user_id: string
            date: string
            muscle_group: string
            feeling: string
            sotd: string
            image_url?: string | null
            image_path?: string | null
          }
          Update: {
            id?: string
            user_id?: string
            date?: string
            muscle_group?: string
            feeling?: string
            sotd?: string
            image_url?: string | null
            created_at?: string
            image_path?: string | null
          }
        }
        exercises: {
          Row: {
            id: string
            workout_id: string
            name: string
            sets: string // This will be a JSON string
            order: number
          }
          Insert: {
            workout_id: string
            name: string
            sets: string
            order: number
          }
          Update: {
            id?: string
            workout_id?: string
            name?: string
            sets?: string
            order?: number
          }
        }
        // Add other tables as needed
      }
    }
  }