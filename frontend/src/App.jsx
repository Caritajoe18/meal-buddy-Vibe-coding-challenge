import React, { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import LandingPage from "./pages/LandingPage"
import SignUpPage from "./pages/SignupPage"

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    const currentSession = supabase.auth.getSession()
    currentSession.then(({ data }) => {
      setSession(data.session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/signup"
          element={!session ? <SignUpPage /> : <Navigate to="/app" />}
        />
        {/* <Route
          path="/app"
          element={session ? <AppPage /> : <Navigate to="/signup" />}
        /> */}
      </Routes>
    </Router>
  )
}
