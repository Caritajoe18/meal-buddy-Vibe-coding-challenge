import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Crown, Users } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out Meal Buddy",
      features: ["3 meal plans per month", "Basic ingredient suggestions", "Simple recipes", "Email support"],
      limitations: ["Limited to 3 ingredients per meal plan", "No nutritional analysis", "No shopping lists"],
      cta: "Get Started Free",
      popular: false,
      icon: Star,
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "per month",
      description: "For families who want better meal planning",
      features: [
        "Unlimited meal plans",
        "AI-powered recipe suggestions",
        "Complete nutritional analysis",
        "Smart shopping lists",
        "Meal prep guides",
        "Recipe customization",
        "Export to calendar",
        "Priority support",
      ],
      limitations: [],
      cta: "Start Premium Trial",
      popular: true,
      icon: Crown,
    },
    {
      name: "Family",
      price: "$19.99",
      period: "per month",
      description: "Perfect for large families and meal prep enthusiasts",
      features: [
        "Everything in Premium",
        "Up to 6 family members",
        "Bulk meal prep planning",
        "Cost optimization by location",
        "Advanced dietary restrictions",
        "Grocery store integration",
        "Family nutrition tracking",
        "Dedicated account manager",
      ],
      limitations: [],
      cta: "Start Family Trial",
      popular: false,
      icon: Users,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Crown className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-serif font-bold text-foreground">Meal Buddy</h1>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
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
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-balance mb-6">
            Choose Your
            <span className="text-primary"> Meal Planning</span> Journey
          </h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto mb-8">
            Start free and upgrade when you're ready for advanced AI-powered meal planning, nutritional analysis, and
            family features.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const IconComponent = plan.icon
              return (
                <Card key={index} className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <IconComponent
                      className={`h-12 w-12 mx-auto mb-4 ${plan.popular ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <CardTitle className="font-serif text-2xl">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm uppercase tracking-wide">Included Features</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {plan.limitations.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                          Limitations
                        </h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, limitIndex) => (
                            <li key={limitIndex} className="flex items-start gap-2">
                              <div className="h-4 w-4 mt-0.5 flex-shrink-0 rounded-full bg-muted" />
                              <span className="text-sm text-muted-foreground">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button
                      className={`w-full ${plan.popular ? "bg-primary" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
                <p className="text-muted-foreground">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of
                  your billing period.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards, PayPal, and Apple Pay for your convenience.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Is there a free trial?</h3>
                <p className="text-muted-foreground">
                  Yes! Premium and Family plans come with a 14-day free trial. No credit card required to start.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">How does the AI meal planning work?</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your available ingredients, dietary preferences, and location to create personalized,
                  balanced meal plans that minimize waste and cost.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I share my account with family?</h3>
                <p className="text-muted-foreground">
                  The Family plan allows up to 6 family members to share meal plans, shopping lists, and preferences.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
                <p className="text-muted-foreground">
                  We offer a 30-day money-back guarantee if you're not satisfied with your subscription.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">Ready to Transform Your Kitchen?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of families saving time, money, and reducing food waste with AI-powered meal planning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              Try Free Version
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
