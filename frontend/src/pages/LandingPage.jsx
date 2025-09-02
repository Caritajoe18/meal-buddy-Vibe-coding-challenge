import { Link } from "react-router-dom"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream text-dark p-6">
      <h1 className="text-4xl font-bold mb-4">Vibe — Smart Meal Planner</h1>
      <p className="text-lg text-gray-700 max-w-md text-center mb-6">
        Get personalized 7-day meal plans based on your ingredients and diet. 
        Sign up to subscribe and unlock healthy eating made simple.
      </p>
      <div className="flex gap-4">
        <Link
          to="/signup"
          className="px-6 py-3 bg-green text-white rounded-lg shadow"
        >
          Get Started
        </Link>
        <Link
          to="/app"
          className="px-6 py-3 bg-gray-200 rounded-lg shadow"
        >
          Demo
        </Link>
      </div>
    </div>
  )
}
