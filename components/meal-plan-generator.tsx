"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, X, ChefHat, Clock, DollarSign } from "lucide-react"
import { LocationRecommendations } from "./location-recommendations"

interface MealPlan {
  id: string
  title: string
  weekStartDate: string
  meals: Array<{
    dayOfWeek: number
    mealType: string
    recipeName: string
    instructions: string
    prepTime: number
    estimatedCost: number
  }>
  totalEstimatedCost: number
}

export function MealPlanGenerator() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [newIngredient, setNewIngredient] = useState("")
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([])
  const [budgetPreference, setBudgetPreference] = useState<string>("moderate")
  const [familySize, setFamilySize] = useState<number>(2)
  const [location, setLocation] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)

  const dietaryOptions = [
    "vegetarian",
    "vegan",
    "gluten-free",
    "dairy-free",
    "low-carb",
    "keto",
    "paleo",
    "mediterranean",
  ]

  const addIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()])
      setNewIngredient("")
    }
  }

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient))
  }

  const toggleDietaryPreference = (preference: string) => {
    setDietaryPreferences((prev) =>
      prev.includes(preference) ? prev.filter((p) => p !== preference) : [...prev, preference],
    )
  }

  const generateMealPlan = async () => {
    if (ingredients.length === 0) {
      alert("Please add at least one ingredient")
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients,
          dietaryPreferences,
          budgetPreference,
          familySize,
          location,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate meal plan")

      const data = await response.json()
      setMealPlan(data.mealPlan)
    } catch (error) {
      console.error("[v0] Error generating meal plan:", error)
      alert("Failed to generate meal plan. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const getDayName = (dayNumber: number) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    return days[dayNumber - 1]
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Create Your Meal Plan
          </CardTitle>
          <CardDescription>
            Tell us what ingredients you have and your preferences, and we'll create a personalized weekly meal plan for
            you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ingredients Input */}
          <div className="space-y-3">
            <Label htmlFor="ingredients">Available Ingredients</Label>
            <div className="flex gap-2">
              <Input
                id="ingredients"
                placeholder="Enter an ingredient (e.g., chicken, rice, broccoli)"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addIngredient()}
              />
              <Button onClick={addIngredient} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient) => (
                <Badge key={ingredient} variant="secondary" className="flex items-center gap-1">
                  {ingredient}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeIngredient(ingredient)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="space-y-3">
            <Label>Dietary Preferences</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {dietaryOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={dietaryPreferences.includes(option)}
                    onCheckedChange={() => toggleDietaryPreference(option)}
                  />
                  <Label htmlFor={option} className="text-sm capitalize">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Budget and Family Size */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget Preference</Label>
              <Select value={budgetPreference} onValueChange={setBudgetPreference}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget-Friendly</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="family-size">Family Size</Label>
              <Input
                id="family-size"
                type="number"
                min="1"
                max="10"
                value={familySize}
                onChange={(e) => setFamilySize(Number.parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., New York, NY"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={generateMealPlan} disabled={isGenerating || ingredients.length === 0} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Your Meal Plan...
              </>
            ) : (
              "Generate Meal Plan"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Location-based Recommendations */}
      {location && ingredients.length > 0 && (
        <LocationRecommendations
          location={location}
          ingredients={ingredients}
          budgetPreference={budgetPreference as "budget" | "moderate" | "premium"}
        />
      )}

      {/* Generated Meal Plan */}
      {mealPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {mealPlan.title}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />${mealPlan.totalEstimatedCost.toFixed(2)} total
              </div>
            </CardTitle>
            <CardDescription>Week of {new Date(mealPlan.weekStartDate).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                const dayMeals = mealPlan.meals.filter((meal) => meal.dayOfWeek === day)
                return (
                  <div key={day} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3">{getDayName(day)}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {["breakfast", "lunch", "dinner"].map((mealType) => {
                        const meal = dayMeals.find((m) => m.mealType === mealType)
                        return meal ? (
                          <div key={mealType} className="bg-muted/50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium capitalize">{mealType}</h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {meal.prepTime}min
                              </div>
                            </div>
                            <p className="text-sm font-medium mb-2">{meal.recipeName}</p>
                            <p className="text-xs text-muted-foreground mb-2">{meal.instructions}</p>
                            <p className="text-xs font-medium text-emerald-600">${meal.estimatedCost.toFixed(2)}</p>
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
