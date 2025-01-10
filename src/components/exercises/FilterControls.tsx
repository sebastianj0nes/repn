import { Button } from "@/components/ui/button"
import { ArrowUpDown, Filter, SortAsc } from "lucide-react"
import { getTierColor } from "@/lib/types/exercise"
import { cn } from "@/lib/utils"
import { TIER_COLORS } from "@/lib/constants/tiers"

interface FilterControlsProps {
  selectedMuscleGroup: string
  selectedTier: string
  sortBy: string
  sortDirection: 'asc' | 'desc'
  onMuscleGroupChange: (value: string) => void
  onTierChange: (value: string) => void
  onSortChange: (value: string) => void
  onSortDirectionChange: () => void
}

const muscleGroups = ['All', 'Back', 'Bicep', 'Shoulder', 'Tricep', 'Chest', 'Core', 'Legs']
const tiers = ['All', 'A*', 'A', 'B']
const sortOptions = ['Name', 'Tier']

const TIER_ORDER = {
  'A*': 1,
  'A': 2,
  'B': 3
}

export function FilterControls({
  selectedMuscleGroup,
  selectedTier,
  sortBy,
  sortDirection,
  onMuscleGroupChange,
  onTierChange,
  onSortChange,
  onSortDirectionChange
}: FilterControlsProps) {
  const getTierStyle = (tier: string) => {
    if (selectedTier === tier) {
      if (tier === 'All') {
        return "bg-gray-900 text-white border-gray-900 hover:bg-gray-800"
      }
      if (tier in TIER_COLORS) {
        const colors = TIER_COLORS[tier as keyof typeof TIER_COLORS]
        const textColor = tier === 'A*' ? 'text-black' : 'text-white'
        return `bg-gradient-to-r from-[${colors.from}] to-[${colors.to}] ${textColor} border-[${colors.to}]`
      }
    }
    return "hover:bg-blue-50"
  }

  return (
    <div className="w-full bg-white px-4 py-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Filter Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filter exercises</span>
          </div>

          {/* Muscle Groups */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Muscle Group</label>
            <div className="flex flex-wrap gap-2">
              {muscleGroups.map((group) => (
                <Button
                  key={group}
                  size="sm"
                  variant="outline"
                  onClick={() => onMuscleGroupChange(group)}
                  className={cn(
                    "h-8 px-3 text-sm transition-colors",
                    selectedMuscleGroup === group 
                      ? "bg-gray-900 text-white border-gray-900 hover:bg-gray-800" 
                      : "hover:bg-blue-50"
                  )}
                >
                  {group}
                </Button>
              ))}
            </div>
          </div>

          {/* Tiers */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Exercise Tier</label>
            <div className="flex gap-2">
              {tiers.map((tier) => (
                <Button
                  key={tier}
                  size="sm"
                  variant="outline"
                  onClick={() => onTierChange(tier)}
                  className={cn(
                    "h-8 px-3 text-sm transition-colors font-semibold",
                    getTierStyle(tier)
                  )}
                >
                  {tier}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Sort Controls - Separated with border */}
        <div className="pt-2 border-t">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SortAsc className="h-4 w-4" />
              <span>Sort exercises</span>
            </div>
            <div className="flex items-center gap-2">
              {sortOptions.map((option) => (
                <Button
                  key={option}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onSortChange(option)
                    if (option === 'Tier' && sortDirection === 'asc') {
                      onSortDirectionChange()
                    }
                  }}
                  className={cn(
                    "h-8 px-3 text-sm transition-colors",
                    sortBy === option 
                      ? "bg-gray-900 text-white border-gray-900 hover:bg-gray-800" 
                      : "hover:bg-blue-50"
                  )}
                >
                  {option}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={onSortDirectionChange}
                className="h-8 w-8 p-0"
                aria-label={`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
              >
                <ArrowUpDown className={`h-4 w-4 transform ${
                  sortDirection === 'desc' ? 'rotate-180' : ''
                } transition-transform`} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 