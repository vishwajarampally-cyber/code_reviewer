import React, { useRef, useState, useEffect } from 'react'
import Editor, { useMonaco } from '@monaco-editor/react'
import '../styles/editor.css'

export default function CodeEditor({ value, onChange, language, options }){
  const monaco = useMonaco();
  const ref = useRef();
  const [editorTheme, setEditorTheme] = useState('light')

  useEffect(() => {
    const getTheme = () => {
      const t = document.documentElement.getAttribute('data-theme') || 'light';
      return t === 'dark' ? 'vs-dark' : 'light';
    };
    setEditorTheme(getTheme());

    const observer = new MutationObserver(() => {
      setEditorTheme(getTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  function handleMount(editor, mon) {
    ref.current = editor;
    editor.getModel().updateOptions({ tabSize: 2 });
  }

  function format() {
    const editor = ref.current;
    if (!editor) return;
    editor.getAction('editor.action.formatDocument').run();
  }

  return (
    <div className="editor-wrap">
      <Editor
        height="50vh"
        defaultLanguage={language}
        language={language}
        value={value}
        theme={editorTheme}
        onMount={handleMount}
        onChange={(v)=>onChange(v)}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          fontSize: 14,
          fontFamily: "'Fira Code', 'Courier New', Courier, monospace",
          fontLigatures: true,
          roundedSelection: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          padding: { top: 12, bottom: 12 },
          ...options
        }}
      />
      <div className="editor-actions">
        <button onClick={format}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          Format
        </button>
      </div>
    </div>
  )
}

