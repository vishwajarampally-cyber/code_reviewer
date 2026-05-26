import React from 'react'
import '../styles/card.css'

export default function BestPracticesCard({ list=[] }){
  return (
    <div className="card best-practices-card">
      <h3>Best Practices</h3>
      <ul>
        {list.length===0 && <li>No recommendations</li>}
        {list.map((s,i)=> <li key={i}>{s}</li>)}
      </ul>
    </div>
  )
}

