import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/header.css'

export default function Header({ toggleTheme, theme }){
  const loc = useLocation()
  return (
    <header className="acr-header">
      <div className="container">
        <div className="brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="brand-logo">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          Automated Code Reviewer
        </div>
        <nav>
          <Link className={loc.pathname==='/'? 'active':''} to="/">Dashboard</Link>
          <Link className={loc.pathname==='/history'? 'active':''} to="/history">Review History</Link>
          <Link className={loc.pathname==='/analytics'? 'active':''} to="/analytics">Analytics</Link>
        </nav>
        <div className="controls">
          <button className="theme-toggle" aria-label="Toggle dark mode" onClick={toggleTheme}>
            {theme==='light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  )
}

