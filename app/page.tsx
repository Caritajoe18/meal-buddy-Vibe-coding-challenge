"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Clock, Users, DollarSign, Sparkles } from "lucide-react"
import { MealPlanGenerator } from "@/components/meal-plan-generator"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChefHat className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-serif font-bold text-foreground">Meal Buddy</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-balance mb-6">
              Turn Your Ingredients Into
              <span className="text-primary"> Balanced Meals</span>
            </h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto mb-8">
              AI-powered meal planning that creates a week of nutritious, delicious meals from what you already have. No
              more food waste, no more daily "what's for dinner?" stress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8"
                onClick={() => document.getElementById("meal-generator")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Create My Meal Plan
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                See How It Works
              </Button>
            </div>
          </div>

          <div id="meal-generator">
            <MealPlanGenerator />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-serif font-bold text-center mb-12">Why Families Love Meal buddy</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="font-serif">Save Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No more daily meal planning stress. Get a full week planned in minutes.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="font-serif">Reduce Waste</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Use what you have first. Get affordable ingredient suggestions for your location.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="font-serif">Family Friendly</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Balanced nutrition for the whole family. Kid-friendly options included.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="font-serif">AI-Powered</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Smart recommendations based on your preferences, diet, and location.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample Meal Plan Preview */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-serif font-bold text-center mb-12">Sample 7-Day Meal Plan</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { day: "Monday", meal: "Chicken & Rice Bowl", image: "/healthy-chicken-rice-bowl-with-vegetables.jpg" },
              { day: "Tuesday", meal: "Tomato Pasta", image: "/fresh-tomato-pasta-with-herbs.jpg" },
              { day: "Wednesday", meal: "Stir-Fry Vegetables", image: "/colorful-vegetable-stir-fry.png" },
              { day: "Thursday", meal: "Chicken Soup", image: "/hearty-chicken-vegetable-soup.jpg" },
              { day: "Friday", meal: "Fried Rice", image: "/delicious-fried-rice-with-vegetables.jpg" },
              { day: "Weekend", meal: "Family Feast", image: "/family-dinner-spread-with-multiple-dishes.jpg" },
            ].map((item, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img src={item.image || "/placeholder.svg"} alt={item.meal} className="w-full h-full object-cover" />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="font-serif">{item.meal}</CardTitle>
                    <Badge variant="outline">{item.day}</Badge>
                  </div>
                  <CardDescription>Balanced nutrition using your available ingredients</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-3xl font-serif font-bold mb-6">Ready to Transform Your Meal Planning?</h3>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of families who've eliminated meal planning stress and reduced food waste.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8"
              onClick={() => document.getElementById("meal-generator")?.scrollIntoView({ behavior: "smooth" })}
            >
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ChefHat className="h-6 w-6 text-primary" />
                <span className="text-lg font-serif font-bold">Meal Buddy</span>
              </div>
              <p className="text-muted-foreground">AI-powered meal planning for healthier, happier families.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>How it Works</li>
                <li>Pricing</li>
                <li>Features</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Nutrition Guide</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>About</li>
                <li>Blog</li>
                <li>Privacy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 Meal Buddy. Helping families eat better, waste less.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
