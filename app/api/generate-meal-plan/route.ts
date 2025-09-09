import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

interface MealPlanRequest {
  ingredients: string[]
  dietaryPreferences: string[]
  budgetPreference: "budget" | "moderate" | "premium"
  familySize: number
  location?: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: MealPlanRequest = await request.json()
    const { ingredients, dietaryPreferences, budgetPreference, familySize, location } = body

    // For now, we'll create a simple meal plan without AI
    // In the next iteration, we'll integrate with Groq for AI-powered recommendations
    const mealPlan = await generateSimpleMealPlan({
      ingredients,
      dietaryPreferences,
      budgetPreference,
      familySize,
      userId: user.id,
      supabase,
    })

    return NextResponse.json({ mealPlan })
  } catch (error) {
    console.error("[v0] Error generating meal plan:", error)
    return NextResponse.json({ error: "Failed to generate meal plan" }, { status: 500 })
  }
}

async function generateSimpleMealPlan({
  ingredients,
  dietaryPreferences,
  budgetPreference,
  familySize,
  userId,
  supabase,
}: {
  ingredients: string[]
  dietaryPreferences: string[]
  budgetPreference: string
  familySize: number
  userId: string
  supabase: any
}) {
  // Get ingredient details from database
  const { data: availableIngredients } = await supabase.from("ingredients").select("*").in("name", ingredients)

  // Create a new meal plan
  const weekStartDate = new Date()
  weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay() + 1) // Start from Monday

  const { data: mealPlan, error: mealPlanError } = await supabase
    .from("meal_plans")
    .insert({
      user_id: userId,
      title: `Meal Plan for ${weekStartDate.toDateString()}`,
      week_start_date: weekStartDate.toISOString().split("T")[0],
      dietary_preferences: dietaryPreferences,
      total_estimated_cost: 0, // Will calculate later
    })
    .select()
    .single()

  if (mealPlanError) throw mealPlanError

  // Generate simple meals based on available ingredients
  const meals = generateWeeklyMeals(availableIngredients, dietaryPreferences, familySize)

  // Insert meals into database
  const mealsWithIds = []
  for (const meal of meals) {
    const { data: insertedMeal, error: mealError } = await supabase
      .from("meals")
      .insert({
        meal_plan_id: mealPlan.id,
        day_of_week: meal.dayOfWeek,
        meal_type: meal.mealType,
        recipe_name: meal.recipeName,
        recipe_instructions: meal.instructions,
        estimated_prep_time: meal.prepTime,
        estimated_cost: meal.estimatedCost,
      })
      .select()
      .single()

    if (mealError) throw mealError
    mealsWithIds.push({ ...meal, id: insertedMeal.id })
  }

  return {
    id: mealPlan.id,
    title: mealPlan.title,
    weekStartDate: mealPlan.week_start_date,
    meals: mealsWithIds,
    totalEstimatedCost: meals.reduce((sum, meal) => sum + meal.estimatedCost, 0),
  }
}

function generateWeeklyMeals(ingredients: any[], dietaryPreferences: string[], familySize: number) {
  const meals = []
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Simple meal templates based on available ingredients
  const mealTemplates = [
    {
      name: "Chicken and Vegetable Stir Fry",
      ingredients: ["Chicken Breast", "Bell Peppers", "Broccoli", "Brown Rice"],
      instructions:
        "1. Cook rice according to package directions. 2. Cut chicken into strips and cook in a large pan. 3. Add vegetables and stir fry until tender. 4. Serve over rice.",
      prepTime: 25,
      cost: 8.5,
    },
    {
      name: "Vegetable Pasta",
      ingredients: ["Whole Wheat Pasta", "Tomatoes", "Spinach", "Garlic"],
      instructions:
        "1. Cook pasta according to package directions. 2. Sauté garlic, add tomatoes and spinach. 3. Toss with pasta and serve.",
      prepTime: 20,
      cost: 6.0,
    },
    {
      name: "Quinoa Bowl",
      ingredients: ["Quinoa", "Black Beans", "Avocado", "Bell Peppers"],
      instructions:
        "1. Cook quinoa according to package directions. 2. Heat black beans. 3. Slice avocado and peppers. 4. Combine in bowl and serve.",
      prepTime: 15,
      cost: 7.25,
    },
  ]

  // Generate meals for each day
  for (let day = 1; day <= 7; day++) {
    // Breakfast
    meals.push({
      dayOfWeek: day,
      mealType: "breakfast",
      recipeName: "Oatmeal with Fruit",
      instructions: "Cook oats with milk, top with fresh fruit.",
      prepTime: 10,
      estimatedCost: 2.5 * familySize,
    })

    // Lunch
    const lunchTemplate = mealTemplates[Math.floor(Math.random() * mealTemplates.length)]
    meals.push({
      dayOfWeek: day,
      mealType: "lunch",
      recipeName: lunchTemplate.name,
      instructions: lunchTemplate.instructions,
      prepTime: lunchTemplate.prepTime,
      estimatedCost: lunchTemplate.cost * familySize,
    })

    // Dinner
    const dinnerTemplate = mealTemplates[Math.floor(Math.random() * mealTemplates.length)]
    meals.push({
      dayOfWeek: day,
      mealType: "dinner",
      recipeName: dinnerTemplate.name,
      instructions: dinnerTemplate.instructions,
      prepTime: dinnerTemplate.prepTime,
      estimatedCost: dinnerTemplate.cost * familySize,
    })
  }

  return meals
}
