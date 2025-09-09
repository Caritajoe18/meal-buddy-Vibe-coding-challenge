import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChefHat, Mail } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <Link href="/" className="flex items-center justify-center gap-2 mb-4">
              <ChefHat className="h-8 w-8 text-primary" />
              <span className="text-2xl font-serif font-bold">Meal Buddy</span>
            </Link>
          </div>
          <Card>
            <CardHeader className="text-center">
              <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription>We've sent you a confirmation link</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                You&apos;ve successfully signed up for Meal Buddy, Please check your email to confirm your account before
                signing in.
              </p>
              <p className="text-xs text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder or{" "}
                <Link href="/auth/sign-up" className="underline text-primary">
                  try signing up again
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
