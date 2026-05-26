import React, { useEffect, useState } from 'react'
import api from '../services/api'
import '../styles/analytics.css'

export default function Analytics(){
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{load()}, [])

  async function load(){
    try {
      const r = await api.get('/analytics')
      if (r.data && r.data.success) setData(r.data.analytics)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>Loading analytics...</div>
  }

  if (!data) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '48px 24px', 
        background: 'var(--card)', 
        borderRadius: 'var(--radius)', 
        border: '1px solid var(--border)',
        color: 'var(--text-secondary)',
        maxWidth: '600px',
        margin: '0 auto' 
      }}>
        No analytics data available.
      </div>
    )
  }

  // Calculate totals for progress bars
  const langKeys = Object.keys(data.languageUsage || {});
  const totalLangCount = langKeys.reduce((acc, k) => acc + (data.languageUsage[k] || 0), 0);

  const issueKeys = Object.keys(data.issueDistribution || {});
  const totalIssueCount = issueKeys.reduce((acc, k) => acc + (data.issueDistribution[k] || 0), 0);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
        <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Analytics & Insights</h2>
      </div>

      <div className="analytics-grid">
        <div className="card stat-card">
          <h3>Total Reviews</h3>
          <div className="big">{data.totalReviews}</div>
        </div>

        <div className="card stat-card">
          <h3>Average Score</h3>
          <div className="big">{typeof data.averageScore === 'number' ? data.averageScore.toFixed(1) : data.averageScore}</div>
        </div>

        <div className="card">
          <h3>Language Usage</h3>
          <div className="analytics-list">
            {langKeys.length === 0 && <div style={{ color: 'var(--muted)', fontSize: '14px' }}>No language data</div>}
            {langKeys.map(lang => {
              const count = data.languageUsage[lang] || 0;
              const pct = totalLangCount > 0 ? (count / totalLangCount) * 100 : 0;
              return (
                <div className="analytics-row" key={lang}>
                  <div className="analytics-row-info">
                    <span>{lang}</span>
                    <span className="count">{count} {count === 1 ? 'review' : 'reviews'}</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3>Issue Distribution</h3>
          <div className="analytics-list">
            {issueKeys.length === 0 && <div style={{ color: 'var(--muted)', fontSize: '14px' }}>No issue data</div>}
            {issueKeys.map(issueType => {
              const count = data.issueDistribution[issueType] || 0;
              const pct = totalIssueCount > 0 ? (count / totalIssueCount) * 100 : 0;
              return (
                <div className="analytics-row" key={issueType}>
                  <div className="analytics-row-info">
                    <span>{issueType} Severity</span>
                    <span className="count">{count} {count === 1 ? 'issue' : 'issues'}</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className={`progress-bar ${issueType}`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
