import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Filter, SortAsc } from "lucide-react"
import { getTierColor } from "@/lib/types/exercise"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

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
const tiers = ['All', 'S', 'A', 'B']
const sortOptions = ['Tier', 'Name']

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
  return (
    <div 
      className="flex items-center gap-2 sm:gap-4 mb-6 w-full max-w-full overflow-x-auto bg-background"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Filters Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium hidden sm:inline">Filters</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Select value={selectedMuscleGroup} onValueChange={onMuscleGroupChange}>
            <SelectTrigger 
              id="muscle-group" 
              className="w-[90px] sm:w-[110px]"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <SelectValue placeholder="Muscle" />
            </SelectTrigger>
            <SelectContent 
              onPointerDownOutside={(e) => e.preventDefault()} 
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {muscleGroups.map((group) => (
                <SelectItem 
                  key={group} 
                  value={group}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTier} onValueChange={onTierChange}>
            <SelectTrigger 
              id="tier" 
              className="w-[70px] sm:w-[80px]"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent 
              onPointerDownOutside={(e) => e.preventDefault()} 
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {tiers.map((tier) => (
                <SelectItem 
                  key={tier} 
                  value={tier}
                  className={tier !== 'All' ? 'font-bold' : ''}
                  style={tier !== 'All' ? { color: getTierColor(tier as any) } : {}}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {tier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Sort Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
          <SortAsc className="h-4 w-4" />
          <span className="text-sm font-medium hidden sm:inline">Sort</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger 
              id="sort-by" 
              className="w-[80px] sm:w-[90px]"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent 
              onPointerDownOutside={(e) => e.preventDefault()} 
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {sortOptions.map((option) => (
                <SelectItem 
                  key={option} 
                  value={option}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onSortDirectionChange();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="h-9 w-9 sm:h-10 sm:w-10"
            aria-label={`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
          >
            <ArrowUpDown className={`h-4 w-4 transform ${
              sortDirection === 'desc' ? 'rotate-180' : ''
            } transition-transform`} />
          </Button>
        </div>
      </div>
    </div>
  )
} 