"use client";
import NutritionTracker from '@/components/NutritionTracker'

export default function NutritionPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nutrition Tracker</h1>
      <NutritionTracker />
    </div>
  )
}
