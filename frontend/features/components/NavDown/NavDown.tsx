import { useEffect, useRef, useState } from 'react'

export type Page = 'aluno' | 'curso' | 'agenda'

export type NavGroup = { label: string; items: { id: Page; label: string }[] }

export const NAV_GROUPS: NavGroup[] = [
  { label: 'AULAS',    items: [{ id: 'agenda', label: 'AGENDA' }] },
  { label: 'CADASTRO', items: [{ id: 'aluno', label: 'ALUNO' }, { id: 'curso', label: 'CURSO' }] },
]

export function NavDropdown({ group, page, onSelect }: { group: NavGroup; page: Page; onSelect: (p: Page) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const groupActive = group.items.some(i => i.id === page)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          letterSpacing: '0.12em',
          padding: '0.35rem 0.85rem',
          cursor: 'pointer',
          border: '1px solid',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: groupActive || open ? 'rgba(57,255,20,0.1)' : 'transparent',
          borderColor: groupActive || open ? 'rgba(57,255,20,0.5)' : 'var(--color-pcb-trace)',
          color: groupActive || open ? '#39ff14' : 'var(--color-text-muted)',
          textShadow: groupActive || open ? '0 0 6px rgba(57,255,20,0.4)' : 'none',
          boxShadow: groupActive || open ? '0 0 8px rgba(57,255,20,0.1)' : 'none',
        }}
        onMouseOver={e => { if (!groupActive && !open) { e.currentTarget.style.borderColor = 'rgba(57,255,20,0.25)'; e.currentTarget.style.color = '#c8f5c8' } }}
        onMouseOut={e => { if (!groupActive && !open) { e.currentTarget.style.borderColor = 'var(--color-pcb-trace)'; e.currentTarget.style.color = 'var(--color-text-muted)' } }}
      >
        {groupActive && <span style={{ fontSize: '0.6rem' }}>▶</span>}
        {group.label}
        <svg width="8" height="6" viewBox="0 0 8 6" fill="none" style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          minWidth: '100%',
          background: 'rgba(6,14,6,0.97)',
          border: '1px solid var(--color-pcb-trace)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(57,255,20,0.05)',
          zIndex: 50,
          overflow: 'hidden',
        }}>
          {/* top trace line */}
          <div style={{ height: 2, background: 'linear-gradient(90deg, rgba(57,255,20,0.4), rgba(57,255,20,0.05))' }} />
          {group.items.map((item, i) => {
            const active = page === item.id
            return (
              <button
                key={item.id}
                onClick={() => { onSelect(item.id); setOpen(false) }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '0.55rem 1rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  border: 'none',
                  borderBottom: i < group.items.length - 1 ? '1px solid var(--color-pcb-trace)' : 'none',
                  transition: 'all 0.15s',
                  background: active ? 'rgba(57,255,20,0.1)' : 'transparent',
                  color: active ? '#39ff14' : 'var(--color-text-muted)',
                  textAlign: 'left',
                }}
                onMouseOver={e => { if (!active) { e.currentTarget.style.background = 'rgba(57,255,20,0.06)'; e.currentTarget.style.color = '#c8f5c8' } }}
                onMouseOut={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)' } }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: active ? '#39ff14' : 'var(--color-pcb-trace)', boxShadow: active ? '0 0 4px #39ff14' : 'none', flexShrink: 0, display: 'inline-block' }} />
                {item.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}