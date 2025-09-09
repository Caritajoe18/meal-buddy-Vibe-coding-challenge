import { type NextRequest, NextResponse } from "next/server"

interface LocationRequest {
  location: string
  ingredients: string[]
  budgetPreference: "budget" | "moderate" | "premium"
}

interface StoreRecommendation {
  name: string
  distance: string
  priceLevel: "budget" | "moderate" | "premium"
  specialties: string[]
}

interface IngredientRecommendation {
  name: string
  localPrice: number
  unit: string
  availability: "high" | "medium" | "low"
  seasonality: string
  alternatives: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: LocationRequest = await request.json()
    const { location, ingredients, budgetPreference } = body

    // Simulate location-based data (in production, this would integrate with real APIs)
    const locationData = getLocationBasedRecommendations(location, ingredients, budgetPreference)

    return NextResponse.json(locationData)
  } catch (error) {
    console.error("[v0] Error getting location recommendations:", error)
    return NextResponse.json({ error: "Failed to get location recommendations" }, { status: 500 })
  }
}

function getLocationBasedRecommendations(
  location: string,
  ingredients: string[],
  budgetPreference: string,
): {
  stores: StoreRecommendation[]
  ingredientPricing: IngredientRecommendation[]
  regionalSuggestions: string[]
  costOptimization: {
    totalSavings: number
    tips: string[]
  }
} {
  // Simulate different pricing based on location
  const locationMultiplier = getLocationPriceMultiplier(location)

  const stores: StoreRecommendation[] = [
    {
      name: "Local Farmers Market",
      distance: "0.8 miles",
      priceLevel: budgetPreference === "budget" ? "budget" : "moderate",
      specialties: ["Fresh vegetables", "Local produce", "Organic options"],
    },
    {
      name: "SuperValue Grocery",
      distance: "1.2 miles",
      priceLevel: "budget",
      specialties: ["Bulk items", "Generic brands", "Weekly deals"],
    },
    {
      name: "Fresh & Fine Market",
      distance: "2.1 miles",
      priceLevel: budgetPreference === "premium" ? "premium" : "moderate",
      specialties: ["Premium ingredients", "International foods", "Organic selection"],
    },
  ]

  const ingredientPricing: IngredientRecommendation[] = ingredients.map((ingredient) => {
    const basePrice = getBasePrice(ingredient)
    const localPrice = basePrice * locationMultiplier

    return {
      name: ingredient,
      localPrice: localPrice,
      unit: getIngredientUnit(ingredient),
      availability: getSeasonalAvailability(ingredient),
      seasonality: getSeasonalInfo(ingredient),
      alternatives: getLocalAlternatives(ingredient, location),
    }
  })

  const regionalSuggestions = getRegionalIngredients(location)

  const costOptimization = {
    totalSavings: calculatePotentialSavings(ingredientPricing, budgetPreference),
    tips: getCostOptimizationTips(location, budgetPreference),
  }

  return {
    stores,
    ingredientPricing,
    regionalSuggestions,
    costOptimization,
  }
}

function getLocationPriceMultiplier(location: string): number {
  const lowerLocation = location.toLowerCase()

  // Simulate different cost of living adjustments
  if (
    lowerLocation.includes("new york") ||
    lowerLocation.includes("san francisco") ||
    lowerLocation.includes("los angeles")
  ) {
    return 1.3 // Higher cost areas
  } else if (lowerLocation.includes("texas") || lowerLocation.includes("florida") || lowerLocation.includes("ohio")) {
    return 0.9 // Lower cost areas
  }
  return 1.0 // Average cost
}

function getBasePrice(ingredient: string): number {
  const prices: { [key: string]: number } = {
    chicken: 6.99,
    "chicken breast": 6.99,
    beef: 8.99,
    "ground beef": 5.99,
    salmon: 12.99,
    rice: 2.99,
    "brown rice": 2.99,
    pasta: 1.99,
    broccoli: 2.49,
    spinach: 2.99,
    tomatoes: 2.99,
    onions: 1.49,
    carrots: 1.99,
    potatoes: 1.79,
    "sweet potatoes": 1.79,
    eggs: 3.49,
    milk: 3.99,
    cheese: 4.99,
    bread: 2.49,
    avocado: 1.49,
  }

  return prices[ingredient.toLowerCase()] || 3.99
}

function getIngredientUnit(ingredient: string): string {
  const units: { [key: string]: string } = {
    chicken: "lb",
    "chicken breast": "lb",
    beef: "lb",
    "ground beef": "lb",
    salmon: "lb",
    rice: "lb",
    "brown rice": "lb",
    pasta: "lb",
    eggs: "dozen",
    milk: "gallon",
    avocado: "each",
  }

  return units[ingredient.toLowerCase()] || "lb"
}

function getSeasonalAvailability(ingredient: string): "high" | "medium" | "low" {
  const seasonal: { [key: string]: "high" | "medium" | "low" } = {
    tomatoes: "high", // Summer season
    broccoli: "high", // Fall/Winter
    spinach: "medium",
    carrots: "high",
    potatoes: "high",
    "sweet potatoes": "high",
  }

  return seasonal[ingredient.toLowerCase()] || "medium"
}

function getSeasonalInfo(ingredient: string): string {
  const seasonInfo: { [key: string]: string } = {
    tomatoes: "Peak season (summer) - best prices June-September",
    broccoli: "Peak season (fall/winter) - best prices October-March",
    spinach: "Available year-round - slight price variations",
    carrots: "Available year-round - consistent pricing",
    potatoes: "Harvest season (fall) - best prices September-November",
    "sweet potatoes": "Peak season (fall) - best prices October-December",
  }

  return seasonInfo[ingredient.toLowerCase()] || "Available year-round"
}

function getLocalAlternatives(ingredient: string, location: string): string[] {
  const alternatives: { [key: string]: string[] } = {
    salmon: ["local trout", "tilapia", "cod"],
    avocado: ["local nuts", "olive oil", "sunflower seeds"],
    quinoa: ["local grains", "brown rice", "barley"],
    spinach: ["local greens", "kale", "collard greens"],
  }

  return alternatives[ingredient.toLowerCase()] || []
}

function getRegionalIngredients(location: string): string[] {
  const lowerLocation = location.toLowerCase()

  if (lowerLocation.includes("california")) {
    return ["avocados", "almonds", "citrus fruits", "artichokes"]
  } else if (lowerLocation.includes("florida")) {
    return ["citrus fruits", "tomatoes", "peppers", "tropical fruits"]
  } else if (lowerLocation.includes("texas")) {
    return ["beef", "peppers", "onions", "pecans"]
  } else if (lowerLocation.includes("maine")) {
    return ["lobster", "blueberries", "potatoes", "maple syrup"]
  }

  return ["seasonal vegetables", "local dairy", "regional grains"]
}

function calculatePotentialSavings(ingredients: IngredientRecommendation[], budgetPreference: string): number {
  const baseSavings = ingredients.length * 2.5 // Base savings per ingredient
  const budgetMultiplier = budgetPreference === "budget" ? 1.5 : budgetPreference === "moderate" ? 1.2 : 1.0

  return baseSavings * budgetMultiplier
}

function getCostOptimizationTips(location: string, budgetPreference: string): string[] {
  const baseTips = [
    "Shop at farmers markets for seasonal produce",
    "Buy in bulk for non-perishable items",
    "Use store loyalty programs and digital coupons",
  ]

  if (budgetPreference === "budget") {
    baseTips.push(
      "Consider generic brands for staple items",
      "Plan meals around weekly store sales",
      "Freeze ingredients that are on sale",
    )
  }

  return baseTips
}
