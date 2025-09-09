"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Store, DollarSign, TrendingDown, Lightbulb, Leaf } from "lucide-react"

interface LocationRecommendationsProps {
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

interface LocationData {
  stores: StoreRecommendation[]
  ingredientPricing: IngredientRecommendation[]
  regionalSuggestions: string[]
  costOptimization: {
    totalSavings: number
    tips: string[]
  }
}

export function LocationRecommendations({ location, ingredients, budgetPreference }: LocationRecommendationsProps) {
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (location && ingredients.length > 0) {
      fetchLocationRecommendations()
    }
  }, [location, ingredients, budgetPreference])

  const fetchLocationRecommendations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/location-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location,
          ingredients,
          budgetPreference,
        }),
      })

      if (!response.ok) throw new Error("Failed to fetch recommendations")

      const data = await response.json()
      setLocationData(data)
    } catch (error) {
      console.error("[v0] Error fetching location recommendations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!location || ingredients.length === 0) {
    return null
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location-Based Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Finding local recommendations...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!locationData) return null

  const getPriceLevelColor = (level: string) => {
    switch (level) {
      case "budget":
        return "bg-green-100 text-green-800"
      case "moderate":
        return "bg-yellow-100 text-yellow-800"
      case "premium":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "high":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Recommendations for {location}
          </CardTitle>
          <CardDescription>Local stores, pricing, and cost-saving opportunities in your area</CardDescription>
        </CardHeader>
      </Card>

      {/* Nearby Stores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Recommended Stores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {locationData.stores.map((store, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{store.name}</h3>
                  <Badge className={getPriceLevelColor(store.priceLevel)}>{store.priceLevel}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{store.distance}</p>
                <div className="space-y-1">
                  {store.specialties.map((specialty, specIndex) => (
                    <Badge key={specIndex} variant="outline" className="text-xs mr-1">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ingredient Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Local Ingredient Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {locationData.ingredientPricing.map((ingredient, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium capitalize">{ingredient.name}</h4>
                    <Badge variant="outline" className={`text-xs ${getAvailabilityColor(ingredient.availability)}`}>
                      {ingredient.availability} availability
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{ingredient.seasonality}</p>
                  {ingredient.alternatives.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Alternatives: {ingredient.alternatives.join(", ")}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold">${ingredient.localPrice.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">per {ingredient.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regional Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Regional Specialties
          </CardTitle>
          <CardDescription>Local ingredients that are fresh, affordable, and in season</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {locationData.regionalSuggestions.map((suggestion, index) => (
              <Badge key={index} variant="secondary" className="capitalize">
                {suggestion}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cost Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Cost Optimization
          </CardTitle>
          <CardDescription>
            Save up to ${locationData.costOptimization.totalSavings.toFixed(2)} per week with these tips
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {locationData.costOptimization.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
