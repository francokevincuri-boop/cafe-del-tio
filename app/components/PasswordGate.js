'use client'
import { useState, useEffect } from 'react'

const PASSWORD = 'cafe2025'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  .gate{min-height:100vh;background:#F5EFE6;display:flex;align-items:center;justify-content:center;font-family:'Lora',serif}
  .gate-card{background:#FDF8F2;border:1.5px solid #D4B896;border-radius:20px;padding:40px 32px;width:100%;max-width:340px;text-align:center;box-shadow:0 8px 32px rgba(92,61,46,.1)}
  .gate-icon{font-size:48px;margin-bottom:16px}
  .gate-title{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:#5C3D2E;margin-bottom:6px}
  .gate-sub{font-size:13px;color:#7A5C48;font-style:italic;margin-bottom:28px}
  .gate-input{width:100%;background:#F5EFE6;border:1.5px solid #D4B896;border-radius:12px;padding:14px 16px;font-family:'Lora',serif;font-size:16px;color:#2C1A0E;outline:none;text-align:center;letter-spacing:3px;transition:border-color .2s;margin-bottom:12px}
  .gate-input:focus{border-color:#C8873A}
  .gate-input.error{border-color:#CC3333;animation:shake .3s ease}
  .gate-btn{width:100%;background:#5C3D2E;color:#E8D5B7;border:none;border-radius:12px;padding:14px;font-family:'Playfair Display',serif;font-size:16px;font-weight:600;cursor:pointer;transition:background .2s}
  .gate-btn:hover{background:#C8873A}
  .gate-error{color:#CC3333;font-size:12px;font-style:italic;margin-top:8px;height:16px}
  @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
`

export default function PasswordGate({ children, titulo = 'Área restringida', subtitulo = 'Ingresá la contraseña para continuar' }) {
  const [input, setInput] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Key única por ruta para sesiones independientes admin vs mesero
  const sessionKey = `gate_${typeof window !== 'undefined' ? window.location.pathname : 'default'}`

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(sessionKey)
      if (saved === 'ok') setUnlocked(true)
    }
  }, [sessionKey])

  const intentar = () => {
    if (input === PASSWORD) {
      sessionStorage.setItem(sessionKey, 'ok')
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
      setInput('')
      setTimeout(() => setError(false), 2000)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') intentar()
  }

  if (!mounted) return null
  if (unlocked) return children

  return (
    <>
      <style>{css}</style>
      <div className="gate">
        <div className="gate-card">
          <div className="gate-icon">☕</div>
          <div className="gate-title">{titulo}</div>
          <div className="gate-sub">{subtitulo}</div>
          <input
            className={`gate-input ${error ? 'error' : ''}`}
            type="password"
            placeholder="••••••••"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            autoFocus
          />
          <button className="gate-btn" onClick={intentar}>Entrar →</button>
          <div className="gate-error">{error ? 'Contraseña incorrecta' : ''}</div>
        </div>
      </div>
    </>
  )
}
