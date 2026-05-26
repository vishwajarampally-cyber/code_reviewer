import React from 'react'
import './styles/reviewScore.css'

export default function ReviewScoreCard({ score }){
  const pct = Math.max(0, Math.min(100, score))
  
  const getScoreTier = (s) => {
    if (s >= 90) return { label: 'Exceptional', color: 'success', desc: 'Outstanding code structure and quality.' };
    if (s >= 75) return { label: 'Very Good', color: 'info', desc: 'Solid code with minor optimizations possible.' };
    if (s >= 50) return { label: 'Needs Polish', color: 'warning', desc: 'Constructive suggestions found to improve code.' };
    return { label: 'Refactor Needed', color: 'danger', desc: 'Significant issues detected that need fixing.' };
  }

  const tier = getScoreTier(pct);

  return (
    <div className="card score-card">
      <div className="score-circle-container">
        <div className="score-circle">
          <svg viewBox="0 0 36 36">
            <path className="circle-bg" d="M18 2.0845a15.9155 15.9155 0 1 0 0 31.831" />
            <path className="circle" strokeDasharray={`${pct},100`} d="M18 2.0845a15.9155 15.9155 0 1 0 0 31.831" />
          </svg>
          <div className="score-text">{pct}<span>/100</span></div>
        </div>
      </div>
      <div className="score-meta">
        <h3>Overall Score</h3>
        <div className="score-tier-badge-wrap">
          <span className={`score-tier-badge ${tier.color}`}>{tier.label}</span>
        </div>
        <p className="score-desc">{tier.desc}</p>
      </div>
    </div>
  )
}

