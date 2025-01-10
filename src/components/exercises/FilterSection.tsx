'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FilterSectionProps {
  children: React.ReactNode
}

export function FilterSection({ children }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full space-y-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow-sm border"
      >
        <span className="font-medium">Filters</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      
      {isOpen && (
        <div className="animate-in slide-in-from-top duration-200">
          {children}
        </div>
      )}
    </div>
  )
} 