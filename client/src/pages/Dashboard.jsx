import React, { useState, useEffect } from 'react'
import CodeEditor from '../components/Editor'
import '../styles/dashboard.css'
import api from '../services/api'
import ReviewScoreCard from '../components/ReviewScoreCard'
import SummaryCard from '../components/SummaryCard'
import IssuesCard from '../components/IssuesCard'
import ImprovedCodeCard from '../components/ImprovedCodeCard'
import BestPracticesCard from '../components/BestPracticesCard'
import Toast from '../components/Toast'
import Spinner from '../components/Spinner'

const languages = ['javascript','typescript','python','java','c','cpp','go']

export default function Dashboard(){
  const [code, setCode] = useState(localStorage.getItem('recentCode') || '// Paste your code here')
  const [language, setLanguage] = useState('javascript')
  const [loading, setLoading] = useState(false)
  const [review, setReview] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(()=>{localStorage.setItem('recentCode', code)}, [code])

  async function handleReview(){
    setLoading(true)
    try {
      const resp = await api.post('/review', { code, language })
      if (resp.data && resp.data.success){
        setReview(resp.data.review)
        setToast({ type: 'success', message: 'Review completed' })
      } else {
        setToast({ type: 'error', message: 'Review failed' })
      }
    } catch (err){
      console.error(err)
      setToast({ type: 'error', message: err.message || 'Request failed' })
    } finally { setLoading(false) }
  }

  function handleClear(){ setCode('') }
  function handleCopy(){ navigator.clipboard.writeText(code); setToast({type:'success', message:'Copied code'}) }

  return (
    <div className="dashboard-grid">
      <section className="top">
        <h1>Welcome to Automated Code Reviewer</h1>
        <p>Paste your source code, select language, and get an AI-powered review.</p>
      </section>

      <section className="editor-section">
        <div className="editor-controls">
          <select value={language} onChange={e=>setLanguage(e.target.value)}>
            {languages.map(l=> <option key={l} value={l}>{l}</option>)}
          </select>
          <div className="buttons">
            <button onClick={handleReview}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
              Review Code
            </button>
            <button onClick={handleClear}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Clear
            </button>
            <button onClick={handleCopy}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy Code
            </button>
          </div>
        </div>

        <CodeEditor value={code} onChange={setCode} language={language} />
      </section>

      <section className="results">
        {loading && <Spinner />}
        {review && (
          <div className="cards">
            <ReviewScoreCard score={parseInt(review.score) || 0} />
            <SummaryCard summary={review.summary} />
            <IssuesCard issues={review.issues} />
            <ImprovedCodeCard code={review.improvedCode} />
            <BestPracticesCard list={review.bestPractices} />
          </div>
        )}
      </section>

      <Toast toast={toast} onClose={()=>setToast(null)} />
    </div>
  )
}

