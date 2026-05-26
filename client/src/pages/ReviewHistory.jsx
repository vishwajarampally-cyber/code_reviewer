import React, { useEffect, useState } from 'react'
import api from '../services/api'
import '../styles/history.css'

export default function ReviewHistory(){
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{fetchList()}, [])

  async function fetchList(){
    try {
      const r = await api.get('/reviews')
      if (r.data && r.data.success) setList(r.data.reviews)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function del(id){
    try {
      await api.delete(`/review/${id}`)
      fetchList()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Review History</h2>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>Loading history...</div>
      ) : list.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '48px 24px', 
          background: 'var(--card)', 
          borderRadius: 'var(--radius)', 
          border: '1px solid var(--border)',
          color: 'var(--text-secondary)' 
        }}>
          No review history found. Submit some code on the Dashboard to get started!
        </div>
      ) : (
        <div className="history-list">
          {list.map(it=> (
            <div className="history-item" key={it._id}>
              <div>
                <div className="lang">{it.language}</div>
                <div className="summary">{it.reviewSummary}</div>
                <div className="meta">Score: <span>{it.score}</span></div>
              </div>
              <div className="actions">
                <button onClick={()=>del(it._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

