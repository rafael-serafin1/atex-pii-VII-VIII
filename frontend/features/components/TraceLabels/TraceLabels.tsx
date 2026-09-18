/// 
///

export function TraceLabel({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 20, height: 1, background: 'var(--color-pcb-trace)' }} />
      <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        {text}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--color-pcb-trace)' }} />
    </div>
  )
}