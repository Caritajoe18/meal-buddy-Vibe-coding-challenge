// src/pages/SignupPage.jsx
import React, { useState } from "react"
import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"

export default function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isLogin, setIsLogin] = useState(true) // toggle between login and signup

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let result
      if (isLogin) {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        })
      } else {
        result = await supabase.auth.signUp({
          email,
          password,
        })
      }

      if (result.error) {
        setError(result.error.message)
      } else {
        navigate("/app")
      }
    } catch (err) {
      setError("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">
          {isLogin ? "Login to Your Account" : "Create an Account"}
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 hover:underline"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  )
}
