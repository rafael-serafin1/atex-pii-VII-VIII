import { useState } from "react"
import { DiaAula } from "../Form/FormHandlers";

export function DiaCard({ dia, onVerAlunos }: { dia: DiaAula; onVerAlunos: () => void }) {
  const [hovered, setHovered] = useState(false)
  const presentes = dia.alunos.filter(a => a.presenca === 'presente').length

  return (
    <div
      style={{ background: hovered ? 'rgba(11,26,14,0.95)' : 'rgba(11,26,14,0.82)', border: `1px solid ${hovered ? 'rgba(57,255,20,0.25)' : 'var(--color-pcb-trace)'}`, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Aula number badge */}
      <div style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(26,74,34,0.6)', borderLeft: '1px solid var(--color-pcb-trace)', borderBottom: '1px solid var(--color-pcb-trace)', padding: '2px 10px', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--color-text-muted)', letterSpacing: '0.12em' }}>
        AULA {String(dia.id).padStart(2, '0')}
      </div>

      {/* Title */}
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: '#c8f5c8', margin: 0, letterSpacing: '0.06em', lineHeight: 1.3, paddingRight: 60 }}>
        {dia.titulo}
      </h3>

      {/* Summary */}
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6 }}>
        {dia.resumo}
      </p>

      {/* Divider trace */}
      <div style={{ height: 1, background: 'var(--color-pcb-trace)' }} />

      {/* Meta + button row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <rect x="1" y="2" width="9" height="8" rx="1" stroke="#6a9a6a" strokeWidth="1" fill="none"/>
              <line x1="3.5" y1="1" x2="3.5" y2="3" stroke="#6a9a6a" strokeWidth="1"/>
              <line x1="7.5" y1="1" x2="7.5" y2="3" stroke="#6a9a6a" strokeWidth="1"/>
              <line x1="1" y1="5" x2="10" y2="5" stroke="#6a9a6a" strokeWidth="1"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>{dia.dia}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <circle cx="5.5" cy="5.5" r="4.5" stroke="#6a9a6a" strokeWidth="1" fill="none"/>
              <line x1="5.5" y1="3" x2="5.5" y2="5.5" stroke="#6a9a6a" strokeWidth="1"/>
              <line x1="5.5" y1="5.5" x2="7.5" y2="7" stroke="#6a9a6a" strokeWidth="1"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>{dia.horario}</span>
          </div>
        </div>

        <button
          onClick={onVerAlunos}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', padding: '0.3rem 0.75rem', background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5 }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.14)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(0,212,255,0.15)' }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.06)'; e.currentTarget.style.boxShadow = 'none' }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="4" r="2" stroke="#00d4ff" strokeWidth="1" fill="none"/>
            <path d="M1 9c0-2 1.8-3 4-3s4 1 4 3" stroke="#00d4ff" strokeWidth="1" strokeLinecap="round" fill="none"/>
          </svg>
          {presentes}/{dia.alunos.length} ALUNOS
        </button>
      </div>
    </div>
  )
}