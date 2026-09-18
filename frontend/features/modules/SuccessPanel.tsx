
export function SuccessPanel({ title, message, onReset }: { title: string; message: string; onReset: () => void }) {
  return (
    <div style={{ padding: '2rem', border: '1px solid rgba(57,255,20,0.3)', background: 'rgba(57,255,20,0.05)', textAlign: 'center' }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto 12px', display: 'block' }}>
        <circle cx="24" cy="24" r="22" stroke="#39ff14" strokeWidth="2" fill="none" />
        <path d="M14 24l7 7 13-14" stroke="#39ff14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#39ff14', textShadow: '0 0 8px rgba(57,255,20,0.4)', letterSpacing: '0.1em', margin: '0 0 8px' }}>{title}</p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>{message}</p>
      <button
        onClick={onReset}
        style={{ marginTop: '1.25rem', background: 'none', border: '1px solid var(--color-pcb-trace)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', padding: '0.4rem 1rem', cursor: 'pointer', letterSpacing: '0.1em', transition: 'border-color 0.2s, color 0.2s' }}
        onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(57,255,20,0.4)'; e.currentTarget.style.color = '#c8f5c8' }}
        onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--color-pcb-trace)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}
      >
        NOVO CADASTRO
      </button>
    </div>
  )
}