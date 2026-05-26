import React, { useState } from 'react'
import '../styles/card.css'

export default function ImprovedCodeCard({ code='' }){
  const [copied, setCopied] = useState(false)

  function copy(){ 
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card improved-code-card">
      <div className="card-header">
        <h3>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'var(--accent)' }}>
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            <line x1="12" y1="22" x2="12" y2="15.5" />
            <polyline points="22 8.5 12 15.5 2 8.5" />
            <polyline points="2 8.5 12 2 22 8.5" />
            <line x1="12" y1="2" x2="12" y2="15.5" />
          </svg>
          Improved Code
        </h3>
        <button onClick={copy}>{copied ? 'Copied!' : 'Copy'}</button>
      </div>
      <div className="improved-code-wrap">
        <pre className="improved-code"><code>{code || 'No improved code provided'}</code></pre>
      </div>
    </div>
  )
}

