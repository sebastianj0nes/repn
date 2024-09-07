import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon } from 'lucide-react'

export default function NutritionTracker() {
  const [meals, setMeals] = useState([{ name: '', calories: '', protein: '' }])

  const addMeal = () => {
    setMeals([...meals, { name: '', calories: '', protein: '' }])
  }

  const handleChange = (index: number, field: keyof typeof meals[0], value: string) => {
    const newMeals = [...meals]
    newMeals[index][field] = value
    setMeals(newMeals)
  }

  return (
    <div className="space-y-4">
      {meals.map((meal, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>Meal {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor={`meal-${index}`}>Meal Name</Label>
              <Input
                id={`meal-${index}`}
                value={meal.name}
                onChange={(e: { target: { value: any } }) => handleChange(index, 'name', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`calories-${index}`}>Calories</Label>
                <Input
                  id={`calories-${index}`}
                  value={meal.calories}
                  onChange={(e: { target: { value: any } }) => handleChange(index, 'calories', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`protein-${index}`}>Protein (g)</Label>
                <Input
                  id={`protein-${index}`}
                  value={meal.protein}
                  onChange={(e: { target: { value: any } }) => handleChange(index, 'protein', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button onClick={addMeal} className="w-full">
        <PlusIcon className="mr-2 h-4 w-4" /> Add Meal
      </Button>
    </div>
  )
}