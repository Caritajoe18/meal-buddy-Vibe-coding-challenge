import { redirect } from "next/navigation"
import { handleSignOut } from "@/app/actions/signOut"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Crown, Calendar, ShoppingCart, TrendingUp, Settings } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get recent meal plans
  const { data: recentMealPlans } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <ChefHat className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-serif font-bold text-foreground">Meal Buddy</h1>
            </Link>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Free Plan
              </Badge>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <form action={handleSignOut}>
                <Button variant="ghost" size="sm" type="submit">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Welcome back, {data.user.user_metadata.full_name || data.user.email}</h1>
          <p className="text-muted-foreground">Ready to plan some delicious meals? Let's get cooking!</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <ChefHat className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle>Create Meal Plan</CardTitle>
                <CardDescription>Generate a new weekly meal plan</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-50">
            <CardHeader className="text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <CardTitle className="text-muted-foreground">Shopping Lists</CardTitle>
              <CardDescription>
                <Badge variant="secondary" className="text-xs">
                  Premium Feature
                </Badge>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-50">
            <CardHeader className="text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <CardTitle className="text-muted-foreground">Nutrition Tracking</CardTitle>
              <CardDescription>
                <Badge variant="secondary" className="text-xs">
                  Premium Feature
                </Badge>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Meal Plans */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-serif font-bold">Recent Meal Plans</h2>
            <Link href="/">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          {recentMealPlans && recentMealPlans.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">
              {recentMealPlans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plan.title}</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardDescription>Week of {new Date(plan.week_start_date).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        ${plan.total_estimated_cost?.toFixed(2) || "0.00"} estimated
                      </span>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No meal plans yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first meal plan to get started with organized cooking!
                </p>
                <Link href="/">
                  <Button>Create Your First Meal Plan</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Upgrade Prompt */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-primary" />
              <CardTitle>Unlock Premium Features</CardTitle>
            </div>
            <CardDescription>
              Get unlimited meal plans, AI-powered suggestions, and smart shopping lists
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <ul className="text-sm space-y-1">
                  <li>• Unlimited meal plans</li>
                  <li>• Advanced AI recommendations</li>
                  <li>• Nutritional analysis</li>
                  <li>• Smart shopping lists</li>
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <Link href="/pricing">
                  <Button className="w-full">
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade to Premium
                  </Button>
                </Link>
                <p className="text-xs text-center text-muted-foreground">14-day free trial</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
