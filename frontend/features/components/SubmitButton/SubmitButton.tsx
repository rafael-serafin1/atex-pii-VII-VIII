
export function SubmitButton({ label }: { label: string }) {
  return (
    <div style={{ marginTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button
        type="submit"
        style={{ width: '100%', padding: '0.75rem', background: 'rgba(57,255,20,0.08)', border: '1px solid rgba(57,255,20,0.4)', color: '#39ff14', fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.15em', cursor: 'pointer', transition: 'all 0.2s', textShadow: '0 0 8px rgba(57,255,20,0.4)' }}
        onMouseOver={e => { e.currentTarget.style.background = 'rgba(57,255,20,0.15)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(57,255,20,0.2)' }}
        onMouseOut={e => { e.currentTarget.style.background = 'rgba(57,255,20,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
      >
        {label}
      </button>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-muted)', textAlign: 'center', margin: 0 }}>* Campos obrigatórios</p>
    </div>
  )
}