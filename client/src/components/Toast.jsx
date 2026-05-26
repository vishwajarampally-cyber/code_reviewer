import React, { useEffect } from 'react'
import '../styles/toast.css'

export default function Toast({ toast, onClose }){
  useEffect(()=>{
    if (!toast) return;
    const id = setTimeout(()=> onClose && onClose(), 3500);
    return ()=>clearTimeout(id);
  }, [toast])

  if (!toast) return null;
  return (
    <div className={`toast ${toast.type||''}`} onClick={()=>onClose && onClose()}>
      {toast.type === 'success' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : toast.type === 'error' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ) : null}
      <span>{toast.message}</span>
    </div>
  )
}

