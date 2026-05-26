import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ReviewHistory from './pages/ReviewHistory'
import Analytics from './pages/Analytics'
import Header from './components/Header'
import './styles/app.css'

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const toggleTheme = () => {
    const t = theme === 'light' ? 'dark' : 'light'
    setTheme(t)
    localStorage.setItem('theme', t)
    document.documentElement.setAttribute('data-theme', t)
  }

  return (
    <div className="app-root">
      <Header toggleTheme={toggleTheme} theme={theme} />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<ReviewHistory />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>
    </div>
  )
}
