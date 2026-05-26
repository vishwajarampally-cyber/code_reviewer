import React, { useState } from 'react'
import '../styles/card.css'

export default function IssuesCard({ issues=[] }){
  const [open, setOpen] = useState(true)
  return (
    <div className="card issues-card">
      <div className="card-header">
        <h3>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'var(--danger)' }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Issues ({issues.length})
        </h3>
        <button onClick={()=>setOpen(!open)}>{open? 'Collapse':'Expand'}</button>
      </div>
      {open && (
        <ul className="issues-list">
          {issues.length===0 && <li className="no-issues">No issues found</li>}
          {issues.map((it, idx)=> (
            <li key={idx} className={`issue ${it.severity?.toLowerCase()||'low'}`}>
              <div className="meta">
                <strong>{it.severity}</strong> 
                <span>• Line {it.line}</span>
              </div>
              <div className="problem">{it.problem}</div>
              <div className="solution"><strong>Solution:</strong> {it.solution}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

