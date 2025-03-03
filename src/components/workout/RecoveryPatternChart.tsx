'use client'

import { useMemo } from 'react'
import { differenceInDays } from 'date-fns'
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

type Workout = {
  date: string;
  muscle_group: string;
}

export function RecoveryPatternChart({ workouts }: { workouts: Workout[] }) {
  const RECOVERY_BOUNDS = {
    MIN: 1,
    MAX: 12,
    ZONES: {
      TOO_FREQUENT: { min: 1, max: 3 },
      OPTIMAL: { min: 3, max: 7 },
      TOO_INFREQUENT: { min: 7, max: 12 }
    }
  };

  const recoveryData = useMemo(() => {
    const muscleGroupWorkouts: Record<string, Date[]> = {};
    
    workouts.forEach(workout => {
      const date = new Date(workout.date);
      const muscleGroups = workout.muscle_group.split(',').map(g => g.trim());
      
      muscleGroups.forEach(group => {
        if (!muscleGroupWorkouts[group]) muscleGroupWorkouts[group] = [];
        muscleGroupWorkouts[group].push(date);
      });
    });
    
    return Object.entries(muscleGroupWorkouts).map(([group, dates]) => {
      const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
      let totalDays = 0;
      let count = 0;
      
      for (let i = 1; i < sortedDates.length; i++) {
        const diff = differenceInDays(sortedDates[i], sortedDates[i-1]);
        totalDays += diff;
        count++;
      }
      
      const avgRecovery = count > 0 ? Math.round(totalDays / count * 10) / 10 : 0;
      const optimalMid = 5;
      const deviation = Math.abs(avgRecovery - optimalMid);
      
      return {
        group,
        avgRecovery,
        deviation,
        isTooFrequent: avgRecovery <= RECOVERY_BOUNDS.ZONES.TOO_FREQUENT.max,
        isTooInfrequent: avgRecovery >= RECOVERY_BOUNDS.ZONES.TOO_INFREQUENT.min
      };
    }).sort((a, b) => b.deviation - a.deviation);
  }, [workouts]);

  // Get the two most significant deviations
  const topDeviations = recoveryData.slice(0, 2);

  return (
    <div className="space-y-8 px-4">
      <div className="space-y-6">
       

        {/* Zone backgrounds and recovery data remain unchanged */}
        <div className="space-y-4">
          {recoveryData.map(({ group, avgRecovery }) => {
            const normalizedPosition = Math.min(Math.max(
              ((avgRecovery - 1) / (12 - 1)) * 100,
              0
            ), 100)

            const getStatusColor = () => {
              if (avgRecovery <= RECOVERY_BOUNDS.ZONES.TOO_FREQUENT.max) {
                return 'bg-red-400';
              } else if (avgRecovery >= RECOVERY_BOUNDS.ZONES.TOO_INFREQUENT.min) {
                return 'bg-yellow-400';
              } else {
                return 'bg-green-400';
              }
            };

            return (
              <div key={group} className="space-y-1">
                <div className="text-sm font-medium pl-1">{group}</div>
                <div className="relative">
                  {/* Zone backgrounds */}
                  <div className="absolute inset-0 flex rounded-lg overflow-hidden">
                    <div className="w-[30%] bg-red-50" />
                    <div className="w-[40%] bg-green-50" />
                    <div className="w-[30%] bg-yellow-50" />
                  </div>
                  
                  {/* Progress bar */}
                  <div className="h-8 rounded-lg relative">
                    <div 
                      className={`absolute top-0 h-full w-3 ${getStatusColor()} rounded-full transition-all duration-300`}
                      style={{ left: `${normalizedPosition}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <Badge variant="outline" className="text-xs font-medium">
                          {avgRecovery}d
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Zone labels at bottom - updated to match top labels */}
        <div className="grid grid-cols-3 text-center mt-8 text-xs font-medium">
          <div className="text-red-500">1-3 days</div>
          <div className="text-green-500">4-7 days</div>
          <div className="text-yellow-500">8+ days</div>
        </div>
      </div>
    </div>
  );
}