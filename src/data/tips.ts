export interface Tip {
  id: string;
  title: string;
  description: string;
  category: 'workout' | 'progress' | 'general' | 'stats';
  icon: string; // Lucide icon name
}

export const tips: Tip[] = [
  {
    id: 'muscle-group-selection',
    title: 'Selecting Muscle Groups',
    description: 'Select all muscle groups you plan to work out today.',
    category: 'workout',
    icon: 'Dumbbell'
  },
  {
    id: 'set-of-the-day',
    title: 'Set of the Day',
    description: 'Mark your best set with the star icon to track your daily highlights. These special sets help track your progress over time!',
    category: 'workout',
    icon: 'Star'
  },
  {
    id: 'dropset-tracking',
    title: 'Recording Drop Sets',
    description: 'Toggle the dropset switch to log both weights when you decrease the weight within the same set. Great for tracking intensity!',
    category: 'workout',
    icon: 'ArrowDownToLine'
  },
  {
    id: 'workout-feeling',
    title: 'Rate Your Workout',
    description: 'Your workout rating helps track patterns in your performance. Be honest - even challenging days provide valuable insights!',
    category: 'workout',
    icon: 'ThumbsUp'
  },
  {
    id: 'weight-tracking',
    title: 'Track Your Weight',
    description: 'Optional but recommended: Log your body weight to track changes alongside your strength progress!',
    category: 'workout',
    icon: 'Scale'
  },
  {
    id: 'workout-photo',
    title: 'Capture Your Progress',
    description: "Optional: Add a photo to your workout! It's a great way to track visual progress and stay motivated.",
    category: 'workout',
    icon: 'Camera'
  }
] 